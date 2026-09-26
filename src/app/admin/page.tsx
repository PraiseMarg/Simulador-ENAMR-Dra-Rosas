'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, FileText, BarChart3, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resultados?email=all')
      .then(res => res.json())
      .then(data => {
        if (data.resultados) {
          // Ordenar del más reciente al más antiguo
          const sorted = data.resultados.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          setResultados(sorted);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center font-sans">Cargando panel de administrador...</div>;

  const promedioPuntaje = resultados.length > 0 
    ? Math.round(resultados.reduce((acc, r) => acc + r.puntaje, 0) / resultados.length)
    : 0;
  
  const promedioPorcentaje = resultados.length > 0
    ? Math.round(resultados.reduce((acc, r) => acc + r.porcentaje, 0) / resultados.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
              <Users className="w-8 h-8" /> Panel de Administrador
            </h1>
            <p className="text-slate-500 mt-1">Monitoreo global de resultados del ENARM 2026</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition">
            Volver al Inicio
          </Link>
        </header>

        {/* Métricas Globales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-lg"><FileText className="w-8 h-8"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Exámenes Realizados</p>
              <p className="text-3xl font-black text-slate-800">{resultados.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-lg"><TrendingUp className="w-8 h-8"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Promedio de Aciertos</p>
              <p className="text-3xl font-black text-slate-800">{promedioPuntaje} <span className="text-lg text-slate-400 font-normal">/ 280</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-600 rounded-lg"><BarChart3 className="w-8 h-8"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Porcentaje Promedio</p>
              <p className="text-3xl font-black text-slate-800">{promedioPorcentaje}%</p>
            </div>
          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-sm uppercase">
                <th className="p-4 font-bold border-b border-slate-200">Fecha</th>
                <th className="p-4 font-bold border-b border-slate-200">Alumno</th>
                <th className="p-4 font-bold border-b border-slate-200">Correo</th>
                <th className="p-4 font-bold border-b border-slate-200">Aciertos</th>
                <th className="p-4 font-bold border-b border-slate-200">Porcentaje</th>
                <th className="p-4 font-bold border-b border-slate-200 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultados.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-sm text-slate-600">{new Date(r.fecha).toLocaleString()}</td>
                  <td className="p-4 font-medium text-slate-800">{r.nombre}</td>
                  <td className="p-4 text-sm text-slate-500">{r.email}</td>
                  <td className="p-4 font-bold text-blue-700">{r.puntaje}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.porcentaje >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.porcentaje}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link 
                      href={`/consultar?email=${encodeURIComponent(r.email)}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <FileText className="w-4 h-4"/> Ver Reporte
                    </Link>
                  </td>
                </tr>
              ))}
              {resultados.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No hay exámenes registrados todavía.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
