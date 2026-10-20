// 固定行动路线用于比较文案调整前后的规则结果；不依赖叙述文字。
export function mechanicalState(state){
 const s=structuredClone(state);delete s.journal;delete s.messages;
 for(const p of s.clients){delete p.notes;delete p.facts;delete p.opening;}
 if(s.lastResult){delete s.lastResult.title;delete s.lastResult.text;delete s.lastResult.details;delete s.lastResult.milestones;}
 if(s.night)delete s.night.review;
 if(s.ending){delete s.ending.title;delete s.ending.body;delete s.ending.epilogues;}
 return s;
}
export function playRoute(engine,products,origin,choice){
 const s=engine.newGame(origin,23),days=[];
 function settle(){let guard=0;while(s.pending||s.lastResult){if(++guard>15)throw Error('dialog cycle');if(s.lastResult)engine.acknowledge(s);else engine.chooseEvent(s,choice);}}
 while(s.phase!=='ended'){
  settle();let guard=0;
  while(s.ap>0&&++guard<15){
   let type,id,options={};
   const service=s.clients.find(c=>!engine.actionReason(s,'service',c.id)&&s.policies.some(p=>p.client===c.id&&!p.serviced&&p.status!=='cancelled'));
   const ready=s.clients.find(c=>!c.family&&!engine.actionReason(s,'offer',c.id)&&c.known===3&&c.trust>=52&&s.skill>=products.find(p=>p.id===c.need).skill&&s.day>=c.unlocked+c.ready);
   const talk=s.clients.find(c=>!c.family&&!engine.actionReason(s,'visit',c.id)&&c.known<3);
   const follow=s.clients.find(c=>!c.family&&!engine.actionReason(s,'follow',c.id)&&(c.known<3||c.trust<52));
   if(s.energy<25&&!engine.actionReason(s,'rest'))type='rest';
   else if(service){type='service';id=service.id;}
   else if(ready){type='offer';id=ready.id;options={product:ready.need,approach:'honest'};}
   else if(talk){type='visit';id=talk.id;}
   else if(follow){type='follow';id=follow.id;}
   else if(s.skill<45&&!engine.actionReason(s,'study'))type='study';
   else if(s.clients.length<12&&!engine.actionReason(s,'community'))type='community';
   else if(!engine.actionReason(s,'call')&&(s.daily.call??0)<1)type='call';
   else break;
   engine.action(s,type,id,options);settle();
  }
  engine.endDay(s);settle();days.push(mechanicalState(s));engine.nextDay(s);
 }
 return {days,ending:mechanicalState(s)};
}
