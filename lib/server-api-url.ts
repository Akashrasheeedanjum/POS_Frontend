const PRODUCTION_API_URL = 'https://pos-backend-gold.vercel.app/v1';

function isLocalUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

export function getServerApiUrl(): string {
  const raw = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    PRODUCTION_API_URL
  )
    .trim()
    .replace(/\/$/, '');

  // On Vercel, localhost points to the serverless function itself — not your PC
  if (process.env.VERCEL === '1' && isLocalUrl(raw)) {
    return PRODUCTION_API_URL;
  }

  return raw || PRODUCTION_API_URL;
}
