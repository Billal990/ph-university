import { TDays } from "./offeredCourse.interface";

type TSchedule = {
    startTime:string;
    endTime:string;
    days:TDays
}

export const hasTimeConflict = (assignedSchedules:TSchedule[], newSchedule:TSchedule)=>{
    for(const schedule of assignedSchedules){
        const exsistingStartTime = `1970-01-01T${schedule.startTime}:00`;
        const exsistingEndTime = `1970-01-01T${schedule.endTime}:00`;
    
        const newStartTime = `1970-01-01T${newSchedule.startTime}:00`;
        const newEndTime = `1970-01-01T${newSchedule.endTime}:00`;
    
        if(newStartTime < exsistingEndTime && newEndTime > exsistingStartTime){
            console.log("Conflicted Time")
          return true
        }
    }


    return false;
}