import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Simple scraper that fetches a page, extracts job links and raw HTML
export async function scrapeOnce(source: { id?: string; url: string; selector?: string }) {
  // If SCRAPER_MODE=http use simple fetch-only scraping (no Playwright)
  const mode = process.env.SCRAPER_MODE || 'playwright';
  const selector = source.selector || 'a';

  // helper to POST ingestion
  const postIngest = async (url: string, rawHtml: string) => {
    try {
      await fetch(`${process.env.BACKEND_URL || 'http://localhost:4000'}/api/jobs/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, rawHtml }),
      });
    } catch (e) {
      // ignore
    }
  };

  if (mode === 'http') {
    // Fetch page HTML and extract links via regex (best-effort)
    const res = await fetch(source.url, { timeout: 20000 } as any);
    const html = await res.text();
    const linkMatches = Array.from(html.matchAll(/href=["']?([^"' >]+)/g)).map((m) => m[1]);
    const links = linkMatches.filter(Boolean).slice(0, 20);

    const feed = [];
    for (let i = 0; i < Math.min(5, links.length); i++) {
      const link = links[i];
      try {
        const r = await fetch(link, { timeout: 10000 } as any);
        const rawHtml = await r.text();
        feed.push({ url: link, rawHtml });
      } catch (e) {
        // ignore
      }
    }

    for (const item of feed) await postIngest(item.url, item.rawHtml);
    return { linksCount: links.length, fed: feed.length, mode: 'http' };
  }

  // Default: try to load Playwright dynamically (may error if not installed)
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(source.url, { waitUntil: 'load', timeout: 30000 });
    const links: string[] = await page.$$eval(selector, (els: any[]) =>
      els.map((el) => (el.href ? el.href : null)).filter(Boolean)
    );

    const feed: { url: string; rawHtml: string }[] = [];
    for (let i = 0; i < Math.min(5, links.length); i++) {
      const link = links[i];
      try {
        const res = await fetch(link, { timeout: 10000 } as any);
        const rawHtml = await res.text();
        feed.push({ url: link, rawHtml });
      } catch (e) {
        // ignore fetch errors
      }
    }

    for (const item of feed) await postIngest(item.url, item.rawHtml);
    return { linksCount: links.length, fed: feed.length, mode: 'playwright' };
  } finally {
    await page.close();
    await browser.close();
  }
}

if (require.main === module) {
  // simple CLI runner
  const url = process.argv[2] || process.env.SCRAPE_URL;
  if (!url) {
    console.error('Provide URL as arg or SCRAPE_URL env');
    process.exit(1);
  }
  scrapeOnce({ url }).then((r) => {
    console.log('scrape result', r);
    process.exit(0);
  }).catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
