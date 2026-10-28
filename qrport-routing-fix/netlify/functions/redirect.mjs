import {store,slugOk,itemKey} from './_shared.mjs';
export default async (req) => {
 const slug=new URL(req.url).searchParams.get('slug');
 if(!slugOk(slug)) return new Response('QR code not found',{status:404});
 try {
  const item=await store().get(itemKey(slug),{type:'json',consistency:'strong'});
  if(!item || !/^https?:\/\//i.test(item.url)) return new Response('QR code not found',{status:404});
  // Intentionally no read-modify-write analytics increment: it would lose counts under concurrent scans.
  return new Response(null,{status:302,headers:{Location:item.url,'Cache-Control':'no-store, max-age=0','Referrer-Policy':'no-referrer'}});
 } catch(e) {console.error(e); return new Response('Temporarily unavailable',{status:503});}
};
