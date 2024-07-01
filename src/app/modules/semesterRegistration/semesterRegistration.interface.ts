import { Types } from "mongoose"

type TStatus = "UPCOMMING" | "ONGOING" | "ENDED";

export type TSemesterRegistration = {
    academicSemester:Types.ObjectId;
    status:TStatus;
    minCredit:number;
    maxCredit:number;
    startDate:Date;
    endDate:Date;
}