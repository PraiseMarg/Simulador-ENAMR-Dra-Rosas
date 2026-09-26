'use client';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';
import { Coffee } from 'lucide-react';
import { useEffect } from 'react';

export default function Receso() {
  const router = useRouter();
  const { currentBlock, examFinished, user } = useExamStore();

  useEffect(() => {
    if (!user) router.push('/');
    if (examFinished && user) router.push(`/consultar?email=${encodeURIComponent(user.email)}`);
    if (currentBlock === 1) router.push('/simulacro'); // Should only be here if currentBlock === 2 (Block 1 finished)
  }, [user, examFinished, currentBlock, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-10 text-center border border-slate-200">
        <Coffee className="w-20 h-20 text-blue-900 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Receso Intermedio</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Has concluido el Bloque 1 de tu simulacro. Las respuestas del primer bloque han sido bloqueadas y guardadas. Toma un descanso antes de continuar.
        </p>
        <button 
          onClick={() => router.push('/simulacro')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md"
        >
          Comenzar Bloque 2
        </button>
      </div>
    </div>
  );
}
