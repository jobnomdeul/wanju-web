'use strict';
// Presentation-only hardware controls. App preview gestures remain inside the screen.
document.querySelectorAll('.device-stage').forEach(stage=>{
 const device=stage.querySelector('.device'),screen=device.querySelector('.device-screen');
 stage.classList.add('rotatable-device');
 const back=document.createElement('div');back.className='device-back';back.setAttribute('aria-hidden','true');
 back.innerHTML='<div class="camera-bump"><i class="camera-lens lens-one"></i><i class="camera-lens lens-two"></i><i class="camera-lens lens-three"></i><i class="camera-flash"></i><i class="camera-sensor"></i></div><div class="back-wordmark"><img src="./assets/logo.webp" width="48" height="48" alt=""><span>WANJU</span></div><span class="back-engraving">너의 속도로, 끝까지.</span>';
 device.prepend(back);
 const front=document.createElement('div');front.className='device-front';front.setAttribute('aria-hidden','true');device.prepend(front);
 const edges=document.createElement('div');edges.className='device-edges';edges.setAttribute('aria-hidden','true');device.prepend(edges);
 // Extrude the same rounded outline as the front/back caps. Every adjacent
 // segment shares endpoints, including all four curved corners.
 function buildEdges(){
  const w=device.offsetWidth,h=device.offsetHeight,r=Math.min(49,w/2,h/2),points=[];
  for(const [cx,cy,start] of [[w-r,r,-90],[w-r,h-r,0],[r,h-r,90],[r,r,180]]){
   for(let step=0;step<=12;step++){const angle=(start+step*7.5)*Math.PI/180;points.push([cx+r*Math.cos(angle),cy+r*Math.sin(angle)]);}
  }
  const fragment=document.createDocumentFragment();
  points.forEach((point,i)=>{const next=points[(i+1)%points.length],dx=next[0]-point[0],dy=next[1]-point[1],length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),face=document.createElement('div');
   face.className='device-edge';face.style.width=(length+.12)+'px';face.style.left=((point[0]+next[0])/2-length/2)+'px';face.style.top=((point[1]+next[1])/2-9)+'px';face.style.transform=`rotateZ(${angle}rad) rotateX(90deg)`;
   const light=Math.round(65+14*Math.cos(angle-1));face.style.background=`linear-gradient(0deg,hsl(39 15% ${light-8}%),hsl(39 21% ${light+9}%) 48%,hsl(39 16% ${light-5}%))`;fragment.append(face);
  });edges.replaceChildren(fragment);
 }
 new ResizeObserver(buildEdges).observe(device);buildEdges();
 device.tabIndex=0;device.setAttribute('role','group');device.setAttribute('aria-label','휴대폰 3D 모형. 드래그 또는 방향키로 회전, Home 키로 원위치');
 const hardware=[['action','무음 전환'],['volume-up','음량 높이기'],['volume-down','음량 낮추기'],['power','화면 끄기']];
 for(const [key,label] of hardware){const button=document.createElement('button');button.type='button';button.className='hardware-key key-'+key;button.dataset.hardware=key;button.setAttribute('aria-label',label);button.title=label;if(key==='action'||key==='power')button.setAttribute('aria-pressed','false');device.append(button);}
 const toast=document.createElement('div');toast.className='hardware-toast';toast.setAttribute('role','status');toast.hidden=true;device.append(toast);
 let yaw=matchMedia('(prefers-reduced-motion: reduce)').matches?0:(stage.classList.contains('lock-device')?14:-12),pitch=matchMedia('(prefers-reduced-motion: reduce)').matches?0:4,drag=null,suppressClick=false,volume=65,muted=false,sleeping=false,toastTimer;
 const initial={yaw,pitch};
 function paint(){device.style.setProperty('--device-yaw',yaw+'deg');device.style.setProperty('--device-pitch',pitch+'deg');const backFacing=Math.cos(yaw*Math.PI/180)<0;device.dataset.back=String(backFacing);screen.inert=sleeping||backFacing;}
 function reset(){yaw=initial.yaw;pitch=initial.pitch;paint();}
 function feedback(text){toast.textContent=text;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,1100);}
 const isControl=target=>target.closest('button,a,input,select,textarea,label,[role=tab],.profile-flipper,.sticker-tray');
 stage.addEventListener('pointerdown',event=>{
  if(event.button!==0||event.isPrimary===false||isControl(event.target))return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch,touch:event.pointerType==='touch',active:false};
  suppressClick=false;
  if(!drag.touch)stage.setPointerCapture(event.pointerId);
 });
 stage.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.active){
   if(Math.hypot(dx,dy)<6)return;
   if(drag.touch&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
   drag.active=true;suppressClick=true;stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');
  }
  yaw=drag.yaw+dx*.65;pitch=Math.max(-35,Math.min(35,drag.pitch-dy*.25));paint();
 });
 function finish(event){if(!drag||drag.id!==event.pointerId)return;if(event.type==='pointercancel')suppressClick=false;else if(drag.active&&Math.abs(Math.cos(yaw*Math.PI/180))<.28){yaw=Math.round(yaw/180)*180;paint();}drag=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);}
 stage.addEventListener('pointerup',finish);stage.addEventListener('pointercancel',finish);stage.addEventListener('lostpointercapture',()=>{if(drag)suppressClick=false;drag=null;stage.classList.remove('is-dragging');});
 stage.addEventListener('click',event=>{if(suppressClick&&!isControl(event.target)){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
 stage.addEventListener('dblclick',event=>{if(!isControl(event.target)){event.preventDefault();reset();}});
 device.addEventListener('keydown',event=>{
  if(event.target!==device||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','Escape'].includes(event.key))return;
  event.preventDefault();if(event.key==='Home'||event.key==='Escape'){reset();return;}
  if(event.key==='ArrowLeft')yaw-=20;if(event.key==='ArrowRight')yaw+=20;
  if(event.key==='ArrowUp')pitch=Math.min(35,pitch+10);if(event.key==='ArrowDown')pitch=Math.max(-35,pitch-10);paint();
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
