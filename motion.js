'use strict';
// Web and Flutter consume the same encoded frame assets. No pixel deformation.
(()=>{
 const assets=new URL('./assets/stickers/',document.currentScript.src);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function sync(el){
  const image=el.querySelector('.sticker-motion');if(!image)return;
  const moving=!document.hidden&&!reduced.matches&&el.classList.contains('is-animated');
  const key=String(Number(el.dataset.sticker)).padStart(2,'0');
  const url=new URL(`${key}${moving?'':'-still'}.webp`,assets).href;
  if(image.src!==url)image.src=url;
 }
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){entry.target.classList.toggle('is-animated',entry.isIntersecting);sync(entry.target);}});
 function decorate(root=document){
  const targets=[...(root.matches?.('.mascot[data-sticker]')?[root]:[]),...root.querySelectorAll('.mascot[data-sticker]')];
  for(const el of targets){
   const n=Number(el.dataset.sticker);if(!Number.isInteger(n)||n<0||n>=25)continue;
   if(el.dataset.motionReady===String(n))continue;
   el.querySelector('.sticker-motion')?.remove();el.dataset.motionReady=String(n);
   const image=document.createElement('img');image.className='sticker-motion';image.alt='';image.width=image.height=360;image.decoding='async';image.loading='lazy';image.draggable=false;
   image.addEventListener('error',()=>{image.hidden=true;el.classList.add('motion-failed');},{once:true});
   el.classList.remove('motion-failed');el.append(image);sync(el);observer.observe(el);
  }
 }
 new MutationObserver(records=>{for(const record of records)for(const node of record.removedNodes){if(node.nodeType!==1)continue;const removed=[...(node.matches('.mascot[data-motion-ready]')?[node]:[]),...node.querySelectorAll('.mascot[data-motion-ready]')];removed.forEach(el=>observer.unobserve(el));}}).observe(document.body,{childList:true,subtree:true});
 const syncAll=()=>document.querySelectorAll('.mascot[data-motion-ready]').forEach(sync);
 document.addEventListener('visibilitychange',syncAll);reduced.addEventListener('change',syncAll);
 window.WanjuMotion=Object.freeze({decorate,count:25});decorate();
})();
