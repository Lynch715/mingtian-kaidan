// 第一章的补充故事；保留原有触发、数值和存档记录。
export const EXTRA_EVENTS = [
 {
  "id": "x-wu",
  "day": 0,
  "title": "给吴师傅换一版大字",
  "person": "wu",
  "body": "吴师傅的手机屏幕裂了一角，产品介绍放大后，一行字总要左右拖。\n他把手机横过来又竖回去：“能不能给我张字大的？我戴着手套也翻不动这个。”",
  "choices": [
   {
    "label": "把关键条件排成大字，原文另外附上",
    "effect": {
     "bond": {
      "wu": 6
     },
     "mood": 2
    },
    "text": "你把范围、费用和需要注意的条件排开，给他看过字号，再附上完整原文。吴师傅说这次不用来回拖，拿回去自己也能看。"
   },
   {
    "label": "先念给他听，按他说的不清楚处重排",
    "effect": {
     "skill": 2,
     "bond": {
      "wu": 4
     }
    },
    "text": "你读一段，他指出哪里没听懂。最后那版少了挤在一起的小字，原文仍然单独留着。吴师傅试着翻了翻，说这一份能用。"
   }
  ]
 },
 {
  "id": "x-chen",
  "day": 0,
  "title": "两份资料怎么比",
  "person": "chen",
  "body": "陈静带来两份产品说明，圈着几个数字：“这份金额大，但不知道和你这份是不是一回事。”\n你对照后发现，有的写的是报销范围，有的写的是给付条件，需要分开看。",
  "choices": [
   {
    "label": "把范围、免赔额和续保条件分栏核对",
    "effect": {
     "skill": 4,
     "bond": {
      "chen": 7
     },
     "integrity": 2
    },
    "text": "你们把同一项放进同一栏，几处不能直接比较的地方注明了原因。陈静把表带回去，说下次只问还没看懂的两项。"
   },
   {
    "label": "先查不确定的条款，再回复",
    "effect": {
     "skill": 3,
     "bond": {
      "chen": 5
     },
     "energy": -2
    },
    "text": "你找乔姐核对了两个条款，把原文位置和解释一起发给陈静。她回复：“这两条清楚了。”比较表也留在了联系记录里。"
   }
  ]
 },
 {
  "id": "x-lu",
  "day": 0,
  "title": "夫妻一起听方案",
  "person": "lu",
  "body": "陆先生问能不能换个时间，让爱人一起听。前几次都是他听完再回去转述，有两个问题她还想当面问。\n他把两个人都方便的时段发来，你准备怎么接着谈？",
  "choices": [
   {
    "label": "约好时间，分别问两人的担心",
    "effect": {
     "bond": {
      "lu": 7
     },
     "skill": 3
    },
    "text": "他们一个问收入中断，一个问后面几年交不交得起。你把问题分开记在同一份资料里，接下来可以逐项回答。"
   },
   {
    "label": "先发家庭支出清单，等商量后再聊",
    "effect": {
     "bond": {
      "lu": 5
     },
     "integrity": 2
    },
    "text": "你把现有缴费、每年结余和应急储备列成清单。陆先生说今晚两个人一起填，之后按这份清单核对方案。"
   }
  ]
 },
 {
  "id": "x-tang",
  "day": 0,
  "title": "唐女士问提前退出",
  "person": "tang",
  "body": "唐女士翻到提前退出那页，问：“第三年家里急用钱，实际能拿回多少？”\n她已经看过期满的演示，现在想把中途退出的情况也算上。你找出对应的示例表，准备和她核对。",
  "choices": [
   {
    "label": "对照示例，列出已交金额和退出金额",
    "effect": {
     "skill": 4,
     "bond": {
      "tang": 7
     },
     "integrity": 3
    },
    "text": "你把两列金额写开，标出示例中的损失，提醒实际按合同约定核算。唐女士拍下这页，说要和家里的用钱安排再对一遍。"
   },
   {
    "label": "先核对家里的应急钱够不够",
    "effect": {
     "bond": {
      "tang": 5
     },
     "skill": 3
    },
    "text": "唐女士把近期开支圈出来，你们把需要随时取用的钱单独留出。可以用于长期安排的金额重新算好，后续就按这个预算讨论。"
   }
  ]
 },
 {
  "id": "x-family",
  "day": 0,
  "title": "许嘉来问名单",
  "person": "friend",
  "body": "许嘉发消息问起前几天的联系人表。他听说营业部在打活动邀请电话，想确认自己的号码有没有交出去。\n你打开当时的记录，准备按实际情况说明。",
  "choices": [
   {
    "label": "说明哪些号码可以交，之后先问本人",
    "effect": {
     "bond": {
      "friend": 5
     },
     "integrity": 3
    },
    "text": "你把名单核对一遍，确认未经同意的号码不会交出去。许嘉说行，要是自己有需要会直接来找你，这件事可以按这个约定办。"
   },
   {
    "label": "问清他是否愿意接业务邀请，记好意见",
    "effect": {
     "bond": {
      "friend": 4
     },
     "skill": 2
    },
    "text": "许嘉说目前不想接活动电话，有保障问题再单独问你。你把他的联系意见补上，今后就按这个安排。"
   }
  ]
 },
 {
  "id": "x-plan",
  "day": 0,
  "title": "一条咨询交给谁",
  "person": "zhou",
  "body": "周主管拿着一条新咨询，叫你过去看。对方只留了想问的事，还没选产品。\n他先翻到前十天的计划表，再看你，准备谈这条咨询怎么接。",
  "choices": [
   {
    "label": "先讲自己能接到哪一步",
    "effect": {
     "integrity": 3,
     "regard": 3
    },
    "text": "你说明已经掌握的情况和还要核对的内容，接受咨询前先确认能处理的问题。主管听完，让你照实际准备情况安排联系。"
   },
   {
    "label": "请主管示范第一次接洽的办法",
    "effect": {
     "skill": 4,
     "regard": 2
    },
    "text": "主管拿这条咨询作例子，先辨认对方在问什么，再讲该找谁协助。你练了一遍开头，知道遇到超出准备范围的问题可以先查。"
   }
  ]
 },
 {
  "id": "x-lin",
  "day": 0,
  "title": "小满姐姐的后续消息",
  "person": "lin",
  "body": "小满把手机放到桌上，问你能不能听她把后续说完。姐姐的那件事，今天有了下一步。\n她把原来的便签收好，准备自己回电话。",
  "choices": [
   {
    "label": "听她讲完，确认接下来由谁联系",
    "effect": {
     "bond": {
      "lin": 6
     },
     "skill": 2
    },
    "text": "你们把接下来各自要联系谁说清，分好了这次的工作。小满记好分工，起身去办自己负责的那一项。"
   },
   {
    "label": "让她自己回话，有卡住的再来问",
    "effect": {
     "bond": {
      "lin": 4
     },
     "integrity": 2
    },
    "text": "你提醒她先听姐姐的决定，不替对方下结论。小满把手机拿回去，自己完成这次联系；遇到没把握的地方，再找乔姐核对。"
   }
  ]
 },
 {
  "id": "x-claim-report",
  "day": 0,
  "title": "吴师傅打来报案电话",
  "person": "wu",
  "body": "吴师傅昨天配送时摔伤手腕，门诊处理后已经回家。他问上次买的意外保障能不能申请。\n乔姐查了这份保单：配送职业在约定范围内，符合条件的意外门诊费可以申请，停工少赚的钱不在这一项里。费用得核对材料后再算。",
  "choices": [
   {
    "label": "问清经过，把材料清单发给他",
    "effect": {
     "bond": {
      "wu": 4
     },
     "skill": 2
    },
    "text": "你记下事故和就诊情况，发去诊疗记录、票据、费用明细三项清单。吴师傅回复收到，报案信息已登记，接下来等他交材料。"
   },
   {
    "label": "请乔姐一起核对报案信息，再回复",
    "effect": {
     "bond": {
      "qiao": 3,
      "wu": 3
     },
     "skill": 3,
     "energy": -2
    },
    "text": "乔姐陪你核对了保单和事故信息。你把能申请的费用、不能计入的停工损失分别回给吴师傅，材料清单也已经发出。"
   }
  ]
 },
 {
  "id": "x-claim-materials",
  "day": 0,
  "title": "费用明细少一页",
  "person": "wu",
  "body": "吴师傅发来照片，有一张反光，费用明细还少一页。他问是不是票据上有总数就够。\n你对照清单给他说明：总数要能和各项费用对上。这次可以等材料齐了提交，也可以先登记，再把缺的补上。",
  "choices": [
   {
    "label": "先核对齐全，再提交",
    "effect": {
     "skill": 3,
     "bond": {
      "wu": 5
     },
     "energy": -3
    },
    "text": "你把缺项和看不清的照片逐个指出，等吴师傅补齐后提交。乔姐确认申请已受理，材料这一步办完，接下来等审核。"
   },
   {
    "label": "先登记现有材料，注明缺项",
    "effect": {
     "skill": 2,
     "bond": {
      "wu": 3
     }
    },
    "text": "现有材料已经登记，缺失的明细单独标出。吴师傅按清单去补，申请暂时停在补件阶段，材料齐后再转入完整审核。"
   }
  ]
 },
 {
  "id": "x-claim-supplement",
  "day": 0,
  "title": "补件收齐了",
  "person": "wu",
  "body": "吴师傅把补开的费用明细发来了，照片这次能看清。他问：“还差什么？我今天可以再去一趟。”\n你把原来的缺项清单拿出来，对照票据和诊疗记录重新核对。",
  "choices": [
   {
    "label": "逐项核对，齐了转入审核",
    "effect": {
     "skill": 3,
     "bond": {
      "wu": 4
     }
    },
    "text": "票据、明细和诊疗记录已经对上，申请转入审核。你给吴师傅回了进度，告诉他目前不用再跑一趟，有结果会联系他。"
   },
   {
    "label": "请乔姐复核后再转审核",
    "effect": {
     "bond": {
      "qiao": 2,
      "wu": 4
     },
     "integrity": 2
    },
    "text": "乔姐复核后确认材料齐全，申请转入审核。你把这一步记在联系记录里，也回了吴师傅：补件已经收齐，接下来等通知。"
   }
  ]
 },
 {
  "id": "x-claim-result",
  "day": 0,
  "title": "审核结果下来了",
  "person": "wu",
  "body": "审核通知到了：这次按保单约定核定给付 ¥860，停工收入损失没有计入。诊疗记录和费用明细都已核对。\n你打开通知，给吴师傅打电话说明这两项。理赔款归他，不进入你的佣金和业绩。",
  "choices": [
   {
    "label": "把给付依据和未计入的部分讲清",
    "effect": {
     "bond": {
      "wu": 8
     },
     "integrity": 3,
     "mood": 5
    },
    "text": "吴师傅听完说：“行，手里这几张票我还留着。”你说明后续事项和复核途径，把通知发给他。报案、材料、补件到结果，这次协助办完了。"
   },
   {
    "label": "先问他哪里没看懂，再逐项解释",
    "effect": {
     "bond": {
      "wu": 7
     },
     "skill": 3,
     "mood": 5
    },
    "text": "吴师傅主要问停工那几天。你对照通知解释了责任范围和复核途径，他说这次明白怎么核算了。结果已告知，这次协助可以结案。"
   }
  ]
 }
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
 const event=structuredClone(original),d=decision(s,{'x-family':'d2','x-plan':'d10','x-lin':'d21'}[event.id]);
 if(event.id==='x-family'&&d){
  if(d.choice===1){
   event.body='许嘉转来一条活动邀请：“我没留过号码，是不是你交的？”\n你翻到那张填满的亲友表，号码确实从这里交了出去。他说以后这种事先问本人，今天得把这件事处理一下。';
   event.choices[0].label='说明情况并道歉，联系营业部撤下号码';
   event.choices[0].text='你给许嘉说明情况，联系营业部撤下未经同意的号码，也通知相关亲友可以拒绝邀请。许嘉说以后先问他，这次的联系意见已经补好。';
   event.choices[1].label='问清不愿被联系的人，先补好拒联记录';
   event.choices[1].text='你问清许嘉和相关亲友的意见，把不愿接受业务联系的记录补上，并交给营业部处理。许嘉让你办好后告诉他一声，这几项有了明确的处理办法。';
  }else event.body='许嘉听说有亲戚收到营业部的活动电话，问你有没有把他的号码也填进去。\n你说那天只填了愿意继续联系的人，许嘉的号码没交。他回：“那就行。以后要留我电话，先问我一声。”';
 }
 if(event.id==='x-plan'&&d){
  if(d.choice===0){
   event.body='主管把一条新咨询转给你看：“前十天报的和实际记录接得上，这次想先让你接。”\n对方只想问清范围，还没有选产品。你看了问题，得先判断自己能答哪些、哪些要找乔姐。';
   event.choices[0].label='确认能接的问题，再接下咨询';
   event.choices[0].text='你说明准备情况和需要协助的地方，主管同意按这个办法联系。前面按实际填表，这次他能照着记录判断把什么事交给你。';
  }else{
   event.body='主管原本给你留了新咨询的接洽时段，看计划才发现你报的几笔还没落实。那时你把仍在考虑的人也算了进去。\n“你这几笔若都要跟，这个时段就排不开。”他先把新咨询交给别人，让你今天把已答应的联系重新安排好。';
   event.choices[0].label='联系原来约过的人，确认安排';
   event.choices[0].text='你把仍要联系、暂时不考虑和已经另约时间的人逐个确认，空出的时段重新排好。这条新咨询由同事接，自己答应的几件事没有再挤在同一时间。';
   event.choices[1].label='请主管教你怎么估计接洽时间';
   event.choices[1].text='主管拿一条联系举例，让你把查资料、回复和来回确认的时间都算进去。你重排了自己的安排，这次知道不能只凭预计金额把时段占满。';
  }
 }
 if(event.id==='x-lin'&&d){
  if(d.choice===0){
   event.body='小满说姐姐把账重新算过了，也听明白了后续安排。昨天那通电话，终于没再停在“以后再说”。\n“她有个朋友想咨询，已经同意被联系。我姐自己的事我接着办，朋友这边你愿意接吗？”小满问。';
   event.choices[0].label='先确认同意联系，再接朋友的咨询';
   event.choices[0].text='小满另行确认那位朋友愿意咨询，也问了方便联系的时间。姐姐这边仍由她继续服务，分工说清了，新的联系再按对方的意愿开始。';
   event.choices[1].label='先不接新咨询，让小满自己安排';
   event.choices[1].text='你让小满先把姐姐的后续办好，新咨询另找能接的人。她说行，自己回电话确认。这次你帮她理清分工，没有代她答应额外的事。';
  }else{
   event.body='小满说姐姐的问题还没回完，今天不能再拖。乔姐已经把资料核实好，她请你坐旁边，听她把那通电话打完。\n姐姐接起电话先问：“当时怎么没讲这一项？”小满没有按掉免提，等着回答。';
   event.choices[0].label='陪她把话说完，让姐姐自己决定';
   event.choices[0].text='小满说明当时漏讲了期限，把核实后的内容重新解释。姐姐说要再想想，她答应等对方决定，不再催。电话终于打完，之后有答复由她自己接着办。';
   event.choices[1].label='提醒她先听完，再让她自己回答';
   event.choices[1].text='你示意小满先别急着解释。她听完姐姐担心什么，再把核实后的内容说清，约好后续由自己回复。这通电话没有再留到明天。';
  }
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
 return '理赔进度：'+labels[claim.stage]+(claim.stage==='closed'?'。理赔款属于客户，不计入个人现金或业绩。':`。第 ${claim.due} 天起继续跟进，记录可在消息和日记中查看。`);
}
