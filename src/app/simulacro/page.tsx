'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';
import { Flag, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Reactivo {
  id: string;
  caso_clinico: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  justificacion: string;
  especialidad: string;
}

export default function Simulacro() {
  const router = useRouter();
  const { 
    user, currentBlock, answers, flagged, timeLeft, examFinished,
    setAnswer, toggleFlag, decrementTime, finishBlock, finishExam
  } = useExamStore();

  const [reactivos, setReactivos] = useState<Reactivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (examFinished) {
      router.push(`/consultar?email=${encodeURIComponent(user.email)}`);
      return;
    }

    // Fetch reactivos with simId
    fetch(`/api/examenes?simId=${simulatorId || 'v1'}`)
      .then(res => res.json())
      .then(data => {
        if (data.reactivos) {
          // slice according to block
          const blockReactivos = currentBlock === 1 ? data.reactivos.slice(0, 140) : data.reactivos.slice(140, 280);
          setReactivos(blockReactivos);
        }
        setLoading(false);
      });
  }, [user, currentBlock, examFinished, simulatorId, router]);

  useEffect(() => {
    if (loading || examFinished) return;
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleFinishBlock();
      } else {
        decrementTime();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, examFinished, timeLeft, decrementTime]);

  const handleFinishBlock = () => {
    if (currentBlock === 1) {
      finishBlock();
      router.push('/receso');
    } else {
      finishExam();
      router.push('/resultados/generar'); // Intermediate screen to save and show results
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando reactivos...</div>;
  if (!reactivos.length) return <div className="flex h-screen items-center justify-center">Error al cargar el examen.</div>;

  const currentReactivo = reactivos[currentIndex];
  const isFlagged = flagged[currentReactivo.id];

  return (
    <div className="flex h-screen bg-slate-50 flex-col font-sans">
      {/* HEADER */}
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="font-bold text-lg">{user?.name}</h1>
          <p className="text-blue-200 text-sm">Bloque {currentBlock} de 2</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-blue-200">Tiempo restante</p>
            <p className="font-mono text-2xl font-bold">{formatTime(timeLeft)}</p>
          </div>
          <button 
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Navegador ({Object.keys(answers).filter(id => reactivos.some(r => r.id === id)).length}/{reactivos.length})
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* MAIN PANEL */}
        <main className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className="max-w-3xl w-full">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                Reactivo {currentIndex + 1} / {reactivos.length}
              </span>
              <button 
                onClick={() => toggleFlag(currentReactivo.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${isFlagged ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}
              >
                <Flag className="w-4 h-4" /> {isFlagged ? 'Marcada para revisión' : 'Marcar'}
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
              {currentReactivo.caso_clinico && (
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Caso Clínico</h3>
                  <p className="text-slate-700 leading-relaxed text-justify">{currentReactivo.caso_clinico}</p>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Pregunta</h3>
                <p className="text-lg font-medium text-slate-900">{currentReactivo.pregunta}</p>
              </div>

              <div className="space-y-3">
                {currentReactivo.opciones.map((opcion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswer(currentReactivo.id, idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3 ${answers[currentReactivo.id] === idx ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${answers[currentReactivo.id] === idx ? 'border-blue-500 bg-blue-500' : 'border-slate-400'}`}>
                      {answers[currentReactivo.id] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className={`text-slate-800 ${answers[currentReactivo.id] === idx ? 'font-medium' : ''}`}>{opcion}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pb-10">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" /> Anterior
              </button>
              
              {currentIndex === reactivos.length - 1 ? (
                <button 
                  onClick={handleFinishBlock}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-5 h-5" /> Finalizar Bloque
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIndex(prev => Math.min(reactivos.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* DRAWER */}
        {drawerOpen && (
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] z-10">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-700">Navegador</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-5 gap-2">
                {reactivos.map((r, i) => {
                  const isAns = answers[r.id] !== undefined;
                  const isFlg = flagged[r.id];
                  const isCurr = currentIndex === i;
                  
                  let bgClass = "bg-slate-100 text-slate-500 hover:bg-slate-200";
                  if (isAns) bgClass = "bg-blue-500 text-white hover:bg-blue-600";
                  if (isFlg) bgClass = "bg-yellow-400 text-yellow-900 hover:bg-yellow-500";
                  
                  return (
                    <button
                      key={r.id}
                      onClick={() => { setCurrentIndex(i); setDrawerOpen(false); }}
                      className={`w-full aspect-square rounded flex items-center justify-center text-sm font-medium transition ${bgClass} ${isCurr ? 'ring-2 ring-offset-2 ring-blue-900' : ''}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
