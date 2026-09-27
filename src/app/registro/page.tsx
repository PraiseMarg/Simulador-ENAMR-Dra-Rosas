'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';

function RegistroContent() {
  const searchParams = useSearchParams();
  const initialSim = searchParams.get('sim') === 'v2' ? 'v2' : 'v1';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [simulator] = useState<'v1' | 'v2'>(initialSim);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    useExamStore.setState({
      user: { name, email },
      attemptId: `ATT-${Date.now()}`,
      simulatorId: simulator,
      currentBlock: 1,
      answers: {},
      flagged: {},
      timeLeft: 180 * 60,
      examFinished: false
    });
    router.push('/simulacro');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">Registro de Aspirante</h2>
      <p className="text-center text-slate-500 mb-6 font-medium">Estás a punto de iniciar el <span className="font-bold text-blue-700">{simulator === 'v2' ? 'Simulador V2' : 'Simulador V1'}</span></p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            required 
            placeholder="Dr. / Dra."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            required 
            placeholder="correo@ejemplo.com"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-6"
        >
          Comenzar Examen
        </button>
      </form>
    </div>
  );
}

export default function Registro() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-center">Cargando...</div>}>
        <RegistroContent />
      </Suspense>
    </div>
  );
}
