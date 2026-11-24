'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const names=['주먹 들고 응원','불꽃 같은 의지','책 읽으며 공부','책상에서 잠깐 잠','정상에 깃발','음악 들으며 집중','따뜻한 차와 휴식','가볍게 기지개','어려운 문제 고민','만족스러운 미소','계획 달력 확인','책 더미와 꾸준함','성장 기록을 응원','새로운 발견에 놀람','감동의 눈물','노트북으로 공부','시간을 확인','밤에도 책상 앞','완료한 답안 자랑','궁금해서 생각 중','중요한 날짜 표시','지쳐서 쉬는 중','반짝이는 자신감','담요 속 편안한 휴식','하트를 안고 응원'];
const paths={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2"/>',play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',chart:'<path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',coffee:'<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 0 1 0 6h-2M8 2v3m5-3v3"/>',heart:'<path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1s-1 7 8 15c9-8 11-12 8-15Z"/>'};
Object.assign(paths,{
 lock:'<rect x="6" y="10" width="12" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 send:'<path d="m3 3 18 9-18 9 4-9-4-9Zm4 9h14"/>',
 more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 camera:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="m8 6 2-3h4l2 3"/><circle cx="12" cy="13" r="4"/>',
 flashlight:'<path d="M8 3h8v4l-2 5v9h-4v-9L8 7V3Zm0 4h8m-6 8h4"/>',
 person:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
 back:'<path d="m15 5-7 7 7 7"/>',
 swipe:'<path d="m5 6-3 3 3 3M2 9h20m-3-3 3 3-3 3M8 20l-2-4a2 2 0 0 1 3-2l1 1V9a2 2 0 0 1 4 0v5l4 1v5"/>',
 volume:''
});
function decorate(root=document){
 root.querySelectorAll('[data-sticker]').forEach(el=>{const n=Number(el.dataset.sticker);el.style.backgroundPosition=`${n%5*25}% ${Math.floor(n/5)*25}%`;});
 root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[el.dataset.icon]||''}</svg>`;});
}
const announce=text=>{$('#website-status').textContent=text;};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// The showcase clock is independent from the app's actual examination calendar.
const previewAnchor=performance.now();
function value(){const elapsed=reduced.matches?0:(performance.now()-previewAnchor)/86400000;return Math.max(0,(161-elapsed)/365*100).toFixed(10);}
function paintCounter(){const [whole,fraction]=value().split('.');$$('[data-live-counter]').forEach(el=>{el.querySelector('b').textContent=whole+'.';el.querySelector('span').textContent=fraction;});}
let current='today',tasks=[false,true,true,false],selectedDay=17,timerRunning=false,timerAccumulated=1508000,timerAnchor=0,profilePublic=false;
const mascot=(n,extra='')=>`<span class="mascot" data-sticker="${n}" ${extra||'aria-hidden="true"'}></span>`;
function taskList(){return ['수열 기출 15문제','영단어 30개','독서 지문 3개','화학 오답 정리'].map((t,i)=>`<label class="task-row"><input type="checkbox" data-task="${i}" ${tasks[i]?'checked':''}><span>${t}</span></label>`).join('');}
function profileMarkup(){
 return `<div class="demo-heading"><h3>내 프로필</h3><button type="button" class="icon-button" data-switch="record" aria-label="기록으로 돌아가기"><span data-icon="back" aria-hidden="true"></span></button></div>
 <div class="profile-flipper" aria-label="개인·공개 프로필 카드" role="group">
 <div class="profile-rotor ${profilePublic?'is-public':''}">
 ${[{public:false,title:'개인 프로필',name:'이민준',sticker:0},{public:true,title:'공개 프로필',name:'민준, 끝까지',sticker:24}].map(p=>`<div class="profile-face ${p.public?'profile-back':''}" data-profile-face="${p.public}" aria-hidden="${p.public!==profilePublic}" ${p.public!==profilePublic?'inert':''}><div class="profile-face-label"><span>${p.title}</span><span data-icon="swipe" aria-hidden="true"></span></div><div class="profile-person">${mascot(p.sticker)}<strong>${p.name}</strong></div></div>`).join('')}
 </div></div><div class="profile-stats"><span>목표</span><strong>2027학년도 수능</strong></div>
 <div class="profile-choice" role="group" aria-label="프로필 전환"><button type="button" data-profile-side="personal" aria-pressed="${!profilePublic}">개인</button><button type="button" data-profile-side="public" aria-pressed="${profilePublic}">공개</button></div>`;
}
function renderDemo(name){
 const panel=$('#demo-panel'),scrollTop=current===name?panel.scrollTop:0;
 current=name;
 const navigation=name==='profile'?'record':name;
 $$('[data-tour]').forEach(t=>{const active=t.dataset.tour===navigation;t.classList.toggle('active',active);t.setAttribute('aria-pressed',String(active));});
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
   <strong>6월 ${selectedDay}일</strong><div class="schedule-item"><strong>${selectedDay===17?'학교 진로 활동':'학교 정규 수업'}</strong><small>학교 일정</small></div><div class="schedule-item personal"><strong>오후 7시 · 오답 정리</strong></div><strong>할 일</strong>${taskList()}`,
  focus:()=>`<h3>${timerRunning?'집중 중':timerAccumulated>0?'쉬는 중':'공부 준비'}</h3><div class="timer-art">${mascot(timerRunning?2:6)}</div><p style="text-align:center">수학 · 수열 기출 15문제</p><div class="timer-value" id="timer-value" role="timer" aria-label="공부 타이머" aria-live="off">00:00:00</div><div class="timer-controls"><button type="button" class="button primary" id="timer-toggle">${timerRunning?'잠깐 쉬기':'집중 시작'}</button><button type="button" class="button subtle-button" id="timer-reset">초기화</button></div>`,
  together:()=>`<div class="demo-heading"><h3>함께</h3><span class="meta">내 파티 2</span></div><div class="demo-card"><div class="party-cover">${mascot(4)}<div><strong>오늘도 완주</strong><span class="meta">우리 넷, 수능까지 함께</span></div></div><div class="party-summary"><span>오늘의 목표 5시간</span><span>3명 공부 중</span></div></div>${[
   [22,'박지민','수학 · 수열 기출','공부 중','3시간 42분','오늘 1위',false],
   [5,'김서연','영어 · 모의고사 오답','공부 중','3시간 18분','목표까지 1시간 42분',false],
   [6,'최도윤','10분 쉬고 다시 시작','휴식 중','2시간 56분','7시 50분에 돌아올게',true],
   [0,'이민준 · 나','수학 · 수열 기출','공부 중','3시간 24분','목표까지 1시간 36분',false]
  ].map(m=>`<div class="member-row"><span class="member-avatar" aria-hidden="true">${mascot(m[0])}</span><div class="member-info"><strong>${m[1]}</strong><small class="${m[6]?'rest':''}"><i></i>${m[2]}</small></div><div class="member-time"><strong>${m[4]}</strong><span>${m[3]}</span></div></div>`).join('')}<div class="party-goal"><strong>우리의 오늘</strong><p><span>13시간 20분</span><span>목표 20시간</span></p><div class="party-goal-bar"><span></span></div></div><button type="button" class="button primary" id="open-stickers">친구에게 응원 보내기</button>`,
  record:()=>`<div class="demo-heading"><h3>나의 기록</h3><button type="button" id="show-profile" class="icon-button" data-switch="profile" aria-label="내 프로필"><span data-icon="person" aria-hidden="true"></span></button></div><div class="demo-card"><span class="meta">이번 주 공부</span><strong class="record-total">18시간 24분</strong></div><div class="record-streak">${mascot(1)}<strong>12일째 꾸준히 공부하고 있어요</strong></div><div class="record-chart" role="img" aria-label="주간 공부 시간: 월 2시간, 화 3시간, 수 2시간 30분, 목 4시간, 금 3시간 30분, 토 3시간 24분, 일 0시간">${[50,75,62.5,100,87.5,85,0].map((h,i)=>`<div class="record-bar" style="height:${Math.max(3,h)}%"><span>${'월화수목금토일'[i]}</span></div>`).join('')}</div><table class="demo-table"><caption class="sr-only">과목별 주간 공부 시간</caption><tbody><tr><td>수학</td><td>8시간 24분</td></tr><tr><td>국어</td><td>6시간</td></tr><tr><td>영어</td><td>4시간</td></tr></tbody></table>`
 };
 panel.innerHTML=views[name]();decorate(panel);paintCounter();paintTimer();panel.scrollTop=scrollTop;
 document.dispatchEvent(new CustomEvent('wanju:view',{detail:{name}}));
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
  if(b.dataset.switch==='focus'&&!timerRunning){timerRunning=true;timerAnchor=performance.now();}
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
 if(b.id==='open-stickers')document.dispatchEvent(new CustomEvent('wanju:chat'));
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
// Local conversation choreography; no account, AI call, or remote message is sent.
const replyBook=[
 ['좋아, 이 기세로 한 문제만 더!','응원 받았으니 나도 다시 간다 ㅎㅎ','우리 오늘 계획까지만 깔끔하게 끝내자.'],
 ['오 불붙었다ㅋㅋ 나도 폰 내려놓고 간다.','그 열정 조금만 나눠줘. 난 아직 첫 문제야.','좋아, 지금 집중해서 쉬는 시간 벌자.'],
 ['오 공부 모드네. 나도 옆에서 영어 좀 할게.','다음 페이지까지 하고 같이 쉬자.','집중하는 거 보고 나도 책 폈다.'],
 ['책상에 볼 붙었네ㅋㅋ 잠깐 쉬고 와.','졸릴 땐 한 번 일어나서 물 마시자.','10분만 눈 쉬고 다시 만나자.'],
 ['오늘 할 거 다 끝냈어? 깃발 꽂을 만하네!','정상 먼저 갔네ㅋㅋ 나도 곧 따라갈게.','오늘도 하나 넘겼다. 이 맛에 체크하지.'],
 ['집중 잘 되는 노래 찾았어? 이따 추천해줘.','그럼 나는 조용히 국어 한 지문만 더.','헤드폰 꼈으면 말 안 걸게. 끝나고 보자!'],
 ['차 식기 전에 마셔ㅋㅋ 쉬는 것도 계획이야.','나도 물 떠올게. 잠깐만 쉬자.','좋아, 이 한 잔 마시고 다시 한 세트.'],
 ['기지개 보고 나도 일어났다ㅋㅋ','허리 펴고 기지개 한 번. 오래 앉아 있었네.','딱 스트레칭 필요했는데. 같이 하고 다시 가자.'],
 ['막힌 문제야? 번호 남겨줘. 나도 한번 볼게.','일단 표시해 두자. 한 문제에 오늘 다 쓰진 말고.','나도 방금 막혔어ㅋㅋ 풀이 같이 비교해보자.'],
 ['표정 보니까 오늘 공부 잘됐나 보다.','그 뿌듯함 알지. 나도 마무리하고 싶다.','좋네ㅎㅎ 오늘 잘한 거 하나는 꼭 기억해두자.'],
 ['체크 늘어난 거 봐. 오늘 꽤 했는데?','계획 다 끝내면 알려줘. 같이 박수 쳐줄게.','나도 하나 지웠다. 남은 거 차근차근 가자.'],
 ['책 탑이 제법인데? 한 권씩만 가보자.','오늘도 쌓는 중이네. 나도 내 몫 하고 갈게.','그중 제일 얇은 거부터 끝내고 오자ㅋㅋ'],
 ['어제보다 쌓인 게 보이니까 괜히 힘난다.','그래프 올라가는 거 보고 나도 의욕 생김.','하루하루는 비슷했는데 모아보니 꽤 했네.'],
 ['뭐야, 드디어 풀렸어? 그 표정인데ㅋㅋ','오 뭐 발견했어? 나도 궁금하다.','답지 보기 전에 알아낸 거면 진짜 뿌듯하겠다.'],
 ['울 정도로 감동했냐고ㅋㅋ 오늘 수고했어.','왜 그래, 무슨 일 있어? 얘기해도 돼.','이거 기쁜 눈물이지? 같이 좋아해도 되는 거지?'],
 ['인강 듣는 중? 나도 한 강만 더 들으려고.','창 여러 개 켜지 말고 하나씩ㅋㅋ 같이 집중하자.','정리 끝나면 쉬러 와. 난 여기서 문제 풀고 있을게.'],
 ['벌써 그만큼 했어? 시간 진짜 빨리 가네.','한 세트 끝났나 보다. 물 한 잔 하고 오자.','나도 타이머 켰다. 다음 쉬는 시간에 보자.'],
 ['아직 있네. 오늘은 어디까지 하고 잘 거야?','나도 마지막 정리 중. 끝나면 푹 쉬자.','밤 늦었다. 내일 볼 몫도 조금 남겨두자.'],
 ['끝냈구나! 마지막 체크까지 깔끔하다.','이건 자랑할 만하지ㅋㅋ 오늘 수고했어.','채점까지 끝내면 진짜 퇴근 인정.'],
 ['그 표정은 질문 있다는 건데ㅋㅋ 뭔데?','고민 중이면 말해봐. 같이 생각해보자.','뭐부터 할지 고민돼? 제일 작은 거 하나부터 가자.'],
 ['중요한 날 표시했네. 우리 그때까지 차근차근.','일정 까먹을 뻔했다. 나도 달력 볼게.','표시해 두면 마음이 좀 놓이지. 오늘 몫부터 하자.'],
 ['오늘 많이 지쳤나 보다. 잠깐 내려놓고 쉬자.','그럴 날도 있지. 물 마시고 숨 좀 돌려.','여기까지 온 것도 수고했어. 오늘은 네 속도로.'],
 ['오 자신감 돌아왔다ㅋㅋ 그 기세 좋다.','표정 든든한데? 나까지 힘난다.','오늘 감 잡았네. 이 느낌 하나만 기억해두자.'],
 ['담요까지 챙겼네ㅋㅋ 쉬고 와, 난 조금만 더.','제일 편해 보인다. 충전하고 돌아와.','쉬는 시간 제대로 보내는 중이네. 따뜻하게 있어.'],
 ['하트 잘 받았다ㅎㅎ 나도 응원하고 있어.','갑자기 힘나네. 우리 오늘도 끝까지 같이 가자.','고맙다. 나도 마음으로 하트 하나 보냈어.']
];
const chatFriends=[{name:'박지민',sticker:22},{name:'김서연',sticker:5},{name:'최도윤',sticker:6}];
const replyUses=Array(25).fill(0),replyQueue=[];
let replying=false;
const chatLog=$('#conversation-log'),sendSticker=$('#send-sticker');
function appendChat(node,force=false){
 const follow=force||chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<55;
 node.dataset.dynamic='true';chatLog.append(node);
 const old=chatLog.querySelectorAll(':scope > [data-dynamic]');if(old.length>30)old[0].remove();
 decorate(node);if(follow)chatLog.scrollTop=chatLog.scrollHeight;
}
function replyElement(friend){
 const node=document.createElement('div');node.className='friend-message';
 const avatar=document.createElement('span');avatar.className='mascot chat-avatar';avatar.dataset.sticker=String(friend.sticker);avatar.setAttribute('aria-hidden','true');
 const content=document.createElement('div'),name=document.createElement('span');name.className='chat-name';name.textContent=friend.name;content.append(name);node.append(avatar,content);return {node,content};
}
function runReplyQueue(){
 if(replying||!replyQueue.length)return;
 replying=true;const reply=replyQueue.shift();sendSticker.disabled=replyQueue.length>=8;
 setTimeout(()=>{
  const {node,content}=replyElement(reply.friend);node.dataset.replyFor=String(reply.sticker);node.dataset.replyVariant=String(reply.variant);node.classList.add('is-typing');node.setAttribute('aria-hidden','true');
  const bubble=document.createElement('div');bubble.className='chat-bubble typing-dots';bubble.innerHTML='<i></i><i></i><i></i>';content.append(bubble);appendChat(node);
  setTimeout(()=>{
   const follow=chatLog.scrollHeight-chatLog.scrollTop-chatLog.clientHeight<55;
   node.classList.remove('is-typing');node.removeAttribute('aria-hidden');
   const text=document.createElement('p');text.className='chat-bubble';text.textContent=reply.text;bubble.replaceWith(text);
   const time=document.createElement('time');time.textContent='방금';content.append(time);
   if(follow)chatLog.scrollTop=chatLog.scrollHeight;
   if(!$('.phone-chat-view').hidden)announce(`${reply.friend.name}: ${reply.text}`);
   replying=false;runReplyQueue();
  },850+Math.min(reply.text.length*8,300));
 },320);
}
sendSticker.addEventListener('click',()=>{
 if(replyQueue.length>=8)return;
 const sticker=selectedSticker,use=replyUses[sticker]++,friend=chatFriends[(sticker+use)%chatFriends.length];
 const el=document.createElement('div');el.className='standalone-sticker own';el.innerHTML=mascot(sticker,`role="img" aria-label="${names[sticker]}"`)+'<span>방금</span>';
 appendChat(el,true);announce(`${names[sticker]} 스티커를 보냈어요.`);
 replyQueue.push({friend,text:replyBook[sticker][use%3],sticker,variant:use%3});sendSticker.disabled=replyQueue.length>=8;runReplyQueue();
});
const menu=$('#menu-toggle'),nav=$('#site-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
matchMedia('(min-width:901px)').addEventListener('change',closeMenu);
$$('[data-tour]').forEach(button=>button.addEventListener('click',()=>{renderDemo(button.dataset.tour);}));
$$('[data-start-focus]').forEach(link=>link.addEventListener('click',()=>{if(!timerRunning){timerRunning=true;timerAnchor=performance.now();}renderDemo('focus');}));
$$('[data-platform]').forEach(button=>button.addEventListener('click',()=>{$('#release-status').textContent=`${button.dataset.platform} 정식 출시를 준비하고 있어요.`;}));
$('#copyright-year').textContent=new Date().getFullYear();decorate();renderDemo('together');paintCounter();
const sceneElements=$$('.scene');
// Native touch/keyboard scrolling remains available. Only short desktop wheel gestures
// outside the app's own scroll surface advance a viewport-sized scene.
let wheelTotal=0,wheelAt=0,wheelLockedUntil=0;
document.addEventListener('wheel',event=>{
 if(reduced.matches||innerWidth<=900||event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest('.device,.site-header,input,textarea,select'))return;
 const now=performance.now();
 const index=sceneElements.reduce((best,scene,i)=>Math.abs(scene.getBoundingClientRect().top)<Math.abs(sceneElements[best].getBoundingClientRect().top)?i:best,0);
 const scene=sceneElements[index],rect=scene.getBoundingClientRect();
 if(rect.height>innerHeight+4||Math.abs(rect.top)>innerHeight*.15)return;
 const direction=Math.sign(event.deltaY),next=index+direction;
 if(next<0||next>=sceneElements.length)return;
 if(now<wheelLockedUntil){event.preventDefault();return;}
 if(now-wheelAt>180||Math.sign(wheelTotal)!==direction)wheelTotal=0;
 wheelAt=now;wheelTotal+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
 event.preventDefault();
 if(Math.abs(wheelTotal)>=65){wheelTotal=0;wheelLockedUntil=now+750;sceneElements[next].scrollIntoView({behavior:'smooth',block:'start'});}
},{passive:false});
setInterval(()=>{if(document.hidden)return;if(!reduced.matches)paintCounter();paintTimer();const lock=$('#lock-timer');const seconds=1508+Math.floor((performance.now()-previewAnchor)/1000);lock.textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');},50);
