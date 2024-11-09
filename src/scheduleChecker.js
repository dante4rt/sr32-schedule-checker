const axios = require('axios');
const colors = require('colors');
const moment = require('moment');
const { getRemainingTuesdays } = require('./utils');

const SPACE_ID = process.env.SPACE_ID;
const SPACE_KEY = process.env.SPACE_KEY;
const SPACE_TOKEN = process.env.SPACE_TOKEN;
const COURT_UIDS = [
  '6b891b34-7995-4232-a5c1-f12f74922f56',
  '73518e82-c4f0-4dd6-8521-f04707a47aa6',
  '1f652815-8f6e-4c6e-a60e-9f42ab4b8ad6',
  '4d7f3b23-e1ea-4848-b68f-795daa5910bd',
  'd834d4ee-5712-423b-8a00-72b86e7bb45a',
  '83468b89-0e04-4b01-9c91-52b99f8e6153',
  '2673ff9d-9d88-44d4-878c-3a6d113a771d',
  'a8c3940f-2414-439d-8d62-9d34a35d4efa',
  '1948d42a-b697-4903-9ac0-a08a4195c6df',
  '567a26c6-48db-415f-b941-597a38230257',
];

const WEBHOOK_URL = `https://chat.googleapis.com/v1/spaces/${SPACE_ID}/messages?key=${SPACE_KEY}&token=${SPACE_TOKEN}`;

async function checkScheduleAndNotify() {
  try {
    const tuesdays = getRemainingTuesdays();
    const now = moment().format('dddd, DD-MMM-YYYY, [at] HH:mm:ss');
    let fullMessage = `*[ ### SR32 Badminton Schedule Checker ### ]*\n\nLast Checked: ${now} WIB\n\n`;

    for (let i = 0; i < COURT_UIDS.length; i++) {
      const courtNumber = i + 1;
      let courtMessage = `🏸 *Court ${courtNumber}* 🏸\n`;

      for (const tuesday of tuesdays) {
        const date = tuesday.format('DD-MMM-YYYY');
        console.log(`Checking for date: ${date} on Court ${courtNumber}`);

        const response = await axios.get(
          `https://sports-sr32.com/api/lapangan/${COURT_UIDS[i]}/jadwal?date=${date}`
        );

        const { sessions } = response.data.data;
        const targetTimes = ['07:00', '08:00', '09:00', '17:00', '18:00'];

        let availableSlots = targetTimes.filter((time) => {
          const session = sessions.find((s) => s.startTime === time);
          return session && session.isAvailable;
        });

        if (availableSlots.length > 0) {
          courtMessage += `📅 ${date}: 🟢 Available at ${availableSlots.join(
            ', '
          )}\n`;
        } else {
          courtMessage += `📅 ${date}: 🔴 No available slots\n`;
        }
      }

      fullMessage += courtMessage + '\n';
    }

    await axios.post(WEBHOOK_URL, { text: fullMessage.trim() });
    console.log(
      colors.green('Notification sent for all checked dates and courts.')
    );
  } catch (error) {
    console.error(colors.red('Error checking schedule:'), error.message);
  }
}

module.exports = { checkScheduleAndNotify };
