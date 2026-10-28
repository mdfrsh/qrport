import { getStore } from '@netlify/blobs';
export const store = () => getStore('qr-links');
export const json = (data,status=200) => new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export const auth = (req) => {
  const secret = Netlify.env.get('QR_ADMIN_PASSWORD');
  if (!secret) return false;
  const supplied = req.headers.get('x-admin-password') || '';
  // Compare exact value; use a high-entropy password stored in Netlify settings.
  return supplied.length >= 16 && supplied === secret;
};
export const validUrl = (value) => {
  try { const u = new URL(value); return ['http:','https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password && value.length <= 2048; }
  catch { return false; }
};
export const slugOk = (slug) => typeof slug === 'string' && /^[a-z0-9-]{4,48}$/.test(slug);
export const itemKey = slug => `item:${slug}`;
