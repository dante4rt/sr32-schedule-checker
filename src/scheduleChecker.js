const axios = require('axios');
const colors = require('colors');
const { getRemainingTuesdays, getTimeRange } = require('./utils');

const SPACE_ID = process.env.SPACE_ID;
const SPACE_KEY = process.env.SPACE_KEY;
const SPACE_TOKEN = process.env.SPACE_TOKEN;
const SR32_UID = process.env.SR32_UID;

const WEBHOOK_URL = `https://chat.googleapis.com/v1/spaces/${SPACE_ID}/messages?key=${SPACE_KEY}&token=${SPACE_TOKEN}`;

async function checkScheduleAndNotify() {
  try {
    const tuesdays = getRemainingTuesdays();
    let fullMessage = '';

    for (const tuesday of tuesdays) {
      const date = tuesday.format('DD-MMM-YYYY');
      console.log(`Checking for date: ${date}`);

      const response = await axios.get(
        `https://sports-sr32.com/api/lapangan/${SR32_UID}/jadwal?date=${date}`
      );

      const { sessions } = response.data.data;
      const targetTimes = ['07:00', '08:00', '09:00', '17:00', '18:00'];

      let message = `Badminton court availability for Tuesday, ${date}:\n`;

      for (const targetTime of targetTimes) {
        const session = sessions.find((s) => s.startTime === targetTime);
        if (session) {
          const timeRange = getTimeRange(session.startTime, session.format);
          if (session.isAvailable) {
            message += `✅ ${timeRange} - Available\n`;
          } else {
            message += `❌ ${timeRange} - Not available\n`;
          }
        } else {
          message += `❓ ${targetTime} - Status unknown\n`;
        }
      }

      fullMessage += message + '\n';
    }

    await axios.post(WEBHOOK_URL, { text: fullMessage.trim() });
    console.log(colors.green(`Notification sent for all checked dates`));
  } catch (error) {
    console.error(colors.red('Error checking schedule:'), error.message);
  }
}

module.exports = { checkScheduleAndNotify };
