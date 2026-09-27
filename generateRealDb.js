const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const dir = path.join(__dirname, 'examenes');
const v1Json = path.join(dir, 'simulador1.json');
const v2Json = path.join(dir, 'simulador2.json');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
let allQuestions = [];
let idCounter = 1;

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const results = Papa.parse(content, { header: true, skipEmptyLines: true });
  
  let especialidad = 'Medicina Interna';
  const fname = f.toLowerCase();
  if (fname.includes('pedi') || fname.includes('pediatri')) especialidad = 'Pediatría';
  else if (fname.includes('gineco') || fname.includes('obstetri')) especialidad = 'Ginecología y Obstetricia';
  else if (fname.includes('cirugia') || fname.includes('cirugía')) especialidad = 'Cirugía General';

  results.data.forEach(row => {
    const keys = Object.keys(row);
    const getVal = (searchStrings) => {
       const key = keys.find(k => {
           const normalizedKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
           return searchStrings.some(s => s.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey);
       });
       return key ? row[key] : undefined;
    };

    const caso = getVal(['Contexto / Caso Clínico', 'Pregunta / Caso Clínico']) || '';
    const pregunta = getVal(['Pregunta', 'Pregunta / Caso Clínico']) || '';
    
    if (!pregunta) return;

    const opA = getVal(['Opción A']);
    const opB = getVal(['Opción B']);
    const opC = getVal(['Opción C']);
    const opD = getVal(['Opción D']);
    
    if (!opA || !opB || !opC || !opD) return;
    
    const opciones = [opA.trim(), opB.trim(), opC.trim(), opD.trim()];
    const resp = getVal(['Respuesta Correcta', 'Respuesta']);
    if (!resp) return;

    let correctaIdx = opciones.findIndex(o => o.toLowerCase() === resp.trim().toLowerCase());
    if (correctaIdx === -1) {
       correctaIdx = opciones.findIndex(o => o.toLowerCase().includes(resp.trim().toLowerCase()) || resp.trim().toLowerCase().includes(o.toLowerCase()));
    }
    if (correctaIdx === -1) correctaIdx = 0;
    if (pregunta.length < 5) return;

    allQuestions.push({
      id: `REQ-${idCounter.toString().padStart(4, '0')}`,
      caso_clinico: caso.trim(),
      pregunta: pregunta.trim(),
      opciones: opciones,
      respuesta_correcta: correctaIdx,
      justificacion: "Justificación clínica revisando la bibliografía GPC.",
      especialidad: especialidad
    });
    idCounter++;
  });
});

const sim1 = allQuestions.slice(0, 280);
const sim2 = allQuestions.slice(280, 560);

fs.writeFileSync(v1Json, JSON.stringify(sim1, null, 2), 'utf-8');
fs.writeFileSync(v2Json, JSON.stringify(sim2, null, 2), 'utf-8');

console.log(`Generados simulador1.json (${sim1.length} preguntas) y simulador2.json (${sim2.length} preguntas).`);
