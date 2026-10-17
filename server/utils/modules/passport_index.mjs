import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

//helper function used to transform rows into objects 
function transformRow(r){
  //from: "country"
  //to: "anotherName":"visa-status"
  const fromList = r['Passport'].trim();
  const toList = { ...r };
  delete toList['Passport'];
  return { from: fromList, to: toList };
}

//returns data related to the passport index 
export default function getPassportIndex(){
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const filePath = path.join(dirname, '../../data/passport_index.csv');

  const csv = fs.readFileSync(filePath, 'utf-8');

  //I couldn't change it, because it's option that comes from csv parse 
  //https://csv.js.org/parse/options/skip_empty_lines/
  const records = parse(csv, {
    columns: true,
    // eslint-disable-next-line camelcase
    skip_empty_lines: true,
  });
  return records.map(r => transformRow(r)); 
}