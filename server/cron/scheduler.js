const cron = require('node-cron');
const { ingestWeatherData } = require('../ingestion/weatherIngestor');
const { ingestGDACSAlerts } = require('../ingestion/gdacsIngestor');
const { sendTelegramAlert } = require('../services/telegramBot');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function runMasterIngestion() {
  console.log(`\n⏰ [${new Date().toISOString()}] Master Ingestion Cycle executing...`);
  let totalIngested = 0;
  let status = 'SUCCESS';
  let errorMsg = null;

  try {
    const { weatherRecords, generatedAlerts: weatherAlerts } = await ingestWeatherData();
    if (weatherRecords.length > 0) {
      await supabase.from('weather_cache').upsert(weatherRecords, { onConflict: 'city' });
    }

    const gdacsAlerts = await ingestGDACSAlerts();
    const allAlerts = [...weatherAlerts, ...gdacsAlerts];

    if (allAlerts.length > 0) {
      await supabase.from('alerts').upsert(allAlerts, { onConflict: 'external_id', ignoreDuplicates: true });
      totalIngested = allAlerts.length;

      // Broadcast Red Alerts to Telegram
      for (const alert of allAlerts.filter(a => a.severity === 'Red')) {
        await sendTelegramAlert(alert);
      }
    }

    console.log(`✅ Ingestion finished. Saved ${totalIngested} items.`);
  } catch (err) {
    status = 'FAILED';
    errorMsg = err.message;
    console.error("❌ Master Ingestion Failed:", err.message);
  } finally {
    await supabase.from('ingestion_log').insert([{
      source_name: 'MASTER_CRON', status, items_ingested: totalIngested, error_message: errorMsg
    }]);
  }
}

function startIngestionScheduler() {
  runMasterIngestion();
  cron.schedule('*/20 * * * *', runMasterIngestion);
}

module.exports = { startIngestionScheduler, runMasterIngestion };
