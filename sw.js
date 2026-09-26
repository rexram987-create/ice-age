const CACHE='ice-age-he-v4';
const SHELL=['/','/index.html','/style.css','/app.js','/data.js','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  const isImage=request.destination==='image';
  event.respondWith((isImage?caches.match(request).then(hit=>hit||fetchAndCache(request)):fetchAndCache(request).catch(()=>caches.match(request))).then(response=>response|| (request.mode==='navigate'?caches.match('/index.html'):Response.error())));
});
async function fetchAndCache(request){
  const response=await fetch(request);
  if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone())}
  return response;
}
