import { NextRequest, NextResponse } from 'next/server';
import { getServerApiUrl } from '@/lib/server-api-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const apiUrl = getServerApiUrl();

  try {
    const body = await req.json();

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({
      message: 'Invalid response from API server',
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Login proxy error:', { apiUrl, error: error?.message });

    return NextResponse.json(
      {
        message:
          'Cannot reach API server. Set API_URL to https://pos-backend-gold.vercel.app/v1 on Vercel (not localhost).',
        detail: error?.message,
        apiUrl,
      },
      { status: 502 },
    );
  }
}
