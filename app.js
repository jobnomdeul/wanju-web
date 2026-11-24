'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const names=['주먹 들고 응원','불꽃 같은 의지','책 읽으며 공부','책상에서 잠깐 잠','정상에 깃발','음악 들으며 집중','따뜻한 차와 휴식','가볍게 기지개','어려운 문제 고민','만족스러운 미소','계획 달력 확인','책 더미와 꾸준함','성장 기록을 응원','새로운 발견에 놀람','감동의 눈물','노트북으로 공부','시간을 확인','밤에도 책상 앞','완료한 답안 자랑','궁금해서 생각 중','중요한 날짜 표시','지쳐서 쉬는 중','반짝이는 자신감','담요 속 편안한 휴식','하트를 안고 응원'];
const paths={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/>',play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',chart:'<path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',coffee:'<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 0 1 0 6h-2M8 2v3m5-3v3"/>',heart:'<path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1s-1 7 8 15c9-8 11-12 8-15Z"/>'};
Object.assign(paths,{
 pause:'<path d="M9 5v14M15 5v14"/>',
 person:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
 back:'<path d="m15 5-7 7 7 7"/>',
 swipe:'<path d="m5 6-3 3 3 3M2 9h20m-3-3 3 3-3 3M8 20l-2-4a2 2 0 0 1 3-2l1 1V9a2 2 0 0 1 4 0v5l4 1v5"/>',
 volume:'<path d="m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>'
});
function decorate(root=document){
 root.querySelectorAll('[data-sticker]').forEach(el=>{const n=Number(el.dataset.sticker);el.style.backgroundPosition=`${n%5*25}% ${Math.floor(n/5)*25}%`;});
 root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[el.dataset.icon]||''}</svg>`;});
}
const announce=text=>{$('#website-status').textContent=text;};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches,virtualDay=204,anchor=performance.now(),frozen='';
function value(){const elapsed=(performance.now()-anchor)/86400000;return (Math.max(0,Math.min(100,(365-virtualDay-elapsed)/365*100))).toFixed(10);}
function paintCounter(){
 const [whole,fraction]=(paused?frozen:value()).split('.');
 $$('[data-live-counter]').forEach(el=>{el.querySelector('b').textContent=whole+'.';el.querySelector('span').textContent=fraction;});
}
function syncPause(){
 if(paused&&!frozen)frozen=value();
 $$('.counter-pause').forEach(b=>{
  const label=paused?'숫자 표시 다시 시작':'숫자 표시 멈춤';
  b.setAttribute('aria-pressed',String(paused));
  if(b.classList.contains('icon-button')){
   b.setAttribute('aria-label',label);b.title=label;
   b.innerHTML=`<span data-icon="${paused?'play':'pause'}" aria-hidden="true"></span>`;
   decorate(b);
  }else b.textContent=label;
 });
 paintCounter();
}
document.addEventListener('click',e=>{
 if(!e.target.closest('.counter-pause'))return;
 paused=!paused;if(paused)frozen=value();syncPause();
 announce(paused?'숫자 표시를 멈췄습니다. 실제 시간 계산은 계속됩니다.':'현재 시각에 맞춰 숫자 표시를 다시 시작합니다.');
});
$('#read-counter').addEventListener('click',()=>announce(`365일 가상 여정의 남은 시간은 ${paused?frozen:value()}퍼센트입니다. 학습 완성도가 아닙니다.`));
$('#journey-day').addEventListener('input',e=>{
 virtualDay=Number(e.target.value);anchor=performance.now();frozen=value();
 $('#day-number').textContent=virtualDay;
 e.target.setAttribute('aria-valuetext',`365일 중 ${virtualDay}일째`);
 $$('.journey-line span').forEach(el=>el.style.width=`${virtualDay/365*100}%`);
 paintCounter();
});
$('#reduce-transparency').addEventListener('click',e=>{
 const opaque=e.currentTarget.getAttribute('aria-pressed')!=='true';
 e.currentTarget.setAttribute('aria-pressed',String(opaque));
 document.body.classList.toggle('reduce-transparency',opaque);
 announce(opaque?'투명 효과를 줄였습니다.':'투명 효과를 다시 사용합니다.');
});
let current='today',tasks=[false,true,false],selectedDay=17,timerRunning=false,timerAccumulated=0,timerAnchor=0,profilePublic=false;
const mascot=(n,extra='')=>`<span class="mascot" data-sticker="${n}" ${extra||'aria-hidden="true"'}></span>`;
function taskList(){return ['수열 기출 15문제','영단어 30개','독서 지문 3개'].map((t,i)=>`<label class="task-row"><input type="checkbox" data-task="${i}" ${tasks[i]?'checked':''}><span>${t}</span></label>`).join('');}
function profileMarkup(){
 return `<div class="demo-heading"><h3>내 프로필</h3><button type="button" class="icon-button" data-switch="record" aria-label="기록으로 돌아가기"><span data-icon="back" aria-hidden="true"></span></button></div>
 <div class="profile-flipper" aria-label="개인·공개 프로필 카드" role="group">
 <div class="profile-rotor ${profilePublic?'is-public':''}">
 ${[{public:false,title:'개인 프로필',name:'나의 완주',sticker:0},{public:true,title:'공개 프로필',name:'노란 배낭',sticker:24}].map(p=>`<div class="profile-face ${p.public?'profile-back':''}" data-profile-face="${p.public}" aria-hidden="${p.public!==profilePublic}" ${p.public!==profilePublic?'inert':''}><div class="profile-face-label"><span>${p.title}</span><span data-icon="swipe" aria-hidden="true"></span></div><div class="profile-person">${mascot(p.sticker)}<strong>${p.name}</strong></div></div>`).join('')}
 </div></div>
 <div class="profile-choice" role="group" aria-label="프로필 전환"><button type="button" data-profile-side="personal" aria-pressed="${!profilePublic}">개인</button><button type="button" data-profile-side="public" aria-pressed="${profilePublic}">공개</button></div>`;
}
function renderDemo(name){
 const panel=$('#demo-panel'),scrollTop=current===name?panel.scrollTop:0;
 current=name;
 const navigation=name==='profile'?'record':name;
 $$('[data-demo]').forEach(t=>{const active=t.dataset.demo===navigation;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 panel.setAttribute('aria-labelledby',`tab-${navigation}`);
 const views={
  profile:profileMarkup,
  today:()=>`<div class="demo-heading"><h3>완주</h3></div>
   <div class="demo-card"><span class="meta">수능까지 남은 시간</span><div class="phone-counter" data-live-counter aria-hidden="true"><b>44.</b><span>0000000000</span><small>%</small></div></div>
   <div class="demo-motto">${mascot(24)}<p>오늘의 한 걸음도 소중해.</p></div>
   <div class="demo-card"><span class="meta">수학</span><strong>수열 기출 15문제</strong><button class="button primary" data-switch="focus">이 공부 시작하기</button></div>
   <strong>오늘 계획</strong>${taskList()}`,
  plan:()=>`<h3>나의 계획</h3><span class="meta">6월</span>
   <div class="demo-week" aria-label="날짜 선택">${[15,16,17,18,19,20,21].map((d,i)=>`<button type="button" data-day="${d}" aria-label="6월 ${d}일 ${'월화수목금토일'[i]}요일" aria-pressed="${selectedDay===d}"><span>${'월화수목금토일'[i]}</span><strong>${d}</strong></button>`).join('')}</div>
   <strong>6월 ${selectedDay}일</strong><div class="schedule-item"><strong>${selectedDay===17?'학교 진로 활동':'학교 정규 수업'}</strong><small>학교 일정</small></div><div class="schedule-item personal"><strong>오후 7시 · 오답 정리</strong><small>나만 보기</small></div><strong>할 일</strong>${taskList()}`,
  focus:()=>`<h3>${timerRunning?'집중 중':timerAccumulated>0?'쉬는 중':'공부 준비'}</h3><div class="timer-art">${mascot(timerRunning?2:6)}</div><p style="text-align:center">수학 · 수열 기출 15문제</p><div class="timer-value" id="timer-value" role="timer" aria-label="가상 공부 타이머" aria-live="off">00:00:00</div><div class="timer-controls"><button type="button" class="button primary" id="timer-toggle">${timerRunning?'잠깐 쉬기':'집중 시작'}</button><button type="button" class="button subtle-button" id="timer-reset">초기화</button></div>`,
  together:()=>`<h3>함께</h3><div class="demo-card"><strong>노란 배낭 파티</strong><span class="meta">친구 3명</span></div>${[['봄','조금씩 매일','수학 공부 중','2시간 10분'],['달','다시 한 걸음','휴식 중','1시간 45분'],['나','나의 완주','오늘 준비 중','3시간 24분']].map(m=>`<div class="member-row"><span class="member-avatar" aria-hidden="true">${m[0]}</span><span>${m[1]}<small>${m[2]}</small></span><strong>${m[3]}</strong></div>`).join('')}<button type="button" class="button primary" id="open-stickers">응원 보내보기</button>`,
  record:()=>`<div class="demo-heading"><h3>나의 기록</h3><button type="button" id="show-profile" class="icon-button" data-switch="profile" aria-label="내 프로필"><span data-icon="person" aria-hidden="true"></span></button></div><div class="demo-card"><span class="meta">이번 주 공부</span><strong class="record-total">18시간 24분</strong></div><div class="record-chart" role="img" aria-label="예시 주간 공부 시간: 월 2시간, 화 3시간, 수 2시간 30분, 목 4시간, 금 3시간 30분, 토 3시간 24분, 일 0시간">${[50,75,62.5,100,87.5,85,0].map((h,i)=>`<div class="record-bar" style="height:${Math.max(3,h)}%"><span>${'월화수목금토일'[i]}</span></div>`).join('')}</div><table class="demo-table"><caption class="sr-only">과목별 가상 주간 공부 시간</caption><tbody><tr><td>수학</td><td>8시간 24분</td></tr><tr><td>국어</td><td>6시간</td></tr><tr><td>영어</td><td>4시간</td></tr></tbody></table>`
 };
 panel.innerHTML=views[name]();decorate(panel);paintCounter();paintTimer();panel.scrollTop=scrollTop;
 if(name==='plan'){
  const ribbon=panel.querySelector('.demo-week'),selected=ribbon.querySelector('[aria-pressed=true]');
  ribbon.scrollLeft=Math.max(0,selected.offsetLeft-ribbon.offsetLeft-ribbon.clientWidth/2+selected.offsetWidth/2);
 }
}
$$('[data-demo]').forEach((tab,i,all)=>{
 tab.addEventListener('click',()=>renderDemo(tab.dataset.demo));
 tab.addEventListener('keydown',e=>{
  let n;if(e.key==='ArrowRight')n=(i+1)%all.length;if(e.key==='ArrowLeft')n=(i+all.length-1)%all.length;if(e.key==='Home')n=0;if(e.key==='End')n=all.length-1;
  if(n!==undefined){e.preventDefault();renderDemo(all[n].dataset.demo);all[n].focus({preventScroll:true});}
 });
});
function timerMilliseconds(){return timerAccumulated+(timerRunning?performance.now()-timerAnchor:0);}
function paintTimer(){
 const el=$('#timer-value');if(!el)return;
 const s=Math.floor(timerMilliseconds()/1000),text=[Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');
 if(el.textContent!==text)el.textContent=text;
}
$('#demo-panel').addEventListener('change',e=>{
 if(e.target.matches('[data-task]')){tasks[Number(e.target.dataset.task)]=e.target.checked;announce(`할 일을 ${e.target.checked?'완료':'미완료'}로 변경했습니다.`);}
});
$('#demo-panel').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.switch){
  renderDemo(b.dataset.switch);
  const target=b.dataset.switch==='focus'?$('#timer-toggle'):b.dataset.switch==='record'?$('#show-profile'):$('#demo-panel');
  target?.focus({preventScroll:true});
 }
 if(b.dataset.profileSide)setProfileSide(b.dataset.profileSide==='public');
 if(b.dataset.day){selectedDay=Number(b.dataset.day);renderDemo('plan');$(`[data-day="${selectedDay}"]`).focus({preventScroll:true});}
 if(b.id==='timer-toggle'){
  if(timerRunning)timerAccumulated+=performance.now()-timerAnchor;else timerAnchor=performance.now();
  timerRunning=!timerRunning;renderDemo('focus');$('#timer-toggle').focus({preventScroll:true});
  announce(timerRunning?'집중 타이머를 시작했어요.':'타이머를 멈췄어요.');
 }
 if(b.id==='timer-reset'){timerRunning=false;timerAccumulated=0;renderDemo('focus');$('#timer-reset').focus({preventScroll:true});announce('타이머를 초기화했어요.');}
 if(b.id==='open-stickers'){$('#together').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});$('#sticker-tray button').focus({preventScroll:true});}
});
function setProfileSide(value){
 profilePublic=value;
 const rotor=$('.profile-rotor');if(!rotor)return;
 rotor.classList.toggle('is-public',value);
 $$('[data-profile-face]').forEach(face=>{const active=(face.dataset.profileFace==='true')===value;face.setAttribute('aria-hidden',String(!active));face.toggleAttribute('inert',!active);});
 $$('[data-profile-side]').forEach(button=>button.setAttribute('aria-pressed',String((button.dataset.profileSide==='public')===value)));
 announce(value?'공개 프로필을 보고 있어요.':'개인 프로필을 보고 있어요.');
}
let profilePointer=null;
$('#demo-panel').addEventListener('pointerdown',e=>{if(e.target.closest('.profile-flipper'))profilePointer={id:e.pointerId,x:e.clientX,y:e.clientY};});
$('#demo-panel').addEventListener('pointerup',e=>{
 if(!profilePointer||profilePointer.id!==e.pointerId)return;
 const dx=e.clientX-profilePointer.x,dy=e.clientY-profilePointer.y;profilePointer=null;
 if(Math.abs(dx)>=36&&Math.abs(dx)>Math.abs(dy)*1.2)setProfileSide(!profilePublic);
});
$('#demo-panel').addEventListener('pointercancel',()=>profilePointer=null);
let selectedSticker=0;
$('#sticker-tray').innerHTML=names.map((name,i)=>`<button type="button" data-choice="${i}" aria-label="${name}" aria-pressed="${i===0}">${mascot(i)}</button>`).join('');
$('#sticker-tray').addEventListener('click',e=>{
 const b=e.target.closest('[data-choice]');if(!b)return;
 selectedSticker=Number(b.dataset.choice);$$('[data-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));
});
$('#send-sticker').addEventListener('click',()=>{
 const el=document.createElement('div');el.className='standalone-sticker own';el.innerHTML=mascot(selectedSticker,`role="img" aria-label="${names[selectedSticker]}"`)+'<span>방금</span>';
 const log=$('#conversation-log');log.append(el);if(log.querySelectorAll('.standalone-sticker').length>8)log.querySelector('.standalone-sticker').remove();
 decorate(el);log.scrollTop=log.scrollHeight;announce(`${names[selectedSticker]} 스티커를 표시했어요.`);
});
const menu=$('#menu-toggle'),nav=$('#site-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
matchMedia('(min-width:901px)').addEventListener('change',closeMenu);
$('#lock-privacy').addEventListener('click',event=>{
 const hidden=event.currentTarget.getAttribute('aria-pressed')!=='true';
 event.currentTarget.setAttribute('aria-pressed',String(hidden));event.currentTarget.textContent=hidden?'과목 표시 켜기':'과목 표시 끄기';
 $('#lock-subject').textContent=hidden?'나의 집중 시간':'수학 · 수열 기출';
 announce(hidden?'미리보기에서 과목을 숨겼어요.':'미리보기에서 과목을 표시해요.');
});
reduced.addEventListener('change',event=>{if(event.matches){paused=true;frozen=value();syncPause();}});
$('#copyright-year').textContent=new Date().getFullYear();decorate();syncPause();renderDemo('today');
setInterval(()=>{if(!document.hidden){if(!paused)paintCounter();paintTimer();}},50);
