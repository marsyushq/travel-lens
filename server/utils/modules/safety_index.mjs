import fs from 'fs';
import path from 'path';
import {parse} from 'csv-parse/sync';
import { fileURLToPath } from 'url';

//referred to https://csv.js.org/parse/api/sync/
export default function getSafetyIndex() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const filePath = path.join(dirname, '../../data/safety_index.csv');

  const csv = fs.readFileSync(filePath, 'utf-8');
  //by default, returns strings
  const records = parse(csv, {
    columns: true,
    // eslint-disable-next-line camelcase
    skip_empty_lines: true
  });

  // Could be displayed correctly using bool operation later
  return records.map(r => ({
    rank: Number(r['rank']),
    country: r['country'].trim(),
    // eslint-disable-next-line camelcase
    safety_index: Number(r['safety_index'])
  }));
}