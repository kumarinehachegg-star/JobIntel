import cron from 'node-cron';
import dotenv from 'dotenv';
import { scrapeOnce } from '../services/playwrightScraper';
import { Source } from '../models/Source';
import { Snapshot } from '../models/Snapshot';
import { hashContent } from '../services/deltaDetector';
import { connectDB } from '../config/db';

dotenv.config();

async function runAll() {
  const sources = await Source.find({ enabled: true }).lean();
  for (const s of sources) {
    try {
      // eslint-disable-next-line no-console
      console.log('Scraping', s.url);
      const r = await scrapeOnce({ id: s._id?.toString(), url: s.url, selector: s.selector });

      // r may include feed items if scraper fetched links
      // For each fed item, check snapshot hash and only ingest if changed
      if (r && Array.isArray((r as any).items)) {
        for (const item of (r as any).items) {
          const html = item.rawHtml || '';
          const url = item.url || item.link || '';
          const h = hashContent(html);
          const existing = await Snapshot.findOne({ url }).lean();
          if (existing && existing.hash === h) {
            // unchanged
            // eslint-disable-next-line no-console
            console.log('Unchanged, skipping', url);
            await Snapshot.findOneAndUpdate({ url }, { lastSeen: new Date() });
            continue;
          }

          // post ingestion to backend ingest endpoint
          try {
            await fetch(`${process.env.BACKEND_URL || 'http://localhost:4000'}/api/jobs/ingest`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, rawHtml: html, sourceId: s._id }),
            });
            await Snapshot.findOneAndUpdate({ url }, { hash: h, lastSeen: new Date(), sourceId: s._id }, { upsert: true });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Ingest post failed for', url, e?.message || e);
          }
        }
      } else {
        // fallback: update source lastRun/result
        await Source.findByIdAndUpdate(s._id, { lastRun: new Date(), lastResult: JSON.stringify(r).slice(0, 200) });
      }

      // eslint-disable-next-line no-console
      console.log('Scrape result', r);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Scrape failed for', s.url, e?.message || e);
      await Source.findByIdAndUpdate(s._id, { lastRun: new Date(), lastResult: String(e?.message || e) });
    }
  }
}

if (require.main === module) {
  (async () => {
    const MONGODB_URI = process.env.MONGODB_URI || '';
    try {
      await connectDB(MONGODB_URI);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Scheduler: DB connect failed, continuing (no sources will be found):', err?.message || err);
    }

    // run immediately and schedule (or exit after one run if RUN_ONCE=1)
    await runAll();
    if (process.env.RUN_ONCE === '1') {
      // eslint-disable-next-line no-console
      console.log('RUN_ONCE=1, exiting after single run');
      process.exit(0);
    }
    const schedule = process.env.SCRAPE_CRON || '*/15 * * * *';
    cron.schedule(schedule, () => {
      runAll();
    });
  })();
}
