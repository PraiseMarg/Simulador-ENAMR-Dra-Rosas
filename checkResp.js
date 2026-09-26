const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const dir = path.join(__dirname, 'examenes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const sample = results.data.slice(0, 3).map(r => r['Respuesta Correcta']);
      console.log(`\nArchivo: ${f}`);
      console.log('Sample Respuesta Correcta:', sample);
    }
  });
});
