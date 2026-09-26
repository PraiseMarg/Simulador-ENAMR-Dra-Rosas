'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, FileText, Download, CheckCircle, XCircle } from 'lucide-react';

function ConsultaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  useEffect(() => {
    if (initialEmail) {
      handleSearch(initialEmail);
    }
  }, [initialEmail]);

  const handleSearch = async (searchEmail: string) => {
    if (!searchEmail) return;
    setLoading(true);
    setError('');
    setSelectedReport(null);
    try {
      const res = await fetch(`/api/resultados?email=${encodeURIComponent(searchEmail)}`);
      const data = await res.json();
      if (data.resultados && data.resultados.length > 0) {
        setResultados(data.resultados);
        if (data.resultados.length === 1) {
          setSelectedReport(data.resultados[0]);
        }
      } else {
        setResultados([]);
        setError('No se encontraron exámenes asociados a este correo.');
      }
    } catch (err) {
      setError('Error de conexión.');
    }
    setLoading(false);
  };

  const printReport = () => {
    window.print();
  };

  if (selectedReport) {
    const filteredDetalle = selectedReport.detalle.filter((item: any) => {
      if (filter === 'correct') return item.es_correcta;
      if (filter === 'incorrect') return !item.es_correcta;
      return true;
    });

    return (
      <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-6 print:shadow-none print:my-0">
          
          <div className="bg-blue-900 text-white p-8 flex justify-between items-center print:bg-white print:text-black print:border-b-2">
            <div>
              <h1 className="text-2xl font-bold mb-1">Reporte de Resultados ENARM</h1>
              <p className="text-blue-200 print:text-gray-600">{selectedReport.nombre} ({selectedReport.email})</p>
              <p className="text-sm text-blue-300 mt-2 print:text-gray-500">Fecha: {new Date(selectedReport.fecha).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">{selectedReport.puntaje} / 280</p>
              <p className="text-lg text-blue-200 print:text-gray-600">{selectedReport.porcentaje}% Global</p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h2 className="text-xl font-bold text-slate-700">Rendimiento por Especialidad</h2>
              <button onClick={printReport} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                <Download className="w-4 h-4" /> Imprimir / PDF
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {Object.entries(selectedReport.especialidades).map(([esp, data]: [string, any]) => {
                const pct = data.total > 0 ? Math.round((data.aciertos / data.total) * 100) : 0;
                return (
                  <div key={esp} className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase h-8">{esp}</p>
                    <p className="text-2xl font-bold text-blue-900 my-2">{pct}%</p>
                    <p className="text-xs text-slate-500">{data.aciertos} / {data.total}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-6 border-b border-slate-200 pb-4 print:hidden">
              <h2 className="text-xl font-bold text-slate-700 mb-4">Revisión Reactivo por Reactivo</h2>
              <div className="flex gap-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Todos</button>
                <button onClick={() => setFilter('correct')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'correct' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Aciertos</button>
                <button onClick={() => setFilter('incorrect')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'incorrect' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Errores</button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredDetalle.map((item: any, idx: number) => (
                <div key={item.id} className={`p-6 rounded-lg border-l-4 ${item.es_correcta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">{item.especialidad}</span>
                    {item.es_correcta ? <CheckCircle className="text-green-600 w-5 h-5" /> : <XCircle className="text-red-600 w-5 h-5" />}
                  </div>
                  
                  {item.caso_clinico && <p className="text-sm text-slate-600 mb-2 italic">"{item.caso_clinico}"</p>}
                  
                  <p className="font-medium text-slate-900 mb-4">{item.pregunta}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <p className="text-xs text-slate-400 font-bold mb-1">Tu Respuesta</p>
                      <p className={item.es_correcta ? 'text-green-700' : 'text-red-700'}>{item.respuesta_alumno}</p>
                    </div>
                    {!item.es_correcta && (
                      <div className="p-3 bg-white rounded border border-slate-200">
                        <p className="text-xs text-slate-400 font-bold mb-1">Respuesta Correcta</p>
                        <p className="text-green-700">{item.respuesta_correcta}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-700 bg-white/60 p-3 rounded">
                    <span className="font-bold">Justificación:</span> {item.justificacion}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Search className="text-blue-600" /> Consultar Resultados
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico registrado</label>
          <div className="flex gap-2">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              placeholder="tu@correo.com"
            />
            <button 
              onClick={() => handleSearch(email)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition"
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {resultados.length > 1 && (
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Exámenes encontrados:</h3>
            <div className="space-y-3">
              {resultados.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedReport(r)}
                  className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-800">{new Date(r.fecha).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-500">{r.puntaje} aciertos ({r.porcentaje}%)</p>
                  </div>
                  <FileText className="text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Consultar() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
      <ConsultaContent />
    </Suspense>
  );
}
