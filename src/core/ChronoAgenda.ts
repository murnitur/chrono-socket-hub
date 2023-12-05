import { log } from "@drantaz/f-log";
import { JobData } from "../types";
import { v4 as uuidv4 } from "uuid";
import Agenda from "agenda";
import JobHandler from "../jobs/handler";
import shortid from "shortid";

export default class ChronoAgenda {
  private agenda: Agenda;
  private logging: boolean;

  constructor(db: string, logging: boolean) {
    this.agenda = new Agenda({
      db: {
        address: db,
        collection: "chrono_jobs",
      },
      defaultConcurrency: 30,
      maxConcurrency: 100,
    });
    this.logging = logging;
    this.agenda
      .start()
      .then(() => {
        this.logging &&
          log("Chrono job with agenda has started", "info", false);
      })
      .catch((err) => {
        this.logging && log(err.message, "error", false);
      });
  }

  /**
   * Adds a job to the agenda
   * @name name of the job
   * @payload payload of the job
   * @when when to run the job
   */
  scheduleTask = async (
    name: string,
    payload: JobData,
    when: Date | string
  ) => {
    const reference = shortid.generate();
    const jobName = `${name}-${uuidv4()}`;
    this.agenda.define(
      jobName,
      payload.type === "message"
        ? JobHandler.sendMessage
        : JobHandler.manageTask
    );
    const record = await (payload.chronology === "interval"
      ? this.agenda.every(
          typeof when === "object" ? when.toISOString() : when,
          jobName,
          { ...payload, reference },
          { skipImmediate: false }
        )
      : this.agenda.schedule(when, jobName, { ...payload, reference }));
    return record;
  };

  /**
   * Rejuvenate jobs
   */
  rejuvenate = async () => {};
}
