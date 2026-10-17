import fs from 'fs';
import path from 'path';
import {parse} from 'csv-parse/sync';
import { fileURLToPath } from 'url';

function transformRow(row) {
  return {
    country: row['Entity'].trim(),
    iso: row['Code'].trim(),
    year: Number(row['Year']),
    visitors: Number(row['Inbound arrivals (tourists)']),
  };
}

//this module gets data from tourism dataset
export default function getTourism() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const filePath = path.join(dirname, '../../data/tourism_dataset.csv');

  const csv = fs.readFileSync(filePath, 'utf-8');
  const records = parse(csv, {
    columns: true,
    // eslint-disable-next-line camelcase
    skip_empty_lines: true
  });
  return records.map(r => transformRow(r));
}
