export function getServerApiUrl(): string {
  const url = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://pos-backend-gold.vercel.app/v1'
  )
    .trim()
    .replace(/\/$/, '');

  return url;
}
