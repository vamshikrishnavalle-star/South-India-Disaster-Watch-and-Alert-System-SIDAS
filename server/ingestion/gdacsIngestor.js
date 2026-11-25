const Parser = require('rss-parser');
const parser = new Parser();
const { normalizeAlert } = require('../services/normalizer');

async function ingestGDACSAlerts() {
  const alerts = [];
  try {
    const feed = await parser.parseURL('https://www.gdacs.org/xml/rss.xml');

    for (const item of feed.items) {
      const title = item.title || '';
      const content = item.contentSnippet || '';

      if (title.includes('India') || content.includes('India') || title.includes('Bay of Bengal')) {
        let state = 'Tamil Nadu';
        if (title.includes('Andhra') || content.includes('Andhra')) state = 'Andhra Pradesh';
        if (title.includes('Kerala') || content.includes('Kerala')) state = 'Kerala';
        if (title.includes('Telangana') || content.includes('Telangana')) state = 'Telangana';

        const isCyclone = title.toLowerCase().includes('cyclone');
        alerts.push(normalizeAlert({
          source: 'GDACS Feed', external_id: item.guid || item.link,
          state, district: 'Coastal / Regional Watch',
          hazard: isCyclone ? 'Cyclone' : 'Flood', severity: 'Orange',
          headline: item.title, templateKey: isCyclone ? 'CYCLONE_WARNING_ORANGE' : 'HEAVY_RAIN_ORANGE',
          rawDescription: item.contentSnippet
        }));
      }
    }
  } catch (err) {
    console.error("GDACS ingestion error:", err.message);
  }
  return alerts;
}

module.exports = { ingestGDACSAlerts };
