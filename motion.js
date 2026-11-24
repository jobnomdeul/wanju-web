'use strict';
// Animate the supplied pixels in independent SVG layers; the original atlas stays intact.
(()=>{
 const assets=new URL('./assets/',document.currentScript.src),sheet=new URL('emotions-transparent.png',assets).href;
 const unit=250.8;let serial=0;
 const rect=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
 const circle=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`;
 const star=(x,y)=>`<path transform="translate(${x} ${y})" d="M0-7 2-2 7 0 2 2 0 7-2 2-7 0-2-2Z" fill="#f8cc58"/>`;
 const plans=[
  {base:'cheer',parts:[['rays',rect(40,0,125,78),'100px 70px']]},
  {base:'resolve'},
  {study:true},
  {base:'sleep',parts:[['sleep-z',rect(125,0,125,97),'180px 75px']]},
  {base:'summit',parts:[['flag',rect(175,0,75,130),'176px 85px']]},
  {base:'music',parts:[['notes',rect(203,0,47,94),'221px 70px']]},
  {base:'tea',extra:'<g class="motion-steam"><path d="M210 146C190 126 229 112 209 91" fill="none" stroke="#d8ad70" stroke-width="2.5" stroke-linecap="round"/></g>'},
  {base:'stretch'},
  {base:'puzzle',parts:[['scribble',rect(0,0,110,94),'65px 65px'],['sweat',circle(225,97,18),'225px 97px']]},
  {base:'content',parts:[['sparkles',circle(33,68,25)+circle(222,60,26)+circle(226,126,19),'125px 100px']]},
  {base:'checklist',extra:`<g class="motion-check-glint">${star(225,125)}</g>`},
  {base:'book-hug',extra:`<g class="motion-sparkles">${star(38,123)}</g>`},
  {base:'progress',extra:`<g class="motion-check-glint">${star(219,171)}</g>`},
  {base:'surprise',parts:[['surprise-mark',rect(199,0,51,128),'220px 100px']]},
  {base:'happy-cry',extra:'<g class="motion-teardrop"><path d="M62 192Q54 203 62 205Q70 203 62 192M194 190Q186 201 194 203Q202 201 194 190" fill="#74bfdf"/></g>'},
  {base:'typing',extra:'<path class="motion-screen-light" d="M126 187 152 182" fill="none" stroke="#fff7d9" stroke-width="2.5" stroke-linecap="round"/>'},
  {base:'clock',extra:'<g class="motion-clock-tick" fill="none" stroke="#f4b92e" stroke-width="3" stroke-linecap="round"><path d="M208 57 214 48M219 65 230 63"/></g>'},
  {base:'night',extra:`<g class="motion-night-stars">${star(27,32)}${star(158,28)}${star(223,77)}</g>`},
  {base:'proud',extra:`<g class="motion-pass-spark">${star(63,66)}${star(42,86)}</g>`},
  {base:'thinking'},
  {base:'date',extra:'<g class="motion-date-rays" fill="none" stroke="#f1b42e" stroke-width="3" stroke-linecap="round"><path d="M144 47 142 36M154 48 160 39"/></g>'},
  {base:'tired',parts:[['tired-cloud',rect(20,0,100,94),'72px 60px']]},
  {base:'confidence',parts:[['confidence-star',circle(25,55,23),'25px 55px']]},
  {base:'blanket'},
  {base:'heart-hug',parts:[['hearts',circle(30,36,25)+circle(196,24,25)+circle(236,61,20),'125px 70px']]}
 ];
 // The head and arm use separate displacement fields, like a small 2D puppet.
 // They deform only a local region of the supplied art; there are no cut seams.
 const poses=[
  [[123,130,86,88],[200,112,42,57],'turn',42,28],
  [[126,148,85,78],[81,211,39,38],'up',28,20],
  [[130,146,85,72],[84,201,36,39],'write',30,18],
  [[129,164,83,63],[88,220,42,28],'up',10,16],
  [[126,132,73,78],[159,163,34,44],'turn',30,18],
  [[125,132,85,83],[83,216,37,30],'turn',16,32],
  [[126,130,83,77],[164,190,47,48],'up',32,22],
  [[123,127,77,78],[191,141,46,65],'turn',46,25],
  [[129,139,82,76],[84,215,37,29],'turn',20,26],
  [[130,137,82,78],[184,205,42,45],'turn',27,28],
  [[119,131,82,80],[93,205,40,43],'turn',26,22],
  [[134,131,78,79],[94,203,35,42],'up',20,23],
  [[119,133,78,80],[183,145,42,49],'turn',40,26],
  [[128,133,77,75],[153,209,43,40],'up',23,34],
  [[129,136,80,75],[173,207,43,40],'up',22,20],
  [[119,126,78,77],[88,210,37,35],'write',20,14],
  [[124,128,78,77],[112,196,38,42],'turn',26,23],
  [[137,142,78,72],[167,218,38,32],'write',16,12],
  [[122,133,80,78],[183,163,35,51],'turn',32,28],
  [[125,136,80,79],[150,214,42,37],'turn',20,34],
  [[126,146,79,77],[81,164,43,49],'turn',30,26],
  [[126,183,78,51],[177,218,37,27],'up',8,12],
  [[129,140,79,81],[196,190,38,48],'turn',36,30],
  [[124,137,79,78],[122,218,39,33],'up',10,16],
  [[128,134,78,77],[83,212,38,38],'up',25,24]
 ];
 const fieldCache=new Map();
 function fieldURL(box,kind){
  const key=box.join(',')+kind;if(fieldCache.has(key))return fieldCache.get(key);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=251;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(251,251),[cx,cy,rx,ry]=box;
  for(let y=0;y<251;y++)for(let x=0;x<251;x++){
   const dx=(x-cx)/rx,dy=(y-cy)/ry,r=Math.hypot(dx,dy);
   const falloff=r<.55?1:r>=1?0:(1-Math.cos(Math.PI*(1-r)/.45))/2;
   const turn=kind==='turn',vx=turn?-dy:kind==='up'?0:1,vy=turn?dx:kind==='up'?1:.38;
   const i=(y*251+x)*4;pixels.data[i]=128+Math.round(105*vx*falloff);pixels.data[i+1]=128+Math.round(105*vy*falloff);pixels.data[i+2]=128;pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);const url=canvas.toDataURL();fieldCache.set(key,url);return url;
 }
 function puppet(id,sticker){
  const [head,arm,kind,armRange,headRange]=poses[sticker],study=sticker===2;
  const headValues=study?`0;0;${headRange};${headRange};0;0;-${headRange*.65};0;0`:`0;0;${headRange};-${headRange*.65};${headRange*.4};0;0;0;0`;
  const armValues=study?`0;0;${armRange};-${armRange*.6};${armRange};-${armRange*.5};${armRange*.9};-${armRange*.6};${armRange*.9};0;-${armRange*.6};0;0`:`0;0;${armRange};-${armRange*.6};${armRange*.8};-${armRange*.4};${armRange*.55};0;0;0;0;0;0`;
  return `<filter id="${id}-pose" x="0" y="0" width="251" height="251" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feImage href="${fieldURL(head,'turn')}" x="0" y="0" width="251" height="251" result="head-field"/><feDisplacementMap in="SourceGraphic" in2="head-field" xChannelSelector="R" yChannelSelector="G" result="head-pose"><animate attributeName="scale" values="${headValues}" keyTimes="0;.1;.24;.36;.48;.6;.72;.84;1" dur="4.8s" calcMode="spline" keySplines="${Array(8).fill('.4 0 .2 1').join(';')}" repeatCount="indefinite"/></feDisplacementMap><feImage href="${fieldURL(arm,kind)}" x="0" y="0" width="251" height="251" result="arm-field"/><feDisplacementMap in="head-pose" in2="arm-field" xChannelSelector="R" yChannelSelector="G"><animate attributeName="scale" values="${armValues}" keyTimes="0;.06;.14;.22;.3;.38;.46;.54;.63;.72;.82;.9;1" dur="4.8s" calcMode="spline" keySplines="${Array(12).fill('.35 0 .65 1').join(';')}" repeatCount="indefinite"/></feDisplacementMap></filter>`;
 }
 function art(sticker){
  const id='wm'+(++serial),plan=plans[sticker],image=`<g clip-path="url(#${id}-full)"><image href="${sheet}" x="${-(sticker%5)*unit}" y="${-Math.floor(sticker/5)*unit}" width="1254" height="1254"/></g>`;
  const left=[21,22].includes(sticker)?7:0,right=[3,7,15,22].includes(sticker)?7:0,top=sticker>=5&&sticker<=14?10:0;
  let defs=`<clipPath id="${id}-full">${rect(left,top,unit-left-right,unit-top)}</clipPath>`,body='';
  defs+=puppet(id,sticker);
  if(plan.study){
   body=`<g class="pose-puppet" filter="url(#${id}-pose)">${image}</g><g class="writing-marks" fill="none" stroke="#ab845b" stroke-width="1.2" stroke-linecap="round"><path class="writing-mark-one" d="M95 224Q106 222 117 224"/><path class="writing-mark-two" d="M91 230Q105 227 118 230"/></g>`;
  }else{
   const parts=plan.parts||[];
   if(parts.length){defs+=`<mask id="${id}-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="251" height="251"><rect width="251" height="251" fill="white"/><g fill="black">${parts.map(p=>p[1]).join('')}</g></mask>`;}
   body=`<g class="pose-puppet" filter="url(#${id}-pose)"><g class="motion-base motion-${plan.base}"${parts.length?` mask="url(#${id}-cut)"`:''}>${image}</g></g>`;
   parts.forEach(([name,shape,origin],i)=>{defs+=`<clipPath id="${id}-part${i}">${shape}</clipPath>`;body+=`<g class="motion-${name}" style="transform-origin:${origin}" clip-path="url(#${id}-part${i})">${image}</g>`;});
   body+=plan.extra||'';
  }
  return `<svg class="motion-art" viewBox="0 0 ${unit} ${unit}" aria-hidden="true" focusable="false"><defs>${defs}</defs><g clip-path="url(#${id}-full)">${body}</g></svg>`;
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function sync(el){const svg=el.querySelector('.motion-art');if(!svg)return;const paused=document.hidden||reduced.matches||!el.classList.contains('is-animated')||!el.classList.contains('motion-detailed');paused?svg.pauseAnimations():svg.unpauseAnimations();}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){entry.target.classList.toggle('is-animated',entry.isIntersecting);sync(entry.target);}},{rootMargin:'30px'});
 const sizes=new ResizeObserver(entries=>{for(const entry of entries){entry.target.classList.toggle('motion-detailed',entry.contentRect.width>=76);sync(entry.target);}});
 function decorate(root=document){
  const targets=[...(root.matches?.('.mascot[data-sticker]')?[root]:[]),...root.querySelectorAll('.mascot[data-sticker]')];
  for(const el of targets){const n=Number(el.dataset.sticker);if(el.dataset.motionReady||!Number.isInteger(n)||n<0||n>=plans.length)continue;el.dataset.motionReady='true';el.style.backgroundPosition=`${n%5*25}% ${Math.floor(n/5)*25}%`;el.style.setProperty('--sticker-sheet',`url("${sheet}")`);el.insertAdjacentHTML('beforeend',art(n));observer.observe(el);sizes.observe(el);}
 }
 new MutationObserver(records=>{for(const record of records)for(const node of record.removedNodes){if(node.nodeType!==1)continue;const removed=[...(node.matches('.mascot[data-motion-ready]')?[node]:[]),...node.querySelectorAll('.mascot[data-motion-ready]')];for(const el of removed){observer.unobserve(el);sizes.unobserve(el);}}}).observe(document.body,{childList:true,subtree:true});
 function syncAll(){document.documentElement.classList.toggle('motion-paused',document.hidden);document.querySelectorAll('.mascot[data-motion-ready]').forEach(sync);}
 document.addEventListener('visibilitychange',syncAll);reduced.addEventListener('change',syncAll);
 window.WanjuMotion=Object.freeze({decorate,count:plans.length});decorate();syncAll();
})();
