import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


//this module simply parses geojson
export default function getGeoJSON() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, '../../data/cleaned.geojson'); 
  const raw = fs.readFileSync(filePath, 'utf-8');
  const geojson = JSON.parse(raw);

  return geojson.features.map(f => ({
    type: f.type,
    properties: f.properties,
    geometry: f.geometry
  }));
}
