import {StatisticsByDay} from "./statisticsByDay.model";

export interface Statistics {
  usersNbr: number;
  batchsNbrs: number;
  batchsRunnedNbrs: number;
  applicationsNbr: number;
  avgExecutionTime: number;
  statisticsByDay: StatisticsByDay[];
}
