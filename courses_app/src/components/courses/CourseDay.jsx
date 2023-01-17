import React, { useState } from "react";
import {
  initialCourseEndHours,
  initialCourseStartHours,
} from "../../utils/utils";

const CourseDay = ({ day, formState, dispatchForm }) => {
  const [scheduleStartHours, setScheduleStartHours] = useState(
    initialCourseStartHours
  );
  const [scheduleEndHours, setScheduleEndHours] = useState(
    initialCourseEndHours
  );
  const onChangeDay = (event) => {
    const day = event.target.value;
    const isChecked = event.target.checked;
    const startHour = scheduleStartHours[day];
    const endHour = scheduleEndHours[day];
    isChecked
      ? dispatchForm({
          type: "ADD",
          payload: { day: day, startHour: startHour, endHour: endHour },
        })
      : dispatchForm({
          type: "REMOVE",
          payload: { day: day },
        });
  };

  const onChangeStartTime = (event) => {
    const newStartTime = event.target.value;
    const updatedScheduleStartHoursValue = { ...scheduleStartHours };
    updatedScheduleStartHoursValue[day] = newStartTime;
    setScheduleStartHours(updatedScheduleStartHoursValue);
    const endHour = scheduleEndHours[day];
    dispatchForm({
      type: "ADD",
      payload: { day: day, startHour: newStartTime, endHour: endHour },
    });
  };

  const onChangeEndTime = (event) => {
    const newEndTime = event.target.value;
    const updatedScheduleEndHoursValue = { ...scheduleEndHours };
    updatedScheduleEndHoursValue[day] = newEndTime;
    setScheduleEndHours(updatedScheduleEndHoursValue);
    const startHour = scheduleStartHours[day];
    dispatchForm({
      type: "ADD",
      payload: { day: day, startHour: startHour, endHour: newEndTime },
    });
  };

  return (
    <>
      <div className="courses__day-container">
        <label className="undisabled">
          <input type="checkbox" onChange={onChangeDay} value={day} />
          {day}
        </label>
      </div>
      {formState.values.scheduleDays[day] && (
        <div className="courses__hours-container">
          <label className="undisabled">Start:</label>
          <input
            type="time"
            className="courses__input-time"
            value={scheduleStartHours[day]}
            onChange={onChangeStartTime}
            min="06:00"
            max="11:59"
          />
          <label className="undisabled">End:</label>
          <input
            type="time"
            className="courses__input-time"
            value={scheduleEndHours[day]}
            onChange={onChangeEndTime}
            min="12:00"
            max="22:00"
          />
        </div>
      )}
    </>
  );
};

export default CourseDay;
