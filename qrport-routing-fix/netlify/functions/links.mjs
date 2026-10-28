import { store,json,auth,validUrl,slugOk,itemKey } from './_shared.mjs';
export default async (req) => {
 if(!auth(req)) return json({error:'Unauthorized. Set QR_ADMIN_PASSWORD in Netlify and log in.'},401);
 try {
  const s = store();
  if(req.method==='GET') {
   const {blobs} = await s.list({prefix:'item:'});
   const entries = await Promise.all(blobs.map(b=>s.get(b.key,{type:'json'})));
   return json({items:entries.filter(Boolean).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))});
  }
  if(req.method==='POST') {
   const data=await req.json();
   if(!validUrl(data.url)) return json({error:'Enter a valid http(s) destination URL.'},400);
   const title=String(data.title||'Untitled QR').trim().slice(0,100);
   let slug;
   for(let i=0;i<8;i++) {
    slug=`qr-${crypto.randomUUID().slice(0,10)}`;
    if(!(await s.get(itemKey(slug)))) break;
   }
   const now=new Date().toISOString();
   const item={slug,title,url:data.url,createdAt:now,updatedAt:now,scans:0};
   await s.setJSON(itemKey(slug),item);
   return json({item},201);
  }
  if(req.method==='PATCH') {
   const data=await req.json();
   if(!slugOk(data.slug)) return json({error:'Invalid QR identifier.'},400);
   if(!validUrl(data.url)) return json({error:'Enter a valid http(s) destination URL.'},400);
   const old=await s.get(itemKey(data.slug),{type:'json'});
   if(!old) return json({error:'QR code not found.'},404);
   const item={...old,title:String(data.title||'Untitled QR').trim().slice(0,100),url:data.url,updatedAt:new Date().toISOString()};
   await s.setJSON(itemKey(data.slug),item);
   return json({item});
  }
  if(req.method==='DELETE') {
   const data=await req.json();
   if(!slugOk(data.slug)) return json({error:'Invalid QR identifier.'},400);
   await s.delete(itemKey(data.slug));
   return json({ok:true});
  }
  return json({error:'Method not allowed'},405);
 } catch(e) { console.error(e); return json({error:'Storage error. Check Netlify deploy and Blobs configuration.'},500); }
};
