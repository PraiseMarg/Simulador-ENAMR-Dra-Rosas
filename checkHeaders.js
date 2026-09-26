const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const dir = path.join(__dirname, 'examenes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  Papa.parse(content, {
    header: true,
    preview: 1,
    complete: (results) => {
      console.log(`\nArchivo: ${f}`);
      console.log('Headers:', results.meta.fields);
    }
  });
});
