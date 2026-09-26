const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const examenesDir = path.join(__dirname, 'examenes');
const outputJson = path.join(examenesDir, 'reactivos.json');

const especialidades = ['Medicina Interna', 'Pediatría', 'Ginecología y Obstetricia', 'Cirugía General', 'Inglés'];

const reactivos = [];

for (let i = 1; i <= 280; i++) {
  let especialidad = especialidades[0];
  if (i > 98) especialidad = especialidades[1]; // ~35%
  if (i > 168) especialidad = especialidades[2]; // ~25%
  if (i > 224) especialidad = especialidades[3]; // ~20%
  if (i > 252) especialidad = especialidades[4]; // ~10%

  reactivos.push({
    id: `REQ-${i.toString().padStart(3, '0')}`,
    caso_clinico: i % 3 === 0 ? `Caso clínico de prueba para la pregunta ${i}. Paciente masculino de 45 años...` : "",
    pregunta: `¿Cuál es el diagnóstico más probable para el caso ${i}?`,
    opciones: [
      `Opción A para la pregunta ${i}`,
      `Opción B para la pregunta ${i}`,
      `Opción C para la pregunta ${i}`,
      `Opción D para la pregunta ${i}`
    ],
    respuesta_correcta: Math.floor(Math.random() * 4),
    justificacion: `Justificación clínica para la pregunta ${i} basada en la GPC IMSS-XXX-24.`,
    especialidad: especialidad
  });
}

fs.writeFileSync(outputJson, JSON.stringify(reactivos, null, 2), 'utf-8');
console.log('Generados 280 reactivos en reactivos.json');
