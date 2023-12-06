import { log } from "@drantaz/f-log";
import { JobData } from "../types";
import { v4 as uuidv4 } from "uuid";
import serializeJavascript from "serialize-javascript";
import Agenda from "agenda";
import JobHandler from "../jobs/handler";

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
    when: Date | string,
    callback: Function
  ) => {
    await this.agenda.start();
    const jobName = `${name}-${uuidv4()}`;
    this.agenda.define(
      jobName,
      { shouldSaveResult: true },
      JobHandler.manageTask(callback)
    );
    const record =
      payload.chronology === "interval"
        ? await this.agenda.every(
            typeof when === "object" ? when.toISOString() : when,
            jobName,
            {
              ...payload,
              callback: serializeJavascript(callback),
              name,
            },
            { skipImmediate: true }
          )
        : await this.agenda.schedule(when, jobName, {
            ...payload,
            callback: serializeJavascript(callback),
            name,
          });
    return record;
  };

  /**
   * Get access to the jobs configured in Agenda.
   */
  getJobs = async () => {
    await this.agenda.start();
    return this.agenda.jobs();
  };
}
