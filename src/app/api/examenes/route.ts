import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'examenes', 'reactivos.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'reactivos.json no encontrado' }, { status: 404 });
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const reactivos = JSON.parse(data);
    return NextResponse.json({ reactivos });
  } catch (error) {
    return NextResponse.json({ error: 'Error al leer los reactivos' }, { status: 500 });
  }
}
