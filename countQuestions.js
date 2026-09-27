const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const dir = path.join(__dirname, 'examenes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
let allQuestions = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const results = Papa.parse(content, { header: true, skipEmptyLines: true });
  
  results.data.forEach(row => {
    const keys = Object.keys(row);
    const getVal = (searchStrings) => {
       const key = keys.find(k => {
           const normalizedKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
           return searchStrings.some(s => s.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey);
       });
       return key ? row[key] : undefined;
    };
    const pregunta = getVal(['Pregunta', 'Pregunta / Caso Clínico']) || '';
    if (!pregunta) return;
    const opA = getVal(['Opción A']); const opB = getVal(['Opción B']); const opC = getVal(['Opción C']); const opD = getVal(['Opción D']);
    if (!opA || !opB || !opC || !opD) return;
    const resp = getVal(['Respuesta Correcta', 'Respuesta']);
    if (!resp) return;
    if (pregunta.length < 5) return;
    allQuestions.push(pregunta);
  });
});

console.log(`Total de preguntas válidas en los CSV: ${allQuestions.length}`);
