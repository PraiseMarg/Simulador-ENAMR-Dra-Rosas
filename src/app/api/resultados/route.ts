import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const resultadosDir = path.join(process.cwd(), 'resultados');

if (!fs.existsSync(resultadosDir)) {
  fs.mkdirSync(resultadosDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, nombre, puntaje, porcentaje, especialidades, detalle } = data;

    const normalizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    const fileName = `${normalizedEmail}_${timestamp}.json`;
    const filePath = path.join(resultadosDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Email send using Nodemailer
    // Mock configuration since we don't have real credentials
    // We log it in dev
    console.log(`Simulando envío de correo a dmarg58@gmail.com con resultado de ${nombre} - Puntaje: ${puntaje}/280`);
    
    // Si tuvieramos credenciales reales:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'TU_CORREO', pass: 'TU_PASSWORD' }
    });
    await transporter.sendMail({
      from: 'simulador@enarm.com',
      to: 'dmarg58@gmail.com',
      subject: `[XXI Curso ENARM 2026] Resultado de Simulacro - ${nombre} - ${puntaje}/280`,
      text: `Nombre: ${nombre}\nCorreo: ${email}\nPuntaje: ${puntaje}/280 (${porcentaje}%)\n...`
    });
    */

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al guardar resultado' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    if (email === 'all') {
      const files = fs.readdirSync(resultadosDir);
      const userFiles = files.filter(f => f.endsWith('.json'));
      const resultados = userFiles.map(f => {
        const filePath = path.join(resultadosDir, f);
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      });
      return NextResponse.json({ resultados });
    }

    const normalizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
    const files = fs.readdirSync(resultadosDir);
    const userFiles = files.filter(f => f.startsWith(normalizedEmail + '_'));

    const resultados = userFiles.map(f => {
      const filePath = path.join(resultadosDir, f);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });

    return NextResponse.json({ resultados });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 });
  }
}
