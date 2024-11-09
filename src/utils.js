const moment = require('moment');

function getRemainingTuesdays() {
  let currentDate = moment();
  let tuesdays = [];

  if (currentDate.date() === 1) {
    currentDate = currentDate.startOf('month');
    while (currentDate.month() === moment().month()) {
      if (currentDate.day() === 2) {
        tuesdays.push(currentDate.clone());
      }
      currentDate.add(1, 'day');
    }
  } else {
    while (currentDate.month() === moment().month()) {
      if (currentDate.day() === 2) {
        tuesdays.push(currentDate.clone());
      }
      currentDate.add(1, 'day');
    }
  }

  return tuesdays;
}

function getTimeRange(startTime, format) {
  const start = moment(startTime, 'HH:mm');
  const end =
    format === 'two_hour'
      ? start.clone().add(2, 'hours')
      : start.clone().add(1, 'hour');
  return `${start.format('HH:mm')} - ${end.format('HH:mm')}`;
}

module.exports = { getRemainingTuesdays, getTimeRange };
