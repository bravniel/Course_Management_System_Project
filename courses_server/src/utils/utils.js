// Get all the dates of a day in the week between two dates
function getDates(startDate, endDate, day) {
  let date = new Date(startDate);
  let eDate = new Date(endDate);
  let dayNumber = getNumberOfDay(day);
  let dates = [];
    while (date <= eDate) {
    if (date.getDay() === dayNumber) {
      dates.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

// get the number of the day in the week, start at 0
function getNumberOfDay(day) {
  switch (day) {
    case "Sunday":
      return 0;
    case "Monday":
      return 1;
    case "Tuesday":
      return 2;
    case "Wednesday":
      return 3;
    case "Thursday":
      return 4;
  }
};

const getArrayOfDates = (startDate, endDate, days) => {
    let dates = [];
    days.forEach((day) => {
        let allDatesOfDay = getDates(startDate, endDate, day.day);
        dates = [...dates, ...allDatesOfDay];
    });
    dates.sort((a, b) => new Date(a) - new Date(b));
    return dates;
};

// console.log(getArrayOfDates("2023-01-01", "2023-03-09", ["Sunday", "Tuesday"]));

module.exports = getArrayOfDates;
