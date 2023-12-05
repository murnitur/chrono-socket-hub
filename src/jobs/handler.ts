import { Job } from "agenda";
import { JobData } from "../types";

export default class JobHandler {
  static sendMessage = async (job: Job<JobData>, done: Function) => {};

  static manageTask = async (job: Job<JobData>, done: Function) => {};
}
