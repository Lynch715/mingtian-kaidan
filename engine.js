import {freshExtra,extraEventById,extraStoryFor,nextExtraEvent,resolveExtra} from './content.js?v=month-release-1';
import {PRODUCTS,PEOPLE,CLIENT_SEEDS,LEADS,DAYS,SIDE_EVENTS,REFUSALS,DAY_FOCUS} from './data.js?v=month-release-1';
export const VERSION=1;
export const TARGET=10000;
export const ACTIONS={
 call:{name:'打几通电话',ap:1,energy:9,cash:0,desc:'完成 12 通外呼，寻找愿意继续咨询的人。'},
 community:{name:'去社区走走',ap:2,energy:13,cash:12,desc:'参加社区活动，累积联系并认识客户。'},
 study:{name:'把产品学明白',ap:1,energy:5,cash:0,desc:'专业 +6；每天最多两次。'},
 rest:{name:'坐下来歇一会',ap:1,energy:0,cash:0,desc:'精力 +22，心情 +8，最高恢复到 100。'},
 home:{name:'回家吃顿饭',ap:2,energy:0,cash:10,desc:'精力 +28，心情 +15，也照顾一下身边的人。'},
 follow:{name:'跟进需求',ap:1,energy:6,cash:0,desc:'了解一条需求，积累信任。同一个人一天联系一次就好。'},
 visit:{name:'约一次面谈',ap:2,energy:12,cash:16,desc:'深入了解需求、预算与顾虑，信任提升更多。'},
 offer:{name:'聊具体方案',ap:2,energy:12,cash:10,desc:'先看需求与预算，再决定是否推进。'},
 service:{name:'回访保单',ap:1,energy:7,cash:0,desc:'核对保单问题、完成回访，必要时办理撤回。'},
 bond:{name:'不聊业务，聊近况',ap:1,energy:3,cash:0,desc:'修复亲友关系。今天就别再向对方推销了。'}
};
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
export const copy=s=>structuredClone(s);
export function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function makeClient(c,day=1){return {...c,trust:c.trust??25,known:0,stage:'new',met:0,lastContact:0,offerDay:0,unlocked:day,notes:[],served:0};}
export function newGame(origin='career',seed=Date.now()>>>0){
 if(!['career','graduate'].includes(origin))throw Error('请选择一种开局身份。');
 return {version:VERSION,origin,seed:seed>>>0,day:1,phase:'day',ap:6,cash:origin==='career'?4200:2800,energy:88,mood:74,skill:origin==='career'?18:12,integrity:85,regard:35,community:0,work:0,calls:0,visits:0,earned:0,spent:0,premium:0,selfPremium:0,renewal:0,daily:{},bonds:Object.fromEntries(Object.keys(PEOPLE).map(k=>[k,['aunt','friend'].includes(k)?70:45])),clients:CLIENT_SEEDS.map(c=>makeClient(c)),policies:[],ledger:[],journal:[],messages:[{day:1,person:'lin',text:'我坐你旁边。茶水间在走廊尽头，那个白色开关别碰，按了会漏水。'}],seen:[],flags:[],pending:'d1',lastResult:null,night:null,ending:null,extra:freshExtra()};
}
export function eventById(id){return [...DAYS,...SIDE_EVENTS].find(x=>x.id===id)??extraEventById(id);}
export function storyFor(s){
 const original=eventById(s.pending);if(!original)return null;const e=extraEventById(original.id)?extraStoryFor(s,original):copy(original);
 const has=id=>s.policies.some(p=>p.client===id&&p.status!=='cancelled');
 if(e.id==='d4'&&has('friend')){e.body='许嘉说项目款还要再等一周，问已经买好的保障后面怎么交费。你翻出他的保单，手边还放着一份长期储蓄的介绍。\n“最近能动的钱不多。”他又补了一句，你准备先跟他谈什么？';e.choices[0].text='你先核对他近期的支出，确认现有缴费能否承担。许嘉说这阵子不想加新的长期支出，你把情况补在了他的资料里。';}
 if(e.id==='d9'&&has('aunt')){e.body='陈姨叫你下班拿汤，她刚把给表弟凑首付的账算好。桌上也放着向你买的那份保障资料。\n她问这份之后还要注意什么，你翻开资料，准备先确认她最近的预算够不够。';e.choices[1]={label:'问她这份缴费有没有压力',effect:{bond:{aunt:5},reveal:'aunt',integrity:2},text:'陈姨说眼下能付，但不准备再增加开支。你把预算安排记好，现有这份的疑问可以接着核对。'};}
 if(e.id==='d6'&&has('wu')){e.body='吴师傅说今天配送加单，原来想问的保单问题得晚一点再聊。\n“我收车了给你回，别白跑。”你已经有他的投保记录，可以先把需要核对的事项找出来，等他方便再联系。';e.choices[1].text='你想当天确认，吴师傅还是抽不出空。这个时间没约成，后续回访要先对上他的工作安排。';}
 if(e.id==='d11'&&has('chen'))e.body='陈静翻出一次旧门诊记录，发现有件事自己也记不准。她问现有保单的健康信息能不能再核对，又说不想把病历发到多人群里。\n你还没看到具体记录，先找乔姐确认正式核实和提交的办法，不能只凭印象替她作结论。';
 if(e.id==='d15')e.body=`乔姐提醒你，今天晚上要扣 ¥${s.origin==='career'?2200:1600} 固定开支。周主管接着说，月底扶持和奖励要按条件结算。\n你打开生活账，当前现金 ¥${s.cash}。先把今晚能用的钱算出来，之后再安排工作。`;
 if(e.id==='d19'&&has('wu'))e.body='仓库问吴师傅，以后愿不愿意顺带搬大件。他还没答应，把工作内容发给你，想先核对现有保单的职业范围。\n你翻出投保记录：现在登记的是配送，搬多大的东西、怎么装卸，还需要问具体。他想弄清以后能不能接这项活，再回仓库。';
 if(e.id==='d22'&&has('chen')){e.body='陈静说家里有临时支出，已经买好的保障先保留，最近不准备增加新安排，也顾不上帮人介绍。\n她怕你月底还在等转介绍，特意来说明。你打开她的记录，准备把这次的联系意见记好。';e.choices[1].label='问她现在是否方便介绍一个朋友';e.choices[1].text='她说这阵子确实顾不上，暂时不介绍。你把这条答复记下，之后可以直接维护现有保单。';}
 if(e.id==='d23'&&has('friend')){e.choices[1].label='问问现有保障还有没有疑问';e.choices[1].text='许嘉说有一处条件想再确认，可以另约时间核对。你记下问题，今天先帮他把演示测完。';}
 if(e.id==='d25'&&s.policies.some(p=>p.self)){e.body=`你已经用过本月的自购机会。主管说月底交表时，把自购和客户投保分别核对。\n你打开生活账，当前现金 ¥${s.cash}，自购后续年缴费 ¥${s.renewal}。今天可以检查这些支出，再安排剩下的时间。`;e.choices[1].label='检查已购产品和后续缴费';e.choices[1].text='你把已经支付的保费、佣金和后续缴费对好。自购没有重复安排，相关费用在生活账里都能查到。';}
 if(e.id==='d29'){
  const n=progress(s);e.body=`月底前再核对一次客户本。目前有 ${n.policies} 份有效保单，${n.service} 份未做首次回访，${n.complaints} 份有疑问待处理。\n何师傅让你把已经答应核对的条件、材料和联系记录找出来，今天按实际待办处理。`;
 }
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
function feedbackSnapshot(s){return {work:s.work,calls:s.calls,community:s.community,skill:s.skill,premium:s.premium,bonds:{...s.bonds},clients:Object.fromEntries(s.clients.map(p=>[p.id,{known:p.known,trust:p.trust}])),policies:Object.fromEntries(s.policies.map(p=>[p.id,{status:p.status,risk:p.risk,serviced:p.serviced}]))};}
function feedbackFor(s,before){
 const lines=[];
 if(s.calls>before.calls)lines.push(`完成 ${s.calls-before.calls} 通外呼，累计 ${s.calls} 通。`);
 if(s.community>before.community)lines.push(`社区联系累计 ${s.community} 次。`);
 for(const p of s.clients){const old=before.clients[p.id];
  if(!old){lines.push(`客户本新增 ${p.name}，来源：${p.source}。`);continue;}
  if(p.known>old.known)lines.push(`${p.name}：新增了解${['需求','预算','顾虑'].slice(old.known,p.known).join('、')}，资料 ${p.known}/3。`);
  if(p.trust!==old.trust)lines.push(`${p.name}信任 ${p.trust-old.trust>0?'+':''}${p.trust-old.trust}（${old.trust} → ${p.trust}）。`);
 }
 for(const [id,value]of Object.entries(s.bonds)){const old=before.bonds[id]??45;if(value!==old)lines.push(`${PEOPLE[id]?.name??s.clients.find(p=>p.id===id)?.name??'联系人'}关系 ${value-old>0?'+':''}${value-old}（${old} → ${value}）。`);}
 const qualified=PRODUCTS.filter(p=>before.skill<p.skill&&s.skill>=p.skill);if(qualified.length)lines.push(`专业已达到${qualified.map(p=>'「'+p.name+'」').join('、')}的要求。`);
 for(const p of s.policies){const old=before.policies[p.id],name=s.clients.find(c=>c.id===p.client)?.name??'自己';
  if(!old)lines.push(p.self?'本月自购机会已使用。':`${name}投保已登记，佣金 ¥${p.commission} 待第 ${p.due} 天结算。`);
  else if(p.status==='cancelled'&&old.status!=='cancelled')lines.push(`${name}的撤回手续已办，保费与佣金按规则冲回。`);
  else if(!p.risk&&old.risk)lines.push(`${name}的保单疑问已处理，风险已解除。`);
  else if(p.serviced&&!old.serviced)lines.push(`${name}的首次回访已完成。`);
 }
 if(before.premium<TARGET&&s.premium>=TARGET)lines.push('本月保费已达 ¥10,000；达标奖励 ¥800 在月末结算。');
 if(s.work>before.work)lines.push(before.work<20&&s.work>=20?'工作记录已满 20 次，月底可领取 ¥600 扶持。':`工作记录 +${s.work-before.work}，累计 ${s.work} 次${s.work<20?'，满 20 次可领扶持':''}。`);
 return lines;
}
function outcome(s,before,title,text,prior){const changes=Object.keys(before).filter(k=>s[k]!==before[k]).map(key=>({key,delta:s[key]-before[key]}));s.lastResult={title,text,changes,...(prior?{details:feedbackFor(s,prior)}:{})};log(s,title,text);return s.lastResult;}
export function dayBrief(s){
 const focus=DAY_FOCUS[s.day-1];let next='可以检查客户记录，或者提前收工。';
 const contactable=p=>Boolean(p)&&p.lastContact!==s.day;
 if(s.phase==='ended')next='本月已结算，可查看账目和客户记录。';
 else if(s.ap===0)next='今天的时间用完了，可以收工结算。';
 else if(s.energy<12)next='精力较低，可以先休息一格时间。';
 else{
  const policies=s.policies.filter(p=>!p.self&&p.status!=='cancelled');
  const due=policies.find(p=>p.status==='complaint'&&contactable(s.clients.find(c=>c.id===p.client)))??policies.find(p=>!p.serviced&&contactable(s.clients.find(c=>c.id===p.client)));
  const ready=s.clients.find(p=>!['sold','closed'].includes(p.stage)&&contactable(p)&&p.known===3&&p.trust>=52&&s.day>=p.unlocked+p.ready&&s.skill>=PRODUCTS.find(x=>x.id===p.need).skill);
  const talk=s.clients.find(p=>!['sold','closed'].includes(p.stage)&&contactable(p)&&(p.known<3||p.trust<52));
  const learn=s.clients.some(p=>!['sold','closed'].includes(p.stage)&&s.skill<PRODUCTS.find(x=>x.id===p.need).skill);
  if(due)next=`${s.clients.find(c=>c.id===due.client).name}${due.status==='complaint'?'有保单疑问待处理':'还没做首次回访'}，可去客户本联系。`;
  else if(ready&&s.ap>=2&&s.cash>=10)next=`${ready.name}的需求、信任和考虑时间已满足，可谈具体方案。`;
  else if(talk)next=`可以联系${talk.name}，${talk.known<3?'继续了解'+['需求','预算','顾虑'][talk.known]:'再核对顾虑，增加信任'}。`;
  else if(learn&&(s.daily.study??0)<2)next='有客户需要的产品尚未达到专业要求，可以学习一次。';
  else if(LEADS.some(p=>!s.clients.some(c=>c.id===p.id)))next=(s.daily.call??0)<1?'可以打一次电话，寻找新联系人。':s.ap>=2&&s.cash>=12&&s.energy>=13?'可以安排社区联系，寻找新联系人。':'可以检查客户记录，或提前收工。';
  else next='本月联系人已全部记入客户本，可以检查已有记录或收工。';
 }
 return {title:DAYS[s.day-1].title,focus,next};
}
function dayReview(s){
 const parts=[],d=s.daily;
 if(d.call)parts.push(`外呼 ${d.call*12} 通`);if(d.community)parts.push(`社区联系 ${d.community} 次`);
 const contacts=s.clients.filter(p=>p.lastContact===s.day).length;if(contacts)parts.push(`联系 ${contacts} 位客户`);
 if(d.visit)parts.push(`面谈 ${d.visit} 次`);if(d.service)parts.push(`回访 ${d.service} 次`);if(d.study)parts.push(`学习 ${d.study} 次`);
 const added=s.clients.filter(p=>p.unlocked===s.day&&LEADS.some(l=>l.id===p.id)).length;if(added)parts.push(`新增 ${added} 位联系人`);
 const sold=s.policies.filter(p=>p.day===s.day&&p.status!=='cancelled');if(sold.length)parts.push(`登记投保 ${sold.length} 份${sold.some(p=>p.self)?'（含自购）':''}`);
 if(d.rest||d.home)parts.push(`休息或回家 ${ (d.rest??0)+(d.home??0)} 次`);
 return (parts.length?'今天：'+parts.join('；')+'。':'今天处理了日常剧情，没有安排额外行动。')+` 工作记录累计 ${s.work} 次，本月有效保费 ¥${s.premium}。`;
}
export function chooseEvent(s,index){
 const ev=storyFor(s);if(!ev||s.seen.includes(ev.id)||!Number.isInteger(index)||!ev.choices[index])throw Error('这件事已经处理过了。');
 const choice=ev.choices[index],before=snapshot(s),prior=feedbackSnapshot(s);applyEffect(s,choice.effect);
 if(ev.id==='d27'&&index===0)money(s,12,'同事退回寄费');
 s.seen.push(ev.id);s.pending=null;
 let text=choice.text;
 if(ev.id==='d10'&&s.premium===0)text+=' 你还没有开单，主管让你下午先找何师傅复盘一次。';
 if(ev.id==='d20'&&s.regard>=55){const lead=unlockLead(s,'外呼');if(lead)text+=` 主管还给你留了${lead.name}的咨询线索，已经记进客户本。`;}

 if(ev.id==='d18'&&s.policies.some(p=>p.client==='aunt'&&p.status!=='cancelled'))text+=' 陈姨已经买过的那份保单，也需要你认真回访。';
 if(ev.id==='d10'&&s.flags.includes('overpromise'))message(s,'zhou','你报的预计金额我记下了，后面有变动及时告诉我。');
 const source=resolveExtra(s,ev.id,index);
 if(source){const lead=unlockLead(s,source);text+=lead?` ${lead.name}的咨询已经记进客户本，之后可以找个方便的时间联系。`:' 目前的咨询线索都已记在客户本里，先把已有联系认真跟好。';}
 if(extraEventById(ev.id)){const client=s.clients.find(p=>p.id===ev.person);if(client)client.notes.unshift({day:s.day,text:ev.title+'：'+text});}
 outcome(s,before,ev.title,text,prior);message(s,ev.person,extraEventById(ev.id)?text:choice.text);return s.lastResult;
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
 const before=snapshot(s),prior=feedbackSnapshot(s);spend(s,type);let title=ACTIONS[type].name,text='';
 const p=s.clients.find(c=>c.id===id);
 if(type==='call'){
 s.calls+=12;s.mood=clamp(s.mood-3);
 const found=(s.daily.call??0)===1&&(random(s)<(.38+(s.regard>=65?.07:0)-(s.mood<25?.12:0))||s.calls%48===0);
 const lead=found?unlockLead(s,'外呼'):null;
 text=lead?`${lead.name}愿意继续咨询。${lead.opening}\n联系方式已经记进客户本，下一步可以了解需求和预算。`:(REFUSALS[Math.floor(random(s)*REFUSALS.length)]+'\n这一轮完成十二通外呼，答复已记在名单上。');
 if(!lead&&!LEADS.some(c=>!s.clients.some(p=>p.id===c.id)))text='这一轮完成十二通外呼，计入工作记录。本月可获得的联系人已全部入册，可以先跟进客户本里的咨询。';
 s.regard=clamp(s.regard+2);
 }else if(type==='community'){
 s.community++;s.mood=clamp(s.mood+2);const lead=s.community%2===0?unlockLead(s,'社区'):null;
 text=lead?`活动快结束时，${lead.name}过来问了几句。${lead.opening}\n联系方式已记进客户本，可以安排后续了解。`:'你参加了社区活动，和现场居民介绍了自己的工作。这次社区联系已计入记录，之后参加活动会继续累积。';
 if(!lead&&!LEADS.some(c=>!s.clients.some(p=>p.id===c.id)))text='你参加了社区活动，这次联系已计入工作记录。本月可获得的联系人已全部入册，可以先跟进或回访。';
 }else if(type==='study'){
 s.skill=clamp(s.skill+6);text=s.skill<35?'你把年保费、保障范围和主要限制整理成三项，照原文核对了一遍。练习稿留在手边，联系客户时可以查。':'你核对了一组常见问题，把回答和原文位置记在一起。客户追问时，可以直接找到对应说明。';
 }else if(type==='rest'){
 s.energy=clamp(s.energy+22);s.mood=clamp(s.mood+8);text=before.energy===100&&before.mood===100?'你当前的精力和心情都是满的，这次只用了休息时间。可以接着安排工作，也可以提前收工。':`你在茶水间歇了一会儿。现在精力 ${s.energy}/100，心情 ${s.mood}/100，还剩 ${s.ap} 格时间。`;
 }else if(type==='home'){
 s.energy=clamp(s.energy+28);s.mood=clamp(s.mood+15);changeBond(s,'aunt',3);changeBond(s,'friend',2);text='你买了菜回家吃饭，和陈姨、许嘉聊了最近的事。菜钱已记进生活账，饭后再安排剩下的时间。';
 }else if(type==='follow'||type==='visit'){
 p.lastContact=s.day;p.met++;p.stage='talking';const old=p.known;p.known=Math.min(3,p.known+(type==='visit'?2:1));p.trust=clamp(p.trust+(type==='visit'?14:9)+(s.skill>=40?3:0)-(s.mood<25?3:0));s.skill=clamp(s.skill+1);s.visits+=type==='visit'?1:0;
 text=old<3?p.facts.slice(old,p.known).join('\n'):'你们重新核对了已有需求和顾虑，联系记录可以接着用。';
 text=`你和${p.name}${type==='visit'?'见了面':'聊了一会儿'}。\n${text}`;if(s.mood<25)text+='\n今天心情偏低，信任增长比平时少。休息可以恢复心情。';p.notes.unshift({day:s.day,text});
 }else if(type==='bond'){
 p.lastContact=s.day;p.trust=clamp(p.trust+8);if(s.bonds[p.id]!==undefined)changeBond(s,p.id,5);s.mood=clamp(s.mood+6);
 text=p.family?`你和${p.name}聊了最近的生活，问了问家里的安排。这次聊完，你们又说起了几件最近的事。`:`你和${p.name}聊了工作和家里的近况。这次只聊近况，联系已记入今天的记录。`;
 }else if(type==='offer'){
 p.lastContact=s.day;p.offerDay=s.day;
 const fit=product.id===p.need&&product.premium<=p.budget;
 const ready=s.day>=p.unlocked+p.ready;
 const good=p.known===3&&p.trust>=52&&s.skill>=product.skill&&ready;
 const pressure=options.approach==='pressure';
 if(!pressure&&!fit){s.integrity=clamp(s.integrity+2);text=`你把「${product.name}」的条件和费用讲清楚后，发现${product.id!==p.need?'这款保障与客户的需求不同':'这款年保费超出客户预算'}，这次没有登记投保。\n你没有登记投保。下次可以按客户本中的需求和预算重新选。`;p.trust=clamp(p.trust+3);}
 else if(!pressure&&!good){
 const why=p.known<3?`还缺${['需求','预算','顾虑'].slice(p.known).join('、')}的信息，可先跟进了解。`:s.skill<product.skill?`这款需要专业 ${product.skill}，你当前是 ${s.skill}，可以学习后再谈。`:!ready?`还在考虑期，最早第 ${p.unlocked+p.ready} 天再确认${p.unlocked+p.ready>30?'，本月可能来不及完成':''}。`:`当前信任 ${p.trust}，通常需达到 52，可先继续跟进。`;
 text=`${p.name}没有马上答应。${why}\n这次说明已完成，尚未登记投保。之后可以按缺项准备。`;p.trust=clamp(p.trust+4);
 }else if(pressure&&(p.trust<40||!ready)){
 p.trust=clamp(p.trust-9);s.integrity=clamp(s.integrity-5);s.mood=clamp(s.mood-4);text=`你提起月底任务，${p.name}沉默了一会儿，说还是先不考虑了。气氛比刚才生疏了些。`;
 }else{
 const risky=!fit||pressure;const commission=Math.round(product.premium*product.rate);
 const policy={id:`p${s.policies.length+1}`,client:p.id,product:product.id,premium:product.premium,commission,day:s.day,due:s.day+3,paid:false,status:'active',risk:risky,serviceDue:s.day+5,serviced:false,source:p.source,self:false};
 s.policies.push(policy);s.premium+=product.premium;p.stage='sold';s.regard=clamp(s.regard+8);s.mood=clamp(s.mood+10);
 if(pressure){s.integrity=clamp(s.integrity-9);p.trust=clamp(p.trust-12);if(p.family)changeBond(s,p.id,-12);}
 text=`${p.name}决定选择「${product.name}」。本次计入保费 ¥${product.premium.toLocaleString()}，预计佣金 ¥${commission}，三天后确认到账。\n`+(risky?'投保已登记，但这次有催促或不匹配的问题。客户本会保留回访提醒，需要尽快核对。':'这是一次合适的成交。保单已记入客户本，接下来安排首次回访。');
 message(s,'zhou',`收到${p.name}这单了。记得把资料交齐，后续也跟好。`);
 }
 }else if(type==='service'){
 p.lastContact=s.day;const policy=s.policies.find(x=>x.client===id&&x.status!=='cancelled');policy.serviced=true;p.served++;p.trust=clamp(p.trust+12);s.integrity=clamp(s.integrity+4);
 const prod=PRODUCTS.find(x=>x.id===policy.product);const fit=prod.id===p.need&&prod.premium<=p.budget;
 if(policy.risk&&!fit){cancelPolicy(s,policy);p.stage='closed';text=`你和${p.name}重新核对后，确认这份安排不合适，协助办理了撤回。业绩减去 ¥${policy.premium}，佣金也同步撤回。\n撤回手续已经处理，结果已记入客户本。`;if(p.family)changeBond(s,p.id,6);}
 else{policy.risk=false;policy.status='active';text=`${p.name}核对了保障条件和后续事项，这次回访已完成。\n“行，我把你的联系方式留着，有问题再问。”`;if(p.served===1){const lead=unlockLead(s,'转介绍');if(lead)text+=`\n对方确认朋友愿意咨询后，把${lead.name}的联系方式发来。客户本已新增这位联系人。`;}}
 }
 sideEvent(s);return outcome(s,before,title,text,prior);
}
function cancelPolicy(s,policy){if(policy.status==='cancelled')return;policy.status='cancelled';s.premium-=policy.premium;if(policy.paid){money(s,-policy.commission,'撤回佣金');policy.paid=false;}if(policy.self)s.selfPremium-=policy.premium;}
export function buySelf(s,productId){
 canAct(s);const product=PRODUCTS.find(p=>p.id===productId);if(!product)throw Error('没有这项方案。');if(s.policies.some(p=>p.self))throw Error('本月已经自购过，请先顾好后续支出。');if(s.cash<product.premium)throw Error('现金不够支付这笔保费。');if(s.ap<1)throw Error('今天剩余时间不够。');
 const before=snapshot(s),prior=feedbackSnapshot(s);s.ap--;money(s,-product.premium,'自己支付保费');const commission=Math.round(product.premium*product.rate);
 s.policies.push({id:`p${s.policies.length+1}`,client:'self',product:product.id,premium:product.premium,commission,day:s.day,due:s.day+3,paid:false,status:'active',risk:false,serviced:true,self:true,source:'自购',serviceDue:99});
 s.premium+=product.premium;s.selfPremium+=product.premium;if(['illness','saving'].includes(product.id))s.renewal+=product.premium;
 s.regard=clamp(s.regard+6);s.mood=clamp(s.mood-3);return outcome(s,before,'自购已登记',`你支付了 ¥${product.premium}，选择「${product.name}」。预计佣金 ¥${commission}，三天后确认。${s.renewal?'这项长期安排还会带来每年 ¥'+s.renewal+' 的后续缴费负担。':'这是一年期安排，明年是否继续，需要重新考虑。'}\n它会计入本月业绩，现金已按保费金额扣除。`,prior);
}
export function acknowledge(s){s.lastResult=null;const extra=nextExtraEvent(s);if(extra)s.pending=extra;}
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
 let review=dayReview(s);
 if(s.cash<0)review+=` 当前现金缺口 ¥${Math.abs(s.cash)}，已留在账本中；免费行动仍可继续。`;
 if(day===14)review+=` 明天晚间扣固定开支 ¥${s.origin==='career'?2200:1600}。`;
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
 if(s.cash<0||s.renewal>Math.max(0,s.cash)*2&&s.renewal>0){id='debt';title='先补上生活费';body=`这个月的记录已经结算，当前现金 ¥${s.cash}，自购后续年缴费 ¥${s.renewal}。先检查缺口和固定负担，已完成的工作与客户记录都保留在本子里。`;}
 else if(s.premium>=TARGET&&(s.integrity<55||active.some(p=>p.risk)||family<42)){id='poster';title='保费达标，继续核对后续';body=`本月保费 ¥${s.premium}，达到考核目标。账目已结算，职业记录、保单风险和亲友关系仍需一起检查，客户本里能查到具体情况。`;}
 else if(s.premium>=TARGET&&outside.length>=3&&s.integrity>=65){id='steady';title='第一个月，达标了';body=`本月保费 ¥${s.premium}，合适成交 ${clean.length} 份，其中 ${outside.length} 份来自亲友以外的客户。你已经做出一批能独立联系的客户记录，达标奖励也按规则入账。`;}
 else if(clean.length>=3&&s.integrity>=65){id='slow';title='这几位客户做下来了';body=`本月完成 ${clean.length} 份合适成交，客户的问题和联系记录都已留下。保费距离目标还有差额，这些已完成的工作也会计入本月结果。`;}
 else if(family<45){id='contacts';title='给亲友留一次私人联系';body=`本月保费 ¥${s.premium}。亲友关系下降得较多，生活账里能查到当前关系，客户本也保留了原来的记录。之后联系，可以先把之前的事解释好。`;}
 else{id='leave';title='第一个月做完了';body=`本月保费 ¥${s.premium}，没有达到一万元目标。本月累计 ${s.work} 次工作记录，专业 ${s.skill}/100。已完成的安排和生活支出都能在日记、账本中回看。`;}
 const epilogues=[s.bonds.lin>=65?'小满：这个月交表了，哪天去吃面？':'小满：你的资料还在原位，有东西要拿跟我说。',family>=65?'陈姨问周末来不来吃饭，许嘉发来一场球赛的时间。':family<45?'许嘉说找个时间见面，把前面的事聊一下。':'许嘉约你月底忙完再见面。',outside.length>=3?`客户本保留了 ${outside.length} 位亲友以外客户的合适成交记录。`:s.work>0?`乔姐：这个月的 ${s.work} 次工作记录收到了，资料留好。`:'乔姐：本月账目已结算，可在生活账查看。'];
 return {id,title,body,epilogues,clean:clean.length,outside:outside.length,family,receivable:s.policies.filter(p=>!p.paid&&p.status!=='cancelled').reduce((n,p)=>n+p.commission,0)};
}
export function progress(s){return {target:TARGET,policies:s.policies.filter(p=>p.status!=='cancelled').length,receivable:s.policies.filter(p=>!p.paid&&p.status!=='cancelled').reduce((v,p)=>v+p.commission,0),complaints:s.policies.filter(p=>p.status==='complaint').length,service:s.policies.filter(p=>!p.self&&!p.serviced&&p.status!=='cancelled').length};}
export function exportSave(s){return JSON.stringify({game:'明天一定开单',version:VERSION,state:s},null,2);}
export function importSave(raw){
 let data;try{data=JSON.parse(raw);}catch{throw Error('文件不是有效的 JSON 存档。');}
 const s=data?.state;const fail=()=>{throw Error('存档内容不完整或版本不兼容，现有进度没有改变。');};
 if(data?.game!=='明天一定开单'||data.version!==VERSION||!s||s.version!==VERSION)fail();
 // v1 原存档只补充新增内容记录，不重算任何历史奖励或已完成剧情。
 if(!('extra' in s)){
  s.extra=freshExtra();
  for(const [id,flag,day]of [['d2','listedFamily',2],['d10','overpromise',10]])if(Array.isArray(s.seen)&&s.seen.includes(id))s.extra.decisions[id]={choice:Array.isArray(s.flags)&&s.flags.includes(flag)?1:0,day};
 }
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
 const extra=s.extra;if(!extra||typeof extra!=='object'||Array.isArray(extra)||!extra.decisions||typeof extra.decisions!=='object'||Array.isArray(extra.decisions)||!('claim' in extra))fail();
 for(const [id,d]of Object.entries(extra.decisions))if(!['d2','d10','d21'].includes(id)&&!extraEventById(id)||!d||!Number.isInteger(d.choice)||![0,1].includes(d.choice)||!Number.isInteger(d.day)||!bounded(d.day,1,s.day)||!s.seen.includes(id))fail();
 for(const id of s.seen.filter(id=>extraEventById(id)))if(!extra.decisions[id])fail();
 const claim=extra.claim;
 if(claim!==null){
  const policy=s.policies.find(p=>p.id===claim.policyId);
  if(typeof claim!=='object'||!policy||policy.client!=='wu'||policy.product!=='accident'||!['materials','supplement','review','closed'].includes(claim.stage)||!Number.isInteger(claim.due)||!bounded(claim.due,1,35)||!s.seen.includes('x-claim-report'))fail();
  const resolved=id=>s.seen.includes(id);
  const expected=resolved('x-claim-result')?'closed':resolved('x-claim-supplement')?'review':resolved('x-claim-materials')?(extra.decisions['x-claim-materials'].choice===0?'review':'supplement'):'materials';
  const prior=expected==='closed'?'x-claim-result':expected==='materials'?'x-claim-report':expected==='supplement'?'x-claim-materials':resolved('x-claim-supplement')?'x-claim-supplement':'x-claim-materials';
  const due=extra.decisions[prior]?.day+(expected==='closed'?0:expected==='supplement'?1:2);
  if(claim.due!==due||claim.stage!==expected||resolved('x-claim-result')&&!resolved('x-claim-materials')||resolved('x-claim-supplement')&&(!resolved('x-claim-materials')||extra.decisions['x-claim-materials'].choice!==1))fail();
 }else if(s.seen.some(id=>id.startsWith('x-claim-')))fail();
 if(typeof s.pending==='string'&&s.pending.startsWith('x-')&&(s.lastResult||nextExtraEvent({...s,pending:null})!==s.pending))fail();
 if(s.seen.some(x=>!eventById(x))||new Set(s.seen).size!==s.seen.length||s.flags.some(x=>!text(x,60)))fail();
 if(s.pending&&(!eventById(s.pending)||s.seen.includes(s.pending)))fail();
 const changes=v=>Array.isArray(v)&&v.every(x=>x&&['cash','energy','mood','skill','integrity','regard','premium'].includes(x.key)&&bounded(x.delta,-1e7,1e7));
 if(s.lastResult&&(!text(s.lastResult.title,100)||!text(s.lastResult.text)||!changes(s.lastResult.changes)))fail();
 if(s.lastResult?.details!==undefined&&(!Array.isArray(s.lastResult.details)||s.lastResult.details.length>30||s.lastResult.details.some(line=>!text(line,500))))fail();
 if(s.night&&(!text(s.night.review)||!Array.isArray(s.night.entries)||s.night.entries.some(x=>!text(x))||!changes(s.night.changes)||!bounded(s.night.used,0,6)))fail();
 if(s.phase==='night'&&!s.night||s.phase==='ended'&&s.day!==30)fail();
 if(s.phase==='ended'){
  const expected=endingFor(s),saved=s.ending;
  if(!saved)s.ending=expected;
  else if(!text(saved.title,100)||!text(saved.body)||!Array.isArray(saved.epilogues)||saved.epilogues.length>10||saved.epilogues.some(line=>!text(line))||['id','clean','outside','family','receivable'].some(k=>saved[k]!==expected[k]))fail();
 }else s.ending=null;
 return copy(s);
}
