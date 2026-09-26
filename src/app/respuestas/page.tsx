'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle } from 'lucide-react';

interface Reactivo {
  id: string;
  caso_clinico: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  justificacion: string;
  especialidad: string;
}

export default function Respuestas() {
  const [reactivos, setReactivos] = useState<Reactivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/examenes')
      .then(res => res.json())
      .then(data => {
        if (data.reactivos) setReactivos(data.reactivos);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-slate-600">
        Cargando guía de respuestas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        <header className="bg-blue-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <BookOpen className="w-10 h-10 opacity-90 hidden md:block" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Guía de Respuestas Correctas</h1>
              <p className="text-blue-200">Revisión general de los 280 reactivos del simulador</p>
            </div>
          </div>
          <Link href="/" className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-medium transition whitespace-nowrap">
            Volver al Inicio
          </Link>
        </header>

        <div className="p-6 md:p-8 space-y-8 bg-slate-50">
          {reactivos.map((r, i) => (
            <div key={r.id} className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {r.especialidad}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  Reactivo {i + 1}
                </span>
              </div>

              {r.caso_clinico && (
                <p className="text-sm text-slate-600 mb-4 italic border-l-4 border-slate-200 pl-4">
                  "{r.caso_clinico}"
                </p>
              )}
              
              <p className="font-semibold text-lg text-slate-800 mb-5">
                {r.pregunta}
              </p>

              <div className="bg-green-50 text-green-900 p-4 rounded-lg flex items-start gap-3 border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Respuesta Correcta</p>
                  <p className="font-medium text-base">{r.opciones[r.respuesta_correcta]}</p>
                </div>
              </div>

              {r.justificacion && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100">
                  <strong className="text-slate-900">Justificación:</strong> {r.justificacion}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
