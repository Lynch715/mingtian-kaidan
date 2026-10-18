import {PRODUCTS,PEOPLE,CLIENT_SEEDS,LEADS,DAYS,SIDE_EVENTS,REFUSALS} from './data.js';
export const VERSION=1;
export const TARGET=10000;
export const ACTIONS={
 call:{name:'打几通电话',ap:1,energy:9,cash:0,desc:'联系陌生线索。有人愿意聊，也有人不需要。'},
 community:{name:'去社区走走',ap:2,energy:13,cash:12,desc:'参加活动、认认人。来过几次，才会慢慢熟悉。'},
 study:{name:'把产品学明白',ap:1,energy:5,cash:0,desc:'专业 +6；一天认真学两次就够了。'},
 rest:{name:'坐下来歇一会',ap:1,energy:0,cash:0,desc:'精力 +22，心情 +8。给自己留一点喘气的时间。'},
 home:{name:'回家吃顿饭',ap:2,energy:0,cash:10,desc:'精力 +28，心情 +15，也照顾一下身边的人。'},
 follow:{name:'聊聊近况',ap:1,energy:6,cash:0,desc:'了解一条需求，积累信任。同一个人一天联系一次就好。'},
 visit:{name:'约一次面谈',ap:2,energy:12,cash:16,desc:'深入了解需求、预算与顾虑，信任提升更多。'},
 offer:{name:'聊具体方案',ap:2,energy:12,cash:10,desc:'先看需求与预算，再决定是否推进。'},
 service:{name:'认真做次回访',ap:1,energy:7,cash:0,desc:'解释承诺、处理售后。必要时协助撤回不合适的投保。'},
 bond:{name:'不聊业务，聊近况',ap:1,energy:3,cash:0,desc:'修复亲友关系。今天就别再向对方推销了。'}
};
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
export const copy=s=>structuredClone(s);
export function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function makeClient(c,day=1){return {...c,trust:c.trust??25,known:0,stage:'new',met:0,lastContact:0,offerDay:0,unlocked:day,notes:[],served:0};}
export function newGame(origin='career',seed=Date.now()>>>0){
 if(!['career','graduate'].includes(origin))throw Error('请选择一种开局身份。');
 return {version:VERSION,origin,seed:seed>>>0,day:1,phase:'day',ap:6,cash:origin==='career'?4200:2800,energy:88,mood:74,skill:origin==='career'?18:12,integrity:85,regard:35,community:0,work:0,calls:0,visits:0,earned:0,spent:0,premium:0,selfPremium:0,renewal:0,daily:{},bonds:Object.fromEntries(Object.keys(PEOPLE).map(k=>[k,['aunt','friend'].includes(k)?70:45])),clients:CLIENT_SEEDS.map(c=>makeClient(c)),policies:[],ledger:[],journal:[],messages:[{day:1,person:'lin',text:'我坐你旁边。茶水间在走廊尽头，那个白色开关别碰，按了会漏水。'}],seen:[],flags:[],pending:'d1',lastResult:null,night:null,ending:null};
}
export function eventById(id){return [...DAYS,...SIDE_EVENTS].find(x=>x.id===id);}
export function storyFor(s){
 const original=eventById(s.pending);if(!original)return null;const e=copy(original);
 const has=id=>s.policies.some(p=>p.client===id&&p.status!=='cancelled');
 if(e.id==='d4'&&has('friend')){e.body='许嘉发来一张面馆的照片，说老板又涨了一块钱。聊了几句，他提起甲方还没结款。\n他已经向你买过一份保障，你想着要不要再介绍主管最近推的长期储蓄方案。';}
 if(e.id==='d9'&&has('aunt')){e.body='陈姨让你去拿汤，顺手把桌上的存折收进抽屉。她已经向你买过一份保险，今天却没提工作的事。\n你坐在她家熟悉的旧沙发上，发现她又把家里的开支记在旧台历背面。';e.choices[1]={label:'问她上次那份缴费会不会吃力',effect:{bond:{aunt:5},reveal:'aunt',integrity:2},text:'她说暂时还能安排，但不想再添支出了。你让她有困难就直说，别为了照顾你硬撑。'};}
 if(e.id==='d11'&&has('chen'))e.body='陈静把已经投保的那份资料又看了一遍，在旧日历背面写下七个问题。你讲到第三条，才发现自己也没完全弄明白。\n她没有催，只是把笔放下，等你往下说。';
 if(e.id==='d20'&&s.premium>=5000)e.body='新一批咨询线索分下来了，你也拿到了一份。旁边有位同事却没有分到，主管解释，要先给最近能稳定成交的人。\n你把名单收好，也记得上个月有人对新人说过资源人人都有。';
 if(e.id==='d22'&&has('chen')){e.body='陈静发来消息，说家里有一笔临时支出。已经买好的保障会留着，但最近不想再增加任何安排。\n她特意跟你说一声，怕你月底还在等她介绍新的客户。';e.choices[1].label='还是请她帮忙介绍一个朋友';e.choices[1].text='她说最近实在顾不上。你看着这条回复，知道今天不该再追问了。';}
 if(e.id==='d26'&&has('chen'))e.body='陈静发来已经投保的那份资料，上面有不少手写标记。她把没看明白的地方重新标了一遍，终于分清哪些属于保障范围。\n最下方有一行小字：“这条已经问过，解释清楚。”';
 return e;
}

export function log(s,title,text,type='life'){s.journal.unshift({day:s.day,title,text,type});s.journal=s.journal.slice(0,300);}
function money(s,amount,label){s.cash+=amount;if(amount>0)s.earned+=amount;else s.spent-=amount;s.ledger.unshift({day:s.day,amount,label});}
function message(s,person,text){s.messages.unshift({day:s.day,person,text});s.messages=s.messages.slice(0,90);}
function changeBond(s,id,amount){s.bonds[id]=clamp((s.bonds[id]??45)+amount);const p=s.clients.find(c=>c.id===id);if(p)p.trust=clamp(p.trust+amount);}
export function applyEffect(s,effect){
 for(const k of ['energy','mood','skill','integrity','regard'])if(effect[k])s[k]=clamp(s[k]+effect[k]);
 if(effect.cash)money(s,effect.cash,'生活与人情支出');
 if(effect.community)s.community+=effect.community;
 for(const [k,v]of Object.entries(effect.bond??{}))changeBond(s,k,v);
 if(effect.bondExtra)changeBond(s,effect.bondExtra,2);
 if(effect.flags)for(const f of effect.flags)if(!s.flags.includes(f))s.flags.push(f);
 if(effect.reveal){const p=s.clients.find(c=>c.id===effect.reveal);if(p)p.known=Math.min(3,p.known+1);}
}
function snapshot(s){return Object.fromEntries(['cash','energy','mood','skill','integrity','regard','premium'].map(k=>[k,s[k]]));}
function outcome(s,before,title,text){const changes=Object.keys(before).filter(k=>s[k]!==before[k]).map(key=>({key,delta:s[key]-before[key]}));s.lastResult={title,text,changes};log(s,title,text);return s.lastResult;}
export function chooseEvent(s,index){
 const ev=storyFor(s);if(!ev||s.seen.includes(ev.id)||!Number.isInteger(index)||!ev.choices[index])throw Error('这件事已经处理过了。');
 const choice=ev.choices[index],before=snapshot(s);applyEffect(s,choice.effect);
 if(ev.id==='d27'&&index===0)money(s,12,'同事退回寄费');
 s.seen.push(ev.id);s.pending=null;
 let text=choice.text;
 if(ev.id==='d10'&&s.premium===0)text+=' 你还没有开单，主管让你下午先找何师傅复盘一次。';
 if(ev.id==='d20'&&s.regard>=55){const lead=unlockLead(s,'外呼');if(lead)text+=` 主管还给你留了${lead.name}的咨询线索，已经记进客户本。`;}
 if(ev.id==='d20')text+=s.premium>=5000?' 你的业绩已经有起色，这批线索里仍给你留了一个位置。':' 你知道，眼下更得靠自己慢慢找。';
 if(ev.id==='d18'&&s.policies.some(p=>p.client==='aunt'&&p.status!=='cancelled'))text+=' 陈姨已经买过的那份保单，也需要你认真回访。';
 if(ev.id==='d10'&&s.flags.includes('overpromise'))message(s,'zhou','你报的预计金额我记下了，后面有变动及时告诉我。');
 outcome(s,before,ev.title,text);message(s,ev.person,choice.text);return s.lastResult;
}
function canAct(s){if(s.phase!=='day'||s.pending||s.lastResult)throw Error('先处理完眼前的事。');}
export function actionReason(s,type,id){
 const a=ACTIONS[type];if(!a)return '没有这项安排';
 if(s.phase!=='day'||s.pending||s.lastResult)return '先处理完眼前的事';
 if(s.ap<a.ap)return '今天剩余时间不够';if(s.energy<a.energy)return '先歇一会儿，精力不足';if(a.cash>0&&a.cash>s.cash)return '手头现金不够';
 if(type==='study'&&(s.daily.study??0)>=2)return '今天学得够多了，明天再来';
 if(['follow','visit','offer','service','bond'].includes(type)){
 const p=s.clients.find(c=>c.id===id);if(!p)return '先选择一位联系人';
 if(p.lastContact===s.day)return '今天已联系过，给对方一点时间';
 if(type==='offer'&&(p.stage==='sold'||p.stage==='closed'))return '这次需求已经处理过了';
 if(type==='offer'&&p.known<1)return '先聊聊需求，再谈具体方案';
 if(['follow','visit'].includes(type)&&['sold','closed'].includes(p.stage))return '已有成交记录，请安排回访或聊近况';
 if(type==='service'&&!s.policies.some(x=>x.client===id&&x.status!=='cancelled'))return '目前没有需要回访的保单';
 }
 return '';
}
function spend(s,type){const a=ACTIONS[type];s.ap-=a.ap;s.energy=clamp(s.energy-a.energy);if(a.cash)money(s,-a.cash,a.name);s.daily[type]=(s.daily[type]??0)+1;if(!['rest','home','bond'].includes(type))s.work++;}
function unlockLead(s,source){const def=LEADS.find(c=>!s.clients.some(x=>x.id===c.id));if(!def)return null;const p=makeClient({...def,source,trust:source==='转介绍'?43:source==='社区'?32:24},s.day);s.clients.push(p);message(s,p.id,p.opening);return p;}
function sideEvent(s){if(s.day%2===0&&s.work>0&&!s.pending){const ev=SIDE_EVENTS.find(x=>!s.seen.includes(x.id));if(ev&&!s.daily.side){s.pending=ev.id;s.daily.side=1;}}}
export function action(s,type,id,options={}){
 const reason=actionReason(s,type,id);if(reason)throw Error(reason);
 let product;if(type==='offer'){product=PRODUCTS.find(x=>x.id===options.product);if(!product)throw Error('先选择一种方案。');if(!['honest','pressure'].includes(options.approach??'honest'))throw Error('无效的沟通方式。');}
 const before=snapshot(s);spend(s,type);let title=ACTIONS[type].name,text='';
 const p=s.clients.find(c=>c.id===id);
 if(type==='call'){
 s.calls+=12;s.mood=clamp(s.mood-3);
 const found=(s.daily.call??0)===1&&(random(s)<(.38+(s.regard>=65?.07:0)-(s.mood<25?.12:0))||s.calls%48===0);
 const lead=found?unlockLead(s,'外呼'):null;
 text=lead?`十二通电话里，${lead.name}愿意多聊几句。${lead.opening}\n你们交换了联系方式。对方现在还不是客户，只是愿意给你一个解释的机会。`:(REFUSALS[Math.floor(random(s)*REFUSALS.length)]+'\n这一轮拨了十二通，暂时没有新的预约。');
 s.regard=clamp(s.regard+2);
 }else if(type==='community'){
 s.community++;s.mood=clamp(s.mood+2);const lead=s.community%2===0?unlockLead(s,'社区'):null;
 text=lead?`活动快结束时，${lead.name}过来问了几句。${lead.opening}\n你记下方便联系的时间，没有让对方当场做决定。`:'你帮忙摆好椅子，也和几位居民聊了聊。有人记住了你的名字，但还没有谈到购买。多来几次，才会慢慢熟悉。';
 }else if(type==='study'){
 s.skill=clamp(s.skill+6);text=s.skill<35?'你把一段绕口的说明换成自己的话，又拿两个例子试了试。这次遇到同样的问题，应该能讲得清楚一些。':'你重新对照了保障条件和常见误解。有些话听起来差不多，实际意思差得很远。';
 }else if(type==='rest'){
 s.energy=clamp(s.energy+22);s.mood=clamp(s.mood+8);text='你把手机扣在桌上，去接了一杯水。走廊里安静了一会儿，等你坐回来，心里没那么乱了。';
 }else if(type==='home'){
 s.energy=clamp(s.energy+28);s.mood=clamp(s.mood+15);changeBond(s,'aunt',3);changeBond(s,'friend',2);text='你顺路买了点菜，回去做了一顿热饭。吃完把碗洗了，工作群里的消息晚一点再看也没关系。';
 }else if(type==='follow'||type==='visit'){
 p.lastContact=s.day;p.met++;p.stage='talking';const old=p.known;p.known=Math.min(3,p.known+(type==='visit'?2:1));p.trust=clamp(p.trust+(type==='visit'?14:9)+(s.skill>=40?3:0)-(s.mood<25?3:0));s.skill=clamp(s.skill+1);s.visits+=type==='visit'?1:0;
 text=old<3?p.facts.slice(old,p.known).join('\n'):'这次聊了最近的安排，也重新确认了之前没有说清的地方。对方没有催着结束，你也没有急着推方案。';
 text=`你和${p.name}${type==='visit'?'见了面':'聊了一会儿'}。\n${text}`;if(s.mood<25)text+='\n你今天有些心不在焉，说话没有平时顺。先休息一下，会更容易听进对方的话。';p.notes.unshift({day:s.day,text});
 }else if(type==='bond'){
 p.lastContact=s.day;p.trust=clamp(p.trust+8);if(s.bonds[p.id]!==undefined)changeBond(s,p.id,5);s.mood=clamp(s.mood+6);
 text=p.family?`你和${p.name}聊了最近的生活，没有把话题绕回产品。聊到后来，终于又像以前那样自然了。`:`你问了问${p.name}最近忙不忙，也听对方说了一些生活里的小事。今天没有谈购买。`;
 }else if(type==='offer'){
 p.lastContact=s.day;p.offerDay=s.day;
 const fit=product.id===p.need&&product.premium<=p.budget;
 const ready=s.day>=p.unlocked+p.ready;
 const good=p.known===3&&p.trust>=52&&s.skill>=product.skill&&ready;
 const pressure=options.approach==='pressure';
 if(!pressure&&!fit){s.integrity=clamp(s.integrity+2);text=`你把「${product.name}」的条件和费用讲清楚后，发现它与${p.name}的需求或预算不合适。这次没有推进。\n先了解完整情况，再换一个合适的方案，会比硬劝更有用。`;p.trust=clamp(p.trust+3);}
 else if(!pressure&&!good){
 const why=p.known<3?'你们还没有把需求、预算和顾虑全部聊清楚。':s.skill<product.skill?'对方问到了几处关键条件，你还需要回去核对。':!ready?'对方还需要一些时间比较和安排支出。':'对方还想多了解一些，不准备马上决定。';
 text=`${p.name}没有马上答应。${why}\n“我再想想，你先别替我填表。”你把资料留下，约定以后再联系。`;p.trust=clamp(p.trust+4);
 }else if(pressure&&(p.trust<40||!ready)){
 p.trust=clamp(p.trust-9);s.integrity=clamp(s.integrity-5);s.mood=clamp(s.mood-4);text=`你提起月底任务，${p.name}沉默了一会儿，说还是先不考虑了。气氛比刚才生疏了些。`;
 }else{
 const risky=!fit||pressure;const commission=Math.round(product.premium*product.rate);
 const policy={id:`p${s.policies.length+1}`,client:p.id,product:product.id,premium:product.premium,commission,day:s.day,due:s.day+3,paid:false,status:'active',risk:risky,serviceDue:s.day+5,serviced:false,source:p.source,self:false};
 s.policies.push(policy);s.premium+=product.premium;p.stage='sold';s.regard=clamp(s.regard+8);s.mood=clamp(s.mood+10);
 if(pressure){s.integrity=clamp(s.integrity-9);p.trust=clamp(p.trust-12);if(p.family)changeBond(s,p.id,-12);}
 text=`${p.name}决定选择「${product.name}」。本次计入保费 ¥${product.premium.toLocaleString()}，预计佣金 ¥${commission}，三天后确认到账。\n`+(risky?'对方答应里有人情或犹豫的成分。这份保单需要尽快回访；不适合的安排，后来可能还是得撤回。':'你把关键条件重新讲了一遍，也留下后续联系的方式。签完字，对方终于把那份资料收进包里。');
 message(s,'zhou',`收到${p.name}这单了。记得把资料交齐，后续也跟好。`);
 }
 }else if(type==='service'){
 p.lastContact=s.day;const policy=s.policies.find(x=>x.client===id&&x.status!=='cancelled');policy.serviced=true;p.served++;p.trust=clamp(p.trust+12);s.integrity=clamp(s.integrity+4);
 const prod=PRODUCTS.find(x=>x.id===policy.product);const fit=prod.id===p.need&&prod.premium<=p.budget;
 if(policy.risk&&!fit){cancelPolicy(s,policy);p.stage='closed';text=`你和${p.name}重新核对后，确认这份安排不合适，协助办理了撤回。业绩减去 ¥${policy.premium}，佣金也同步撤回。\n对方仍有些失望，但感谢你把事情处理清楚。`;if(p.family)changeBond(s,p.id,6);}
 else{policy.risk=false;policy.status='active';text=`${p.name}把几个问题一次问完，你逐条说明，也提醒了后续需要留意的地方。\n“知道了，有事我再找你。”这通电话结束得很平静。`;if(p.served===1){const lead=unlockLead(s,'转介绍');if(lead)text+=`\n过了一会儿，对方征得朋友同意，把${lead.name}的联系方式发来，让你找个方便的时间聊聊。`;}}
 }
 sideEvent(s);return outcome(s,before,title,text);
}
function cancelPolicy(s,policy){if(policy.status==='cancelled')return;policy.status='cancelled';s.premium-=policy.premium;if(policy.paid){money(s,-policy.commission,'撤回佣金');policy.paid=false;}if(policy.self)s.selfPremium-=policy.premium;}
export function buySelf(s,productId){
 canAct(s);const product=PRODUCTS.find(p=>p.id===productId);if(!product)throw Error('没有这项方案。');if(s.policies.some(p=>p.self))throw Error('本月已经自购过，请先顾好后续支出。');if(s.cash<product.premium)throw Error('现金不够支付这笔保费。');if(s.ap<1)throw Error('今天剩余时间不够。');
 const before=snapshot(s);s.ap--;money(s,-product.premium,'自己支付保费');const commission=Math.round(product.premium*product.rate);
 s.policies.push({id:`p${s.policies.length+1}`,client:'self',product:product.id,premium:product.premium,commission,day:s.day,due:s.day+3,paid:false,status:'active',risk:false,serviced:true,self:true,source:'自购',serviceDue:99});
 s.premium+=product.premium;s.selfPremium+=product.premium;if(['illness','saving'].includes(product.id))s.renewal+=product.premium;
 s.regard=clamp(s.regard+6);s.mood=clamp(s.mood-3);return outcome(s,before,'给自己买了一份',`你支付了 ¥${product.premium}，选择「${product.name}」。预计佣金 ¥${commission}，三天后确认。${s.renewal?'这项长期安排还会带来每年 ¥'+s.renewal+' 的后续缴费负担。':'这是一年期安排，明年是否继续，需要重新考虑。'}\n它会计入本月业绩，但今天花掉的钱已经从自己的账户扣除了。`);
}
export function acknowledge(s){s.lastResult=null;}
export function endDay(s){
 canAct(s);const before=snapshot(s);const day=s.day;const entries=[];
 money(s,-45,'日常餐饮与交通');entries.push('餐饮与交通 −¥45');
 if(day===15){const rent=s.origin==='career'?2200:1600;money(s,-rent,'房租及固定开支');entries.push(`房租及固定开支 −¥${rent}`);}
 for(const p of s.policies){
 if(p.status==='cancelled')continue;
 if(!p.paid&&p.due<=day){money(s,p.commission,'佣金到账');p.paid=true;entries.push(`佣金到账 +¥${p.commission}`);}
 if(!p.self&&p.risk&&!p.serviced&&day>=p.day+4&&p.status==='active'){
 p.status='complaint';s.regard=clamp(s.regard-5);s.mood=clamp(s.mood-6);const client=s.clients.find(c=>c.id===p.client);client.trust=clamp(client.trust-15);message(s,p.client,'我回去又看了一遍，跟当时理解的不太一样。你明天方便吗？我想把这事弄清楚。');entries.push(`${client.name}对保单提出疑问，请尽快回访`);
 }
 if(p.status==='complaint'&&day>=p.day+7){const client=s.clients.find(c=>c.id===p.client);cancelPolicy(s,p);client.stage='closed';changeBond(s,p.client,-12);entries.push(`${client.name}撤回保单，业绩与佣金已冲回`);message(s,p.client,'这几天一直没能说清楚，还是撤回吧。后面的手续麻烦帮我办一下。');}
 }
 if(day===30){if(s.work>=20){money(s,600,'新人扶持');entries.push('新人扶持到账 +¥600');}else entries.push('工作记录未满20次，未获得新人扶持');if(s.premium>=TARGET){money(s,800,'月度达标奖励');entries.push('月度达标奖励 +¥800');}}
 let review=s.premium>=TARGET?'主管确认了你的达标记录，提醒你后续服务也要跟上。':s.day>=23?'夕会上又问了一遍差额。你记下剩余的事，准备回家。':s.daily.call?'你把外呼记录交上去。今天愿意接电话的人不多，记录倒是写满了一页。':'你整理好今天的记录，放在桌角。窗外的灯一盏盏亮起来。';
 if(s.cash<0)review+=' 手头的钱已经不够，欠款会记在生活账本里。免费学习、外呼和休息仍可继续，后续收入先用来补上缺口。';
 if(day===14)review+=' 明天要交房租，记得看一眼账本。';
 s.energy=clamp(s.energy+24+(s.ap*3));s.mood=clamp(s.mood+4);s.phase='night';
 s.night={day,entries,review,used:6-s.ap,changes:Object.keys(before).filter(k=>before[k]!==s[k]).map(key=>({key,delta:s[key]-before[key]}))};
 log(s,'一天结束',review+'\n'+entries.join('；'),'night');return s.night;
}
export function nextDay(s){
 if(s.phase!=='night')throw Error('先结束今天。');
 if(s.day===30){s.phase='ended';s.ending=endingFor(s);return;}
 s.day++;s.phase='day';s.ap=6;s.daily={};s.night=null;s.pending=`d${s.day}`;s.lastResult=null;
 if(s.day===16)message(s,'qiao','房租交了以后，别只看预计佣金。没到账的钱先别安排出去。');
 if(s.day===24&&s.flags.includes('overpromise')){message(s,'zhou',s.premium>=5000?'月初报的计划有一些落实了，剩下的按实际情况更新。':'月初那几笔预计还没有落地，把计划改成实际能做到的。');if(s.premium<5000)s.regard=clamp(s.regard-5);}
}
export function endingFor(s){
 const active=s.policies.filter(p=>p.status!=='cancelled'&&!p.self),clean=active.filter(p=>!p.risk),outside=clean.filter(p=>p.source!=='亲友');
 const family=(s.bonds.aunt+s.bonds.friend)/2;let id,title,body;
 if(s.cash<0||s.renewal>Math.max(0,s.cash)*2&&s.renewal>0){id='debt';title='先把自己的日子过好';body='月底的表交上去了，账本却还没有合上。你开始认真算下个月能花的钱，也重新考虑哪些负担可以放下。离开或留下，都要先让自己喘口气。';}
 else if(s.premium>=TARGET&&(s.integrity<55||active.some(p=>p.risk)||family<42)){id='poster';title='喜报上的名字';body='你的名字出现在月末喜报上。照片拍得很好，群里也很热闹。回到家，你打开几条还没回复的消息，知道有些事情并没有随着达标一起结束。';}
 else if(s.premium>=TARGET&&outside.length>=3&&s.integrity>=65){id='steady';title='总算站稳一点';body='你过了考核，也有了几位愿意继续联系的客户。下个月依然不会轻松，但你不必每次缺业绩，都先翻亲友的名字。你把新一页日程展开，心里比入职那天踏实了一点。';}
 else if(clean.length>=3&&s.integrity>=65){id='slow';title='慢一点，也在往前走';body='你还没成为营业部里最显眼的人。有人记住了你的解释，有人愿意介绍朋友来问问，也有人决定暂时不买。这个月的收入谈不上漂亮，好在你已经有了一点可以继续做下去的基础。';}
 else if(family<45){id='contacts';title='通讯录里的安静';body='名单还在，愿意接电话的人却少了。你翻到几个熟悉的名字，没有拨出去。也许下一次联系，可以先好好问一句近况，不必急着谈工作。';}
 else{id='leave';title='一个月以后';body='这个月，你没有达到营业部的目标。你学会了一些东西，也知道了自己不愿意用什么去换一张保单。工牌放在桌上，你还没有决定明天要不要戴上它。今晚先回去，好好吃顿饭。';}
 const epilogues=[s.bonds.lin>=65?'小满发来消息，说那家面馆又有优惠，问你哪天一起去。':'小满还留在营业部。你们偶尔在群里打个招呼。',family>=65?'陈姨问周末来不来吃饭，许嘉也发来一张新开的店的照片。':family<45?'家里人没再问起你的工作。你准备找个周末回去，慢慢把话说开。':'许嘉说，忙完这个月找时间见见，聊点别的。',outside.length>=3?'几位客户把你的联系方式存好了。下个月，你的本子里还有几个约好的时间。':'你把这个月的笔记留了下来。有些没讲好的话，现在知道该怎么讲了。'];
 return {id,title,body,epilogues,clean:clean.length,outside:outside.length,family,receivable:s.policies.filter(p=>!p.paid&&p.status!=='cancelled').reduce((n,p)=>n+p.commission,0)};
}
export function progress(s){return {target:TARGET,policies:s.policies.filter(p=>p.status!=='cancelled').length,receivable:s.policies.filter(p=>!p.paid&&p.status!=='cancelled').reduce((v,p)=>v+p.commission,0),complaints:s.policies.filter(p=>p.status==='complaint').length,service:s.policies.filter(p=>!p.self&&!p.serviced&&p.status!=='cancelled').length};}
export function exportSave(s){return JSON.stringify({game:'明天一定开单',version:VERSION,state:s},null,2);}
export function importSave(raw){
 let data;try{data=JSON.parse(raw);}catch{throw Error('文件不是有效的 JSON 存档。');}
 const s=data?.state;const fail=()=>{throw Error('存档内容不完整或版本不兼容，现有进度没有改变。');};
 if(data?.game!=='明天一定开单'||data.version!==VERSION||!s||s.version!==VERSION)fail();
 const base=newGame();for(const k of Object.keys(base))if(!(k in s))fail();
 if(!['career','graduate'].includes(s.origin)||!['day','night','ended'].includes(s.phase))fail();
 const bounded=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
 for(const k of ['energy','mood','skill','integrity','regard'])if(!bounded(s[k],0,100))fail();
 for(const k of ['cash','earned','spent','premium','selfPremium','renewal'])if(!bounded(s[k],-1e7,1e7))fail();
 for(const k of ['work','calls','visits','community'])if(!Number.isInteger(s[k])||!bounded(s[k],0,10000))fail();
 if(!Number.isInteger(s.day)||!bounded(s.day,1,30)||!Number.isInteger(s.ap)||!bounded(s.ap,0,6)||!Number.isInteger(s.seed)||!bounded(s.seed,0,4294967295))fail();
 if(!s.bonds||typeof s.bonds!=='object'||Object.keys(PEOPLE).some(k=>!bounded(s.bonds[k],0,100)))fail();
 for(const k of ['clients','policies','ledger','journal','messages','seen','flags'])if(!Array.isArray(s[k])||s[k].length>1000)fail();
 if(!s.daily||typeof s.daily!=='object'||Object.values(s.daily).some(v=>!Number.isInteger(v)||!bounded(v,0,50)))fail();
 const text=(v,max=12000)=>typeof v==='string'&&v.length<=max;
 const defs=[...CLIENT_SEEDS,...LEADS];const ids=new Set();
 for(const p of s.clients){if(!p||!defs.some(d=>d.id===p.id)||ids.has(p.id)||!text(p.name,40)||!PRODUCTS.some(x=>x.id===p.need)||!bounded(p.budget,0,100000)||!bounded(p.trust,0,100)||!Number.isInteger(p.known)||!bounded(p.known,0,3)||!['new','talking','sold','closed'].includes(p.stage)||!Array.isArray(p.facts)||p.facts.length!==3||p.facts.some(x=>!text(x))||!Array.isArray(p.notes)||p.notes.some(n=>!n||!text(n.text)||!bounded(n.day,1,30)))fail();for(const k of ['ready','met','lastContact','offerDay','unlocked','served'])if(!bounded(p[k],0,100))fail();if(!['社区','外呼','亲友','转介绍'].includes(p.source))fail();ids.add(p.id);}
 if(!CLIENT_SEEDS.every(c=>ids.has(c.id)))fail();
 const policyIds=new Set();for(const p of s.policies){if(!p)fail();const prod=PRODUCTS.find(x=>x.id===p.product);if(!prod||!text(p.id,20)||policyIds.has(p.id)||(!ids.has(p.client)&&p.client!=='self')||p.premium!==prod.premium||p.commission!==Math.round(prod.premium*prod.rate)||!['active','complaint','cancelled'].includes(p.status))fail();for(const k of ['day','due','serviceDue'])if(!bounded(p[k],1,100))fail();for(const k of ['paid','risk','serviced','self'])if(typeof p[k]!=='boolean')fail();policyIds.add(p.id);}
 const total=s.policies.filter(p=>p.status!=='cancelled').reduce((n,p)=>n+p.premium,0);if(total!==s.premium)fail();
 for(const entry of s.journal)if(!entry||!text(entry.title,100)||!text(entry.text)||!bounded(entry.day,1,30))fail();
 for(const entry of s.messages)if(!entry||!text(entry.person,30)||!text(entry.text)||!bounded(entry.day,1,30))fail();
 for(const entry of s.ledger)if(!entry||!text(entry.label,100)||!bounded(entry.amount,-1e7,1e7)||!bounded(entry.day,1,30))fail();
 if(s.seen.some(x=>!eventById(x))||new Set(s.seen).size!==s.seen.length||s.flags.some(x=>!text(x,60)))fail();
 if(s.pending&&(!eventById(s.pending)||s.seen.includes(s.pending)))fail();
 const changes=v=>Array.isArray(v)&&v.every(x=>x&&['cash','energy','mood','skill','integrity','regard','premium'].includes(x.key)&&bounded(x.delta,-1e7,1e7));
 if(s.lastResult&&(!text(s.lastResult.title,100)||!text(s.lastResult.text)||!changes(s.lastResult.changes)))fail();
 if(s.night&&(!text(s.night.review)||!Array.isArray(s.night.entries)||s.night.entries.some(x=>!text(x))||!changes(s.night.changes)||!bounded(s.night.used,0,6)))fail();
 if(s.phase==='night'&&!s.night||s.phase==='ended'&&s.day!==30)fail();
 if(s.phase==='ended')s.ending=endingFor(s);else s.ending=null;
 return copy(s);
}
