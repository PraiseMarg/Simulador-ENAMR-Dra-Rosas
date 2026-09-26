const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const dir = path.join(__dirname, 'examenes');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'latin1');
  const results = Papa.parse(content, { header: true, skipEmptyLines: true });
  console.log(f);
  if (results.data.length > 0) {
      console.log(Object.keys(results.data[0]));
  }
});
