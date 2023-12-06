import IORedis from "ioredis";
import { Worker, Queue, Job, WorkerListener, WorkerOptions } from "bullmq";
import { JobData, RedisConcurrency } from "../types";
import Helper from "../lib";
import { log } from "@drantaz/f-log";
import humanInterval from "human-interval";

export default class ChronoBullMQ {
  private allowRejuvenation: boolean = false;
  private connection: IORedis;
  private queue: Queue;

  constructor(
    host: string,
    port: number,
    password: string,
    allowRejuvenation: boolean
  ) {
    this.connection = new IORedis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    });
    this.allowRejuvenation = allowRejuvenation;

    this.queue = new Queue("chrono_queue", { connection: this.connection });

    (async () => {
      if (this.allowRejuvenation) {
        await this.rejuvenate();
      } else {
        await this.queue.obliterate();
      }
    })();
  }

  private rejuvenate = async () => {
    const jobs = await this.queue.getJobs();
    for (let index = 0; index < jobs.length; index++) {
      const _job = jobs[index];
      await this.queue.resume();
      const worker = new Worker(
        this.queue.name,
        async (job: Job) => {
          try {
            const code = eval(`(${_job.data["fn"]})`);
            await code(job);
          } catch (err) {
            log(err.message, "critical", false);
          }
        },
        { connection: this.connection, autorun: false }
      );
      await worker.run();
      await _job.remove();
    }
  };

  private isRedisConcurrency(obj: object): obj is RedisConcurrency {
    const keys = Object.keys(obj);
    return keys.includes("when") || keys.includes("repeatInterval");
  }

  scheduleTask = async (
    name: string,
    payload: any,
    chronology: JobData["chronology"],
    concurrency: RedisConcurrency,
    callback: Function
  ) => {
    if (!this.isRedisConcurrency(concurrency)) {
      log(
        "Please provide a RedisConcurrency instance as `when` parameter.",
        "error",
        false
      );
      return;
    }

    let delay: number = 0;
    const start = new Date().getTime();
    if (typeof concurrency.when === "object") {
      const when = concurrency.when.getTime();
      delay = when - start;
    } else {
      if (Helper.isValidDate(concurrency.when)) {
        delay = new Date(concurrency.when).getTime() - start;
      } else if (!isNaN(humanInterval(concurrency.when))) {
        delay = humanInterval(concurrency.when);
      } else {
        log("Please provide a valid date", "error", false);
        return;
      }
    }

    this.queue.add(name, payload, {
      delay,
      removeOnComplete: chronology === "schedule",
      repeat:
        chronology !== "schedule" ? concurrency.repeatInterval : undefined,
    });

    const worker = new Worker(
      "chrono_queue",
      async (job: Job) => {
        await callback(job);
      },
      { connection: this.connection, autorun: false }
    );

    await worker.run();

    return [this.queue, worker];
  };

  /**
   * Get access to the jobs configured in BullMQ.
   */
  getJobs = async () => {
    return this.queue.getJobs();
  };
}
