'use strict';
// Presentation-only hardware controls. App preview gestures remain inside the screen.
document.querySelectorAll('.device-stage').forEach(stage=>{
 const device=stage.querySelector('.device'),screen=device.querySelector('.device-screen');
 stage.classList.add('rotatable-device');
 const back=document.createElement('div');back.className='device-back';back.setAttribute('aria-hidden','true');
 back.innerHTML='<div class="camera-bump"><i class="camera-lens lens-one"></i><i class="camera-lens lens-two"></i><i class="camera-lens lens-three"></i><i class="camera-flash"></i><i class="camera-sensor"></i></div><div class="back-wordmark"><img src="./assets/logo.webp" width="48" height="48" alt=""><span>WANJU</span></div><span class="back-engraving">너의 속도로, 끝까지.</span>';
 device.prepend(back);
 for(const side of ['left','right','top','bottom']){const face=document.createElement('div');face.className='device-side side-'+side;face.setAttribute('aria-hidden','true');device.prepend(face);}
 const hardware=[['action','무음 전환'],['volume-up','음량 높이기'],['volume-down','음량 낮추기'],['power','화면 끄기']];
 for(const [key,label] of hardware){const button=document.createElement('button');button.type='button';button.className='hardware-key key-'+key;button.dataset.hardware=key;button.setAttribute('aria-label',label);button.title=label;if(key==='action'||key==='power')button.setAttribute('aria-pressed','false');device.append(button);}
 const toast=document.createElement('div');toast.className='hardware-toast';toast.setAttribute('role','status');toast.hidden=true;device.append(toast);
 const grip=document.createElement('button');grip.type='button';grip.className='device-grip';grip.setAttribute('aria-label','휴대폰 회전. 드래그하거나 방향키로 조절하고 Home 키로 초기화');grip.title='드래그하여 회전 · 눌러서 원위치';
 grip.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.1 8a8 8 0 0 1 13.2-2L20 8M4 16l1.7 2A8 8 0 0 0 19 16"/></svg>';stage.append(grip);
 let yaw=matchMedia('(prefers-reduced-motion: reduce)').matches?0:(stage.classList.contains('lock-device')?14:-12),pitch=matchMedia('(prefers-reduced-motion: reduce)').matches?0:4,drag=null,suppressClick=false,volume=65,muted=false,sleeping=false,toastTimer;
 const initial={yaw,pitch};
 function paint(){device.style.setProperty('--device-yaw',yaw+'deg');device.style.setProperty('--device-pitch',pitch+'deg');const backFacing=Math.cos(yaw*Math.PI/180)<0;device.dataset.back=String(backFacing);screen.inert=sleeping||backFacing;grip.setAttribute('aria-label',`휴대폰 회전, 좌우 ${Math.round(yaw%360)}도. 드래그하거나 방향키로 조절하고 Home 키로 초기화`);}
 function reset(){yaw=initial.yaw;pitch=initial.pitch;paint();}
 function feedback(text){toast.textContent=text;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,1100);}
 stage.addEventListener('pointerdown',event=>{
  if(event.button!==0||event.isPrimary===false||event.target.closest('.hardware-key'))return;
  if(event.target.closest('.device-screen')&&!event.target.closest('.device-status'))return;
  if(!event.target.closest('.device,.device-grip'))return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch,target:event.target};suppressClick=false;
  stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');
 });
 stage.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(Math.hypot(dx,dy)>4)suppressClick=true;
  yaw=drag.yaw+dx*.65;pitch=Math.max(-45,Math.min(45,drag.pitch-dy*.3));paint();
 });
 function finish(event){if(!drag||drag.id!==event.pointerId)return;drag=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);}
 stage.addEventListener('pointerup',finish);stage.addEventListener('pointercancel',finish);stage.addEventListener('lostpointercapture',()=>{drag=null;stage.classList.remove('is-dragging');});
 stage.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
 grip.addEventListener('click',reset);
 grip.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','Escape'].includes(event.key))return;
  event.preventDefault();if(event.key==='Home'||event.key==='Escape'){reset();return;}
  if(event.key==='ArrowLeft')yaw-=20;if(event.key==='ArrowRight')yaw+=20;
  if(event.key==='ArrowUp')pitch=Math.min(45,pitch+10);if(event.key==='ArrowDown')pitch=Math.max(-45,pitch-10);paint();
 });
 device.addEventListener('click',event=>{
  const button=event.target.closest('[data-hardware]');if(!button)return;
  const key=button.dataset.hardware;
  if(key==='power'){sleeping=!sleeping;device.classList.toggle('screen-off',sleeping);paint();button.setAttribute('aria-pressed',String(sleeping));button.setAttribute('aria-label',sleeping?'화면 켜기':'화면 끄기');button.title=sleeping?'화면 켜기':'화면 끄기';}
  else if(key==='action'){muted=!muted;button.setAttribute('aria-pressed',String(muted));feedback(muted?'무음 모드':'소리 모드');}
  else{volume=Math.max(0,Math.min(100,volume+(key==='volume-up'?10:-10)));feedback(`음량 ${volume}%`);}
 });
 paint();
});
