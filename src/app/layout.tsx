import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ENARM 2026 - Simulador Oficial',
  description: 'Plataforma de Simulacros para el XXI Curso de Actualización Médica ENARM 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
