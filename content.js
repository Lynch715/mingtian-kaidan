// 第一章的补充故事。沿用原有剧情弹窗，不改变产品、收支和每日时间规则。
const c=(label,effect,text)=>({label,effect,text});
const e=(id,title,person,body,choices)=>({id,day:0,title,person,body,choices});
export const EXTRA_EVENTS=[
 e('x-wu','先把车停稳','wu','吴师傅发来一条只有三秒的语音，说临时多了两趟配送。后面跟着一句：“昨天说的事，我没忘。”\n你看了一眼记好的时间。他不是不想聊，只是这一天很难完全由自己安排。',[c('请他忙完留个方便的时间',{bond:{wu:6},mood:2},'他收车以后发来消息，说接完孩子能空出一会儿。你把新时间记下，也说好出发前再确认。这次，谁都不用在路边干等。'),c('把要确认的事写短一点，让他停好车再看',{skill:2,bond:{wu:4}},'你只留下职业范围、预算和想问的问题，没有塞进整份宣传资料。他回：“这样行，我停下来慢慢看。”')]),
 e('x-chen','两份资料摊在桌上','chen','陈静带来另一家公司的资料，在两份方案上各夹了一张便签。\n“这份写的数更大，可我看不出差在哪儿。”她把笔递给你。你发现，有些数字说的是不同的保障，不能直接放在一起比。',[c('把保障范围、免赔额和续保条件逐项列开',{skill:4,bond:{chen:7},integrity:2},'表格写到最后，你们划掉了几处不能直接比较的数字。她把两份资料都收好，说还要带回家看。你没有替她扔掉另一份。'),c('先圈出不确定的条款，核对后再回复',{skill:3,bond:{chen:5},energy:-2},'你找乔姐把几个词确认清楚，再把区别发过去。陈静回了句：“收到，标明不知道的地方也挺好。”这张比较表留在了你们的联系记录里。')]),
 e('x-lu','等她下班一起听','lu','陆先生接起电话，先问这次能不能晚一点。爱人刚下班，之前几次都是他听完再回家转述。\n“不是她不同意。家里的钱总得一起商量，我怕自己讲漏。”你把已经翻开的方案暂时合上。',[c('约两个人都方便的时候，先听他们各自担心什么',{bond:{lu:7},skill:3},'他们一个担心大病后的家庭开销，一个担心几年后还能不能负担保费。你把两件事分别记下，没有把一次点头当成全家的决定。'),c('先留一页家庭支出清单，等他们商量后再聊',{bond:{lu:5},integrity:2},'你留下的是要讨论的问题：现有保障、每年结余、收入中断后能撑多久。陆先生说：“这个我俩今晚能一起填。”没有人被要求当场签字。')]),
 e('x-tang','先算急用钱的那一年','tang','唐女士没有问最后能拿多少。她把资料翻到中途退出那一页，指着一行字。\n“假如第三年家里急用钱，这笔安排能帮上多少？”你发现自己练过的介绍里，这一段总是说得最快。',[c('按资料列明的退出条件核对，不把已交保费当可取金额',{skill:4,bond:{tang:7},integrity:3},'你把演示资料中的退出金额、已缴保费和可能的损失分开写明，提醒她最终以合同约定为准。她看了一会儿，说会先留足家里的应急钱。'),c('先一起检查应急储备，再决定要不要安排长期资金',{bond:{tang:5},skill:3},'她把近期要用的钱另外圈出来。你们同意，这部分先别放进长期安排。她说：“你愿意先算不能放进去的钱，我才敢继续问。”')]),
 e('x-family','那张名单，后来呢','friend','许嘉发来消息，问起前几天的联系人名单。\n有些名字写上去只用几秒，电话打到别人那里，事情就不只在这张纸上了。',[c('把联系边界说清楚，尊重每个人的决定',{bond:{friend:5},integrity:3},'你把话说到前面：没有本人同意，不把联系方式交出去；不想聊业务，也可以直说。许嘉回了个“好”，接着问你晚上吃什么。'),c('先听他说完，把需要改的记录下来',{bond:{friend:4},skill:2},'你没有急着解释自己的难处。哪些人不想接业务电话、哪些邀请需要本人同意，你逐条记下，准备自己去处理。')]),
 e('x-plan','报上去的数，到了回头看的时候','zhou','周主管把月初记的计划翻出来，让你坐下说说。桌上除了预计金额，还有这几天实际留下的联系记录。\n“哪些还在聊，哪些现在不合适？这回说具体一点。”',[c('按实际记录更新，也写清暂时不能推进的原因',{integrity:3,regard:3},'你把已经完成的和还没答应的分开。对方愿意再聊，不等于已经决定购买。主管收起表，说之后就照这个口径报。'),c('请主管一起看跟进记录，找出安排上的问题',{skill:4,regard:2},'你们删掉了几项没有确认的安排，给仍在考虑的人留了时间。主管让你把下一次联系的事写清，不要只填一个好看的金额。')]),
 e('x-lin','姐姐后来回了电话','lin','午休时，小满拿着手机走到你旁边。姐姐回电话了，她想把那天没说完的事告诉你。\n窗外有人搬着椅子经过。她等脚步声远了一点，才开始往下说。',[c('听她把后续说完，再一起确认需要做的服务',{bond:{lin:6},skill:2},'你们把补充说明和后续服务分开记好。小满说这回不会把“以后再讲”留成一句空话。两个人把本子合上，终于想起饭还没吃。'),c('帮她留好处理记录，让她自己把话接着说完',{bond:{lin:4},integrity:2},'你没有替她打那通电话，只帮她把日期、问题和回复记清。她看着那几行字，说至少下次不用再凭记忆解释。')]),
 e('x-claim-report','吴师傅来了一通电话','wu','吴师傅昨天配送时摔伤了手腕，在门诊处理过，现在已经回家休息。他想知道，上次那份意外保障能不能用。\n乔姐和你重新核对了这份虚构保单：已列明的配送职业属于约定范围，符合条件的意外门诊费用可以申请；停工少赚的钱不属于这一项。最后能给付多少，还要看材料和审核。',[c('先听清经过，告诉他需要哪些材料',{bond:{wu:4},skill:2},'你记下事故时间、就诊情况和他最担心的事，把诊疗记录、票据和费用明细列成清单。你没有先报一个赔付数字，只说会陪他把申请走完。'),c('请乔姐一起核对报案信息，确认后给他回复',{bond:{qiao:3,wu:3},skill:3,energy:-2},'乔姐陪你核对了保单、职业和事故经过。你回电话时，把可以申请的费用和不属于这项保障的停工损失分别解释了一遍。材料还需要慢慢补齐。')]),
 e('x-claim-materials','照片里少了一张费用明细','wu','吴师傅把票据拍过来了，有一张反光，费用明细也漏了一页。\n“是不是有个总数就行？”他问。你看着桌上那张清单，知道审核需要能逐项对上的材料。等补齐再提交，和先交已有材料再补件，需要的时间并不一样。',[c('先帮他核对齐全，再提交申请',{skill:3,bond:{wu:5},energy:-3},'你陪他按清单核对，等明细补齐、照片重拍清楚，才把这一份材料提交。乔姐确认已经受理，接下来需要等审核结果。'),c('先提交现有材料，写明缺项并约好补件',{skill:2,bond:{wu:3}},'你没有把缺页说成齐全。申请先登记了，缺失的明细也明确列出。吴师傅答应再取一趟材料；这次还需要经过补件，才能进入完整审核。')]),
 e('x-claim-supplement','补来的那一页','wu','吴师傅把补开的费用明细发来了，这回每一项都能看清。他在消息末尾问：“还少什么吗？”\n你把原来的缺项清单放在旁边，重新从头核了一遍。',[c('逐项核对，确认齐全后转入审核',{skill:3,bond:{wu:4}},'票据、诊疗记录和费用明细终于对上了。你告诉他补件已经收齐，接下来等正式审核，不把“材料齐了”说成“一定全赔”。'),c('请乔姐复核一遍，再把进度告诉他',{bond:{qiao:2,wu:4},integrity:2},'乔姐复核后确认可以转入完整审核。你把这一步记在联系记录里，也回了吴师傅一句：材料的事先忙完了，有结果会主动联系。')]),
 e('x-claim-result','这次电话，不是为了签单','wu','审核通知回来了。本案的诊疗记录和票据已核对，按这份虚构保单约定，核定给付 ¥860；申请中提到的停工收入损失不属于该项责任，没有计入。\n这是吴师傅的理赔款，不是你的佣金或业绩。你把结果打开，准备给他打电话。',[c('把给付依据和未计入的部分一并讲清楚',{bond:{wu:8},integrity:3,mood:5},'吴师傅听完，先问手里这几张票据还要不要留着。你说明后续事项，也把有异议时可以复核的途径告诉他。他说：“这几天麻烦你了。”这次没有新的保单，你还是认真记了一页。'),c('先问他看不懂哪里，再逐项解释审核通知',{bond:{wu:7},skill:3,mood:5},'他最在意的仍是停工那几天。你没有绕开这一项，重新解释保障范围和复核途径。电话结束前，他说终于知道这份保障管什么、不管什么了。')])
];
export const freshExtra=()=>({decisions:{},claim:null});
export const extraEventById=id=>EXTRA_EVENTS.find(e=>e.id===id);
const decision=(s,id)=>s.extra?.decisions[id];
export function eligibleClaimPolicy(s){return s.policies.find(p=>p.client==='wu'&&p.product==='accident'&&p.status==='active'&&!p.risk&&s.day>=p.day+4);}
export function nextExtraEvent(s){
 if(s.phase!=='day'||s.pending||s.lastResult)return null;
 // 每日最多一段补充故事；每日主线和原有日常事件继续优先展示。
 if(Object.entries(s.extra.decisions).some(([id,d])=>id.startsWith('x-')&&d.day===s.day))return null;
 const claim=s.extra.claim;
 if(claim&&claim.stage!=='closed'&&s.day>=claim.due){
  const p=s.policies.find(p=>p.id===claim.policyId);
  if(p?.status!=='cancelled')return {materials:'x-claim-materials',supplement:'x-claim-supplement',review:'x-claim-result'}[claim.stage];
 }
 if(!claim&&!s.seen.includes('x-claim-report')&&s.day>=12&&s.day<=24&&eligibleClaimPolicy(s))return 'x-claim-report';
 for(const [id,from,min]of [['x-family','d2',5],['x-plan','d10',14],['x-lin','d21',24]]){
  const d=decision(s,from);if(d&&!s.seen.includes(id)&&s.day>=Math.max(min,d.day+3))return id;
 }
 for(const id of ['wu','chen','lu','tang']){
  const p=s.clients.find(p=>p.id===id);
  if(p&&p.stage==='talking'&&p.known>0&&s.day>=p.unlocked+1&&!s.seen.includes('x-'+id))return 'x-'+id;
 }
 return null;
}
export function extraStoryFor(s,original){
 const event=structuredClone(original),d=decision(s,{ 'x-family':'d2','x-plan':'d10','x-lin':'d21'}[event.id]);
 if(event.id==='x-family'&&d){
  if(d.choice===1){event.body='许嘉把一条活动邀请转发给你：“我没有留过这个电话，是从你那张名单来的？”\n你想起前几天填满的亲友表。那时只是想先把作业交上去，现在电话已经打到了别人那里。';event.choices[0].text='你向许嘉说明情况并道歉，联系营业部撤下未经同意的号码，也告诉相关亲友可以拒绝业务邀请。他说以后有事直接问他，别先替他答应。话说开了，信任还得慢慢补。';}
  else event.body='许嘉说，有亲戚接到了营业部的活动电话，顺便问你有没有把他的号码也填进去。\n你告诉他，当时只记了主动聊过需求、愿意继续联系的人。他松了口气，说朋友之间还是先问一句好。';
 }
 if(event.id==='x-plan'&&d){
  event.body=d.choice===1?'周主管翻出你月初报的预计金额，说有几笔该回头核对了。你当时把还在考虑的人也算了进去。\n'+(s.premium>=5000?'这几天已有一些成交，但当时的预计仍不能代替客户自己的决定。':'几笔计划还没有落实。表上的金额留了下来，客户却没有因此更快做决定。'):'周主管翻出月初的跟进表。当时你把暂时不合适的人也写清楚了，这几天的记录接得上。\n“有一个新咨询，我想先让你看看。还是按实际情况报，不用先保证成交。”';
  if(d.choice===0)event.choices[0].text+=' 你说明愿意先了解情况，也会如实反馈。';
 }
 if(event.id==='x-lin'&&d){
  event.body=d.choice===0?'午休时，小满告诉你，姐姐又回了电话。那天你陪她把后续缴费和没讲清的条件说开，后来乔姐也帮忙核对过。\n“她没有再生闷气了，还说有个朋友想先了解保障，愿意的话可以把联系方式给我们。”小满先问你，要不要一起把后续服务安排好。':'小满说，那天早点回去确实缓过来了，可姐姐的问题还在。她把要问乔姐的便签摊开，想今天主动打一次电话。\n“光说改天解释，也不能一直改天。”她问你能不能帮她把问题顺一遍。';
  if(d.choice===0)event.choices[0].text+=' 小满先确认那位朋友同意被联系，才请你帮忙了解需求。';
 }
 return event;
}
export function resolveExtra(s,id,index){
 if(['d2','d10','d21'].includes(id)||extraEventById(id))s.extra.decisions[id]={choice:index,day:s.day};
 if(id==='x-claim-report')s.extra.claim={policyId:eligibleClaimPolicy(s).id,stage:'materials',due:s.day+2};
 if(id==='x-claim-materials')Object.assign(s.extra.claim,{stage:index===0?'review':'supplement',due:s.day+(index===0?2:1)});
 if(id==='x-claim-supplement')Object.assign(s.extra.claim,{stage:'review',due:s.day+2});
 if(id==='x-claim-result')Object.assign(s.extra.claim,{stage:'closed',due:s.day});
 if(index===0&&id==='x-plan'&&decision(s,'d10')?.choice===0)return '外呼';
 if(index===0&&id==='x-lin'&&decision(s,'d21')?.choice===0)return '转介绍';
 return null;
}
export function claimSummary(s,client){
 const claim=s.extra?.claim;if(!claim||client&&client!=='wu')return '';
 const labels={materials:'正在等诊疗记录、票据和费用明细',supplement:'已登记申请，等待补齐费用明细',review:'材料已收齐，等待审核结果',closed:'审核结果已说明，本案核定给付 ¥860；停工收入损失未计入'};
 return '吴师傅的理赔协助：'+labels[claim.stage]+(claim.stage==='closed'?'。理赔款属于客户，不计入个人现金或业绩。':`。预计第 ${claim.due} 天继续跟进，有进展会留在消息和日记里。`);
}
