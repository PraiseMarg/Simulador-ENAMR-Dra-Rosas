'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';
import { Loader2 } from 'lucide-react';

export default function GenerarResultado() {
  const router = useRouter();
  const { user, answers, examFinished, simulatorId } = useExamStore();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !examFinished) {
      router.push('/');
      return;
    }

    const processResults = async () => {
      try {
        // Fetch original questions to compare
        const res = await fetch(`/api/examenes?simId=${simulatorId || 'v1'}`);
        const data = await res.json();
        const reactivos = data.reactivos;

        let aciertos = 0;
        const especialidades: Record<string, { total: number; aciertos: number }> = {
          'Medicina Interna': { total: 0, aciertos: 0 },
          'Pediatría': { total: 0, aciertos: 0 },
          'Ginecología y Obstetricia': { total: 0, aciertos: 0 },
          'Cirugía General': { total: 0, aciertos: 0 },
          'Inglés': { total: 0, aciertos: 0 }
        };

        const detalle = reactivos.map((r: any) => {
          const userAnswer = answers[r.id];
          const isCorrect = userAnswer === r.respuesta_correcta;
          
          if (especialidades[r.especialidad]) {
            especialidades[r.especialidad].total += 1;
            if (isCorrect) especialidades[r.especialidad].aciertos += 1;
          }
          
          if (isCorrect) aciertos++;

          return {
            id: r.id,
            pregunta: r.pregunta,
            caso_clinico: r.caso_clinico,
            especialidad: r.especialidad,
            respuesta_alumno: userAnswer !== undefined ? r.opciones[userAnswer] : 'No respondida',
            respuesta_correcta: r.opciones[r.respuesta_correcta],
            es_correcta: isCorrect,
            justificacion: r.justificacion
          };
        });

        const porcentaje = Math.round((aciertos / 280) * 100);

        const payload = {
          nombre: user.name,
          email: user.email,
          simulatorId: simulatorId || 'v1',
          fecha: new Date().toISOString(),
          puntaje: aciertos,
          porcentaje,
          especialidades,
          detalle
        };

        const postRes = await fetch('/api/resultados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (postRes.ok) {
          router.push(`/consultar?email=${encodeURIComponent(user.email)}`);
        } else {
          setError('Error al guardar el resultado.');
        }

      } catch (err) {
        setError('Ocurrió un error al procesar el examen.');
      }
    };

    processResults();
  }, [user, answers, examFinished, router]);

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-700">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <h2 className="text-xl font-bold">Procesando y Guardando Resultados...</h2>
      <p className="text-sm mt-2">Por favor, no cierres esta ventana.</p>
    </div>
  );
}
