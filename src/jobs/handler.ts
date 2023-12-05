import { Job } from "agenda";
import { JobData } from "../types";
import { log } from "@drantaz/f-log";

export default class JobHandler {
  static sendMessage = async (job: Job<JobData>, done: Function) => {};

  static manageTask = (callback: Function) => {
    return async (job: Job<JobData>, done: Function) => {
      try {
        const { chronology } = job.attrs.data;
        await callback();
        done();
        chronology === "schedule" && (await job.remove());
      } catch ({ message }) {
        job.fail(message);
        log(message, "error", false);
      }
    };
  };
}
