const axios = require('axios');

async function sendTelegramAlert(alert) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  if (!token || !chatId) {
    console.log("ℹ️ Telegram credentials unconfigured. Skipping broadcast.");
    return;
  }

  const emoji = alert.severity === 'Red' ? '🔴' : '🟠';
  const text = `
${emoji} <b>SIDAS ALERT: ${alert.state.toUpperCase()}</b> ${emoji}
<b>Hazard:</b> ${alert.hazard} (${alert.severity})
<b>District:</b> ${alert.district}
<b>Headline:</b> ${alert.headline}

<b>Description:</b>
${alert.description?.en || alert.headline}

<b>Instruction:</b>
${alert.instruction?.en || "Follow official advisories."}
`;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId, text, parse_mode: 'HTML'
    });
    console.log("📱 Telegram alert broadcasted successfully.");
  } catch (err) {
    console.error("Telegram broadcast failed:", err.message);
  }
}

module.exports = { sendTelegramAlert };
