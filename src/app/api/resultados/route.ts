import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis if env vars are present
const redis = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) 
  ? new Redis({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, nombre, puntaje, porcentaje, especialidades, detalle } = data;

    const normalizedEmail = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    const id = `${normalizedEmail}_${timestamp}`;

    if (redis) {
      await redis.set(`resultado:${id}`, data);
      await redis.sadd('resultados_globales', id);
      await redis.sadd(`user:${normalizedEmail}`, id);
    } else {
      console.warn("ADVERTENCIA: Redis no está configurado. Los datos se perderán al reiniciar el servidor.");
    }

    console.log(`Simulando envío de correo a dmarg58@gmail.com con resultado de ${nombre} - Puntaje: ${puntaje}/280`);

    return NextResponse.json({ success: true, fileName: id });
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

    if (!redis) {
      return NextResponse.json({ 
        resultados: [],
        error: 'Base de datos no conectada. Por favor, conecta Upstash Redis en tu panel de Vercel.' 
      });
    }

    if (email === 'all') {
      const ids = await redis.smembers('resultados_globales');
      const resultados = [];
      for (const id of (ids || [])) {
        const res = await redis.get(`resultado:${id}`);
        if (res) resultados.push(res);
      }
      return NextResponse.json({ resultados });
    }

    const normalizedEmail = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const ids = await redis.smembers(`user:${normalizedEmail}`);
    const resultados = [];
    for (const id of (ids || [])) {
      const res = await redis.get(`resultado:${id}`);
      if (res) resultados.push(res);
    }

    return NextResponse.json({ resultados });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 });
  }
}
