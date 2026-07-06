import { NextRequest, NextResponse } from 'next/server';
import { getServerApiUrl } from '@/lib/server-api-url';

export async function POST(req: NextRequest) {
  try {
    const apiUrl = getServerApiUrl();
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
    return NextResponse.json(
      {
        message:
          error?.message ||
          'Cannot reach API server. Check API_URL on Vercel.',
      },
      { status: 502 },
    );
  }
}
