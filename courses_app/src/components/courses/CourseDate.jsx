import React from "react";
import { inputProperties } from "../../utils/utils";

const CourseDate = ({ data }) => {
  const { label, value, key, setFunc } = data;

  return (
    <label className="undisabled">
      {label}:
      <input
        type="date"
        className="courses__input-new"
        value={value}
        min={inputProperties[key].minValue}
        max={inputProperties[key].maxValue}
        onChange={(event) => setFunc(event.target.valueAsDate)}
      />
    </label>
  );
};

export default CourseDate;
