'use strict';
// A single persistent phone; only its content and surrounding story change.
(()=>{
 const phone=document.querySelector('.persistent-phone');
 const app=phone.querySelector('.phone-app-view'),lock=phone.querySelector('.phone-lock-view'),chat=phone.querySelector('.phone-chat-view');
 const scenes=[...document.querySelectorAll('.scene')];
 const defaults=new Map(scenes.map(scene=>[scene.id,{title:scene.querySelector('h1,h2').innerHTML,description:scene.querySelector('.scene-copy>p').innerHTML}]));
 const story=document.createElement('div');story.className='live-story scene-copy';story.setAttribute('aria-label','선택한 완주 기능');
 story.innerHTML='<span class="eyebrow">너의 속도로, 끝까지.</span><h1></h1><p></p><div class="story-store" hidden></div>';
 document.querySelector('main').prepend(story);
 const store=story.querySelector('.story-store');store.append(document.querySelector('.store-badges'),document.querySelector('#release-status'));
 for(const scene of scenes){scene.querySelector('.scene-copy').hidden=true;scene.querySelector('.scene-copy').inert=true;scene.setAttribute('aria-label',scene.querySelector('h1,h2').textContent);scene.removeAttribute('aria-labelledby');}
 const topics={
  today:{title:'남은 시간을 만나고.<br>오늘의 한 걸음부터.',description:'수능까지의 여정과 오늘 할 일.<br>지금 필요한 것부터 가볍게.',bg:'#fbf8ef',glow:'#f0ddb0'},
  plan:{title:'머릿속 계획을,<br>오늘의 한 칸으로.',description:'학교 일정과 나의 할 일을 한눈에.<br>끝낸 공부는 가볍게 체크해요.',bg:'#f1eddf',glow:'#e5d9a9'},
  focus:{title:'지금은, 이 한 문제.<br>너의 집중에 맞춰.',description:'오늘의 계획에서 바로 시작하는 공부.<br>쉬어갈 때도, 다시 시작할 때도.',bg:'#f5e9dd',glow:'#eac8a8'},
  together:{title:'서로의 속도로,<br>같은 곳을 향해.',description:'친구가 쌓은 시간과 지금의 공부.<br>함께하는 하루는 조금 더 든든하니까.',bg:'#eeeede',glow:'#d8dfae'},
  record:{title:'쌓인 시간만큼,<br>선명해지는 나의 하루.',description:'이번 주의 공부와 과목별 기록.<br>어제보다 한 걸음 나아간 나를 만나요.',bg:'#efe8e1',glow:'#dfc8bd'},
  profile:{title:'나만의 모습과,<br>함께하는 나의 이름.',description:'개인 프로필과 친구에게 보여줄 프로필.<br>카드를 넘겨 자연스럽게 바꿔요.',bg:'#f7eade',glow:'#efd1b0'},
  lock:{title:'지금 잘하고 있어.<br>한눈에 보이는 몰입.',description:'화면을 꺼도 이어지는 집중.<br>공부 카드를 눌러 다시 시작해보세요.',bg:'#f4eae5',glow:'#dbbbc0'},
  chat:{title:'말 대신,<br>응원 한 조각.',description:'친구에게 보내는 완주의 표정.<br>아래에서 마음에 드는 응원을 골라보세요.',bg:'#f6eedc',glow:'#ecd59c'}
 };
 let active=scenes[0],syncing=false,choice='plan';
 function caption(topic,restore=false){
  const content=topics[topic]||topics.today,original=defaults.get(active.id);
  story.querySelector('h1').innerHTML=restore?original.title:content.title;
  story.querySelector('p').innerHTML=restore?original.description:content.description;
  store.hidden=active.id!=='availability';story.classList.toggle('is-download',!store.hidden);
  document.body.style.setProperty('--scene-bg',content.bg);document.body.style.setProperty('--scene-glow',content.glow);
  document.body.dataset.topic=topic;
 }
 function mode(name){
  for(const [view,visible] of [[app,name==='app'],[lock,name==='lock'],[chat,name==='chat']]){view.hidden=!visible;view.inert=!visible;}
  phone.classList.toggle('lock-device',name==='lock');phone.classList.toggle('chat-device',name==='chat');phone.dataset.mode=name;
 }
 function select(name,restore=false){
  if(name==='lock'||name==='chat'){mode(name);caption(name,restore);return;}
  mode('app');syncing=true;renderDemo(name);syncing=false;caption(name,restore);
 }
 document.addEventListener('wanju:view',event=>{if(syncing)return;choice=event.detail.name;mode('app');caption(choice);});
 document.addEventListener('wanju:chat',()=>{select('chat');phone.querySelector('.chat-back').focus({preventScroll:true});});
 phone.querySelector('[data-chat-back]').addEventListener('click',()=>{select('together');phone.querySelector('[data-demo=together]').focus({preventScroll:true});});
 phone.querySelector('[data-open-focus]').addEventListener('click',()=>{select('focus');phone.querySelector('#timer-toggle').focus({preventScroll:true});});
 phone.querySelector('#demo-panel').addEventListener('click',event=>{if(event.target.closest('[data-live-counter]'))caption('today');});
 function chooseScene(){
  const next=scenes.reduce((best,scene)=>Math.abs(scene.getBoundingClientRect().top)<Math.abs(best.getBoundingClientRect().top)?scene:best,scenes[0]);
  if(next===active)return;
  active=next;
  const name={intro:'today',experience:choice,lockscreen:'lock',together:'chat',availability:'today'}[active.id];select(name,active.id!=='experience');
  document.querySelectorAll('.scene-dots a').forEach(link=>{if(link.hash==='#'+active.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
 }
 let queued=false;
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;chooseScene();});}},{passive:true});
 select('today',true);chooseScene();
})();
