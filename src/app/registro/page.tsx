'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/store/useExamStore';

export default function Registro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { setUser, setAttemptId, resetExam } = useExamStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    resetExam(); // Clear previous state
    setUser({ name, email });
    setAttemptId(`ATT-${Date.now()}`);
    router.push('/simulacro');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Registro de Aspirante</h2>
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
            Comenzar Examen (Bloque 1)
          </button>
        </form>
      </div>
    </div>
  );
}
