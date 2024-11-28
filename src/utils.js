const moment = require('moment');

const INDONESIAN_MONTHS = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'Mei',
  June: 'Jun',
  July: 'Jul',
  August: 'Agu',
  September: 'Sep',
  October: 'Okt',
  November: 'Nov',
  December: 'Des',
};

function getNextFourTuesdays() {
  const currentDate = moment();
  const tuesdays = [];

  while (tuesdays.length < 4) {
    if (currentDate.day() === 2) {
      tuesdays.push(currentDate.clone());
    }
    currentDate.add(1, 'day');
  }

  return tuesdays;
}

function formatIndonesianDate(date) {
  const day = date.format('DD');
  const month = INDONESIAN_MONTHS[date.format('MMMM')];
  const year = date.format('YYYY');
  return `${day}-${month}-${year}`;
}

function getTimeRange(startTime, format) {
  const start = moment(startTime, 'HH:mm');
  const end =
    format === 'two_hour'
      ? start.clone().add(2, 'hours')
      : start.clone().add(1, 'hour');
  return `${start.format('HH:mm')} - ${end.format('HH:mm')}`;
}

module.exports = { getNextFourTuesdays, formatIndonesianDate, getTimeRange };
