import Link from 'next/link';
import { Stethoscope, ClipboardList } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-blue-900 text-white p-8 text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">XXI Curso de Actualización Médica ENARM 2026</h1>
          <p className="text-blue-200 text-lg">Plataforma de Simulacros</p>
        </div>
        
        <div className="p-8 flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/registro" className="flex-1 group">
            <div className="h-full flex flex-col items-center p-6 border-2 border-blue-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
              <ClipboardList className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Iniciar Simulacro</h2>
              <p className="text-sm text-slate-500 text-center">Realizar el examen de 280 reactivos en condiciones reales (6 horas).</p>
            </div>
          </Link>
          
          <Link href="/consultar" className="flex-1 group">
            <div className="h-full flex flex-col items-center p-6 border-2 border-slate-100 rounded-xl hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
              <svg className="w-12 h-12 text-slate-600 mb-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Consultar Mis Resultados</h2>
              <p className="text-sm text-slate-500 text-center">Revisa tus aciertos, justificaciones y descarga tu reporte.</p>
            </div>
          </Link>
        </div>
        
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Acceso Administrador (Resultados Globales)
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-sm text-slate-400">
        &copy; 2026 XXI Curso de Actualización Médica ENARM
      </footer>
    </div>
  );
}
