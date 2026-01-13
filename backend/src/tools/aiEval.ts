import fs from 'fs';
import path from 'path';
import aiClient from '../services/aiClient';

function scoreField(pred: any, expected: any, field: string) {
  const p = (pred[field] || '').toString().toLowerCase();
  const e = (expected[field] || '').toString().toLowerCase();
  if (!e) return 0;
  if (!p) return 0;
  // partial credit if expected is substring of predicted or vice-versa
  if (p === e) return 1;
  if (p.includes(e) || e.includes(p)) return 0.8;
  return 0;
}

async function run() {
  const file = path.join(__dirname, '..', '..', 'test-data', 'parseSamples.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const cases = JSON.parse(raw) as Array<any>;
  let total = 0;
  let score = 0;
  const details: any[] = [];

  for (const c of cases) {
    total += 3; // title, company, location
    const parsed = await aiClient.parseJob({ html: c.html }, true);
    const sTitle = scoreField(parsed, c.expected, 'title');
    const sCompany = scoreField(parsed, c.expected, 'company');
    const sLocation = scoreField(parsed, c.expected, 'location');
    score += sTitle + sCompany + sLocation;
    details.push({ id: c.id, expected: c.expected, parsed: parsed, scores: { sTitle, sCompany, sLocation } });
  }

  const accuracy = (score / total) * 100;
  console.log('AI Parse Evaluation');
  console.log('Cases:', cases.length, 'Total points:', total, 'Score:', score.toFixed(2), 'Accuracy:', accuracy.toFixed(1) + '%');
  console.log('Details:');
  console.dir(details, { depth: 2 });

  // exit code non-zero if accuracy below threshold
  const threshold = Number(process.env.AI_EVAL_THRESHOLD || 60);
  if (accuracy < threshold) {
    console.warn(`Accuracy ${accuracy.toFixed(1)}% < threshold ${threshold}%, failing`);
    process.exit(2);
  }
  process.exit(0);
}

if (require.main === module) run();
