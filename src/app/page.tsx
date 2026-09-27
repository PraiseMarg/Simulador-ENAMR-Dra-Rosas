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
        
        <div className="p-8 flex flex-col gap-6 justify-center">
          
          <div className="flex flex-col md:flex-row gap-6">
            <Link href="/registro?sim=v1" className="flex-1 group">
              <div className="h-full flex flex-col items-center p-6 border-2 border-blue-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer shadow-sm">
                <ClipboardList className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-bold text-blue-900 mb-2 text-center">Realizar Simulador V1</h2>
                <p className="text-sm text-slate-500 text-center">Examen original de 280 reactivos.</p>
              </div>
            </Link>

            <Link href="/registro?sim=v2" className="flex-1 group">
              <div className="h-full flex flex-col items-center p-6 border-2 border-indigo-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm">
                <ClipboardList className="w-12 h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-bold text-indigo-900 mb-2 text-center">Realizar Simulador V2</h2>
                <p className="text-sm text-slate-500 text-center">Nueva versión con 280 reactivos diferentes.</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-2">
            <Link href="/consultar" className="flex-1 group">
              <div className="h-full flex flex-col items-center p-5 border-2 border-slate-100 rounded-xl hover:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
                <svg className="w-8 h-8 text-slate-600 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-lg font-semibold text-slate-700 mb-1 text-center">Mis Resultados</h2>
                <p className="text-xs text-slate-500 text-center">Revisa tus aciertos y descarga tu PDF.</p>
              </div>
            </Link>

            <Link href="/respuestas" className="flex-1 group">
              <div className="h-full flex flex-col items-center p-5 border-2 border-green-100 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all cursor-pointer">
                <svg className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-lg font-semibold text-green-900 mb-1 text-center">Guía de Respuestas</h2>
                <p className="text-xs text-slate-500 text-center">Estudia la clave correcta de todas las preguntas.</p>
              </div>
            </Link>
          </div>

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
