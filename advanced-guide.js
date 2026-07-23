(() => {
  'use strict';

  const BUILD = '20260723-v10';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route = () => { try { return decodeURIComponent(location.hash.slice(1) || 'home'); } catch { return location.hash.slice(1) || 'home'; } };

  const systems = [
    {
      id:'draw', group:'养成', icon:'✦', title:'招募、积分与保底', priority:'S',
      source:'cfg_draw · cfg_draw_reward · cfg_draw_god · cfg_items',
      facts:[
        '每日征召单次消耗2,000银币，配置积分为5。',
        '力邀强者可消耗10张英雄请帖或360金币，配置积分为20。',
        '狂揽群雄可消耗1封圣光密函或1,500金币，配置积分为200。',
        '每满1,000积分可进行一次积分召集，必定获得且只获得1个觉醒道具。',
        '符文鉴定单抽50金币、十抽450金币，相当于十抽节省50金币。'
      ],
      guide:[
        '免费银币征召每天先做；英雄请帖和圣光密函优先用于对应招募，不建议直接换成低价值资源。',
        '准备狂揽群雄时尽量一次攒到可跨越积分节点，避免长期停在接近1,000分但拿不到积分召集。',
        '需要符文时优先十连；单抽只用于补最后一次活动任务或测试奖池。',
        '神话抽取配置存在不同批次的200/300次保底参数，必须以当前服活动界面为准。'
      ],
      avoid:'客户端部分普通招募文案仍保留“9999次必出”的占位值，不能当作真实保底。'
    },
    {
      id:'office', group:'成长', icon:'♜', title:'爵位特权解锁顺序', priority:'S',
      source:'cfg_office · cfg_grade_function',
      facts:[
        '藩爵特权“兴建”：建筑队列+1，消耗1,500功勋与32,000银币。',
        '男爵特权“校场”：开启自动招兵，消耗20,000功勋与80,000银币。',
        '男爵特权“爱才”：英雄商店位置+1并必出高级商品，消耗7,500功勋与30,000银币。',
        '勋爵特权“留名”：军务功勋奖励+20%，消耗14,000功勋与35,000银币。',
        '男爵特权“勤政”：每日军务次数+1，消耗18,000功勋与50,000银币。'
      ],
      guide:[
        '开服优先级建议：兴建 > 校场 > 留名/勤政 > 爱才。建筑队列和自动招兵直接减少长期操作成本。',
        '功勋不足时先保爵位晋升条件，不要为了短期资源产量把功勋全部点完。',
        '经常刷英雄商店的玩家再提前点爱才；不频繁刷新商店时可后置。'
      ],
      avoid:'特权消耗功勋，点错会拖慢升爵与主殿上限。每次激活前先检查下一爵位条件。'
    },
    {
      id:'tech', group:'成长', icon:'▤', title:'研究院科技路线', priority:'S',
      source:'cfg_technology',
      facts:[
        '研究院共115项科技。研发速度最高5级，客户端效果值由200提升到1,000，通常对应2%—10%时间缩减。',
        '研发速度5级合计研究时间52,200秒，约14.5小时；粮草、木材、黑铁各消耗450,000。',
        '节省粮草、节省木材、节省黑铁均为10级，效果值最高1,000，通常对应10%消耗降低。',
        '步兵、骑兵、弓兵、法师集训均可升40级，核心作用是提高对应兵种招募速度。'
      ],
      guide:[
        '通用开荒路线：研发速度3级 → 主力兵种战斗科技 → 研发速度5级 → 对应资源节省科技。',
        '只养一支主队时，不要平均点四兵种；先把主将实际携带的前后军兵种做深。',
        '研究时间较长的科技安排在下线前，短科技留在在线期间连续衔接。'
      ],
      avoid:'科技配置中的效果值多采用万分比，站内只在明确可换算时展示百分比。'
    },
    {
      id:'shop', group:'资源', icon:'◇', title:'十类商店兑换优先级', priority:'S',
      source:'cfg_shop · cfg_asset · cfg_items',
      facts:[
        '客户端配置10类商店、848条商品记录。英雄商店与书商来访每日6:00刷新。',
        '英雄商店共248条商品批次，主要使用金币或银币；书商来访共232条商品批次。',
        '竞技商城使用竞技币，王者商店使用英魂，对决商店使用比武奖章。',
        '海盗市场使用失落古币，要塞商店使用要塞硬币，赏金商店使用赏金。',
        '地精杂货铺以银币、粮草、木材、黑铁购买；至臻商店主要使用金币。'
      ],
      guide:[
        '通用优先级：定向主力英雄碎片 > 核心技能碎片 > 觉醒/突破材料 > 装备与符文材料 > 基础资源。',
        '英雄商店和书商每天6点刷新，睡前不要为了清空货币购买非主力碎片。',
        '海盗市场优先形成海盗套装或关键装备，不要把失落古币分散买基础资源。',
        '竞技币、英魂、比武奖章属于专属货币，优先换不可由日常稳定产出的项目。'
      ],
      avoid:'商品表包含不同等级、赛季和历史批次；实际出现的商品与价格以当前角色商店为准。'
    },
    {
      id:'equip', group:'养成', icon:'⚒', title:'装备打造与升阶', priority:'A',
      source:'cfg_hero_equip · cfg_equip · cfg_equip_refine · cfg_items',
      facts:[
        '常规装备1—4阶打造成功率依次为65%、55%、45%、35%。',
        '对应立即完成金币消耗示例为420、540、660、780金币。',
        '武器基础打造消耗60,000黑铁与20秘银；圣衣消耗30,000银币与20名贵布料。',
        '骑宠消耗60,000粮草与20兽语书；饰品消耗60,000木材与20洗石剂。',
        '宝物基础打造同时消耗60,000木材、60,000黑铁与20鉴别手套。'
      ],
      guide:[
        '前期先做主力英雄的一套可用装备，不要多英雄同时冲高阶。',
        '1—2阶成功率较高，可作为开荒阶段；3—4阶材料与失败成本明显上升，优先留给核心装备。',
        '金币立即完成只缩短时间，不直接提高成功率；非冲榜阶段建议使用自然计时。',
        '附魔材料按装备部位区分，提前锁定主力装备，避免附魔水晶分散。'
      ],
      avoid:'升阶失败返还和保护机制可能随装备类型变化，执行高阶升阶前先查看当次界面的失败返还说明。'
    },
    {
      id:'rune', group:'养成', icon:'◈', title:'符文共鸣与元素路线', priority:'A',
      source:'cfg_hero_rune · cfg_draw_reward · cfg_recycle',
      facts:[
        '符文共鸣总等级达到4/8/16/24级时，基础攻击、防御、兵力分别提升5%/10%/20%/40%。',
        '单元素体系需要10枚对应元素；双元素体系通常需要5+5；四色元素冲击需要风火水地各3枚。',
        '风系偏不良状态与减攻，火系偏英雄技能连续增伤，水系偏恢复，地系偏护盾。',
        '风+火偏持续增伤，火+水偏英雄技能攻防，水+地偏续航，风+地偏不良状态护盾。'
      ],
      guide:[
        '先保证全队共鸣达到4级和8级，再追求完美元素；早期共鸣收益更稳定。',
        '高频释放英雄技能的阵容优先火系；恢复与拖回合阵容优先水系；控制阵容考虑风系。',
        '不要把高品质符文仅作为经验吞掉，先检查元素和稀有属性是否适配第二队。'
      ],
      avoid:'混合元素需要满足数量门槛才生效，未成型前可能不如单元素或共鸣提升。'
    },
    {
      id:'arena', group:'PVP', icon:'⚔', title:'竞技次数与赛季结算', priority:'A',
      source:'cfg_arena · cfg_rank · cfg_rank_rewards · cfg_season',
      facts:[
        '竞技场额外次数前10次价格依次为50、50、75、75、100、100、125、125、150、150金币。',
        '夏季21:00结算无尽试炼排行榜。',
        '秋季14:00开启统帅对决；15:30—16:00可支持进入八强的统帅。',
        '冬季21:00进行论功行赏；冬季22:00按荣耀排行榜结算年度奖励。',
        '秋季结束后会执行年税，将城镇储存的金币、银币、粮草上缴阵营库存。'
      ],
      guide:[
        '只差少量积分跨奖励档时，优先购买前2次50金币机会；越往后边际成本越高。',
        '结算日前集中挑战，而不是每天无目标买满次数。',
        '冬季结算前优先完成荣耀和阵营功绩；论功行赏依赖年度综合功绩，不只看单次战斗。'
      ],
      avoid:'赛季配置记录的是客户端计划节点，开服加速服或运营调整可能改变实际时间。'
    },
    {
      id:'next', group:'待整理', icon:'↗', title:'下一批仍可继续做的攻略', priority:'B',
      source:'cfg_govern_mission · cfg_kingdom_mission · cfg_treasure · cfg_achievement · cfg_god_war',
      facts:[
        '政务系统包含24类任务、星级与宝箱奖励，可制作“政务刷新值不值”计算。',
        '阵营任务包含70条主任务与100条子任务，可整理国家协作和功勋效率。',
        '奥德赛宝物与海盗配置包含海盗团加成、掠夺和刷新成本，可制作藏宝图路线。',
        '成就配置包含30类成就与年度结算奖励，可整理隐藏长期目标。',
        '天启战配置包含城池、阶段、积分奖励和战前任务，可制作完整时间线。'
      ],
      guide:[
        '下一轮优先产出：天启战时间线、政务刷新攻略、海盗藏宝图兑换、年度成就目标。',
        '这些页面将继续区分“客户端规则”和“玩家建议”，历史批次奖励不会冒充当前奖励。'
      ],
      avoid:'部分系统配置量很大，需要与道具表和当前服开放状态交叉校验后再给出兑换价值。'
    }
  ];

  const shopRows = [
    ['英雄商店','248','金币 / 银币','每日6:00','主力英雄碎片；“爱才”增加位置并必出高级商品'],
    ['书商来访','232','金币 / 银币','每日6:00','核心英雄技能、辅助技能；“传授”增加高级商品'],
    ['竞技商城','13','竞技币','按玩法刷新','定向稀缺材料优先'],
    ['王者商店','54','英魂','按玩法刷新','主力英雄与高价值养成材料'],
    ['地精杂货铺','64','银币/粮草/木材/黑铁','手动刷新','只补明确卡点，不清空基础资源'],
    ['至臻商店','146','金币','手动刷新','高稀缺限购项，拒绝低价值原价资源'],
    ['对决商店','39','比武奖章','按赛季刷新','不可替代的装备/英雄项目'],
    ['海盗市场','27','失落古币','按海域玩法','海盗套装和关键装备优先'],
    ['要塞商店','17','要塞硬币','按玩法刷新','根据主队缺口定向换取'],
    ['赏金商店','8','赏金','按玩法刷新','加速与稀缺奖励优先']
  ];

  function addStyles() {
    if ($('#advancedGuideStyles')) return;
    const s=document.createElement('style'); s.id='advancedGuideStyles';
    s.textContent=`
      .adv-head{position:relative;overflow:hidden;padding:25px;border:1px solid #bfd9e9;border-radius:12px;background:linear-gradient(135deg,#fff,#ecf8ff 60%,#d9effd);box-shadow:0 10px 28px rgba(27,82,116,.08)}.adv-head:after{content:'130 TABLES';position:absolute;right:12px;top:-15px;font-size:70px;font-weight:900;color:rgba(19,126,190,.055)}.adv-head h1{position:relative;margin:8px 0;font-size:29px}.adv-head p{position:relative;margin:0;max-width:820px;color:#526b7c;line-height:1.85}.adv-badge{position:relative;display:inline-flex;padding:4px 9px;border:1px solid #bcdcf0;border-radius:999px;background:#e7f5ff;color:#126eaa;font-size:11px;font-weight:700}.adv-stats{position:relative;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:18px}.adv-stat{padding:10px;border:1px solid #cfe2ee;border-radius:8px;background:rgba(255,255,255,.82);text-align:center}.adv-stat strong{display:block;color:#1178b8;font-size:20px}.adv-stat span{font-size:10px;color:#6c7d8b}
      .adv-toolbar{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0}.adv-filter{padding:7px 11px;border:1px solid #c5dce9;border-radius:7px;background:#fff;color:#45657a;font-size:12px}.adv-filter.active,.adv-filter:hover{border-color:#168ed0;background:#168ed0;color:#fff}.adv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.adv-card{padding:16px;border:1px solid #cbdde8;border-radius:10px;background:#fff;box-shadow:0 5px 16px rgba(24,75,105,.05)}.adv-card.hidden{display:none}.adv-card-top{display:flex;align-items:center;gap:7px}.adv-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#e9f7ff;color:#1685c8;font-size:18px}.adv-card h2{margin:0;font-size:18px}.adv-priority{margin-left:auto;padding:3px 7px;border-radius:5px;background:#eaf8ef;color:#24824a;font-size:10px;font-weight:800}.adv-priority.p-B{background:#fff5df;color:#9a6814}.adv-source{margin:8px 0 12px;color:#81919c;font-size:10px}.adv-card h3{margin:12px 0 6px;padding-bottom:5px;border-bottom:1px solid #e5edf2;font-size:13px}.adv-card ul{margin:0;padding-left:18px;color:#526b7b;font-size:12px;line-height:1.75}.adv-avoid{margin-top:11px;padding:9px 11px;border-left:3px solid #d99b35;background:#fff9ec;color:#6c5a38;font-size:11px;line-height:1.7}.adv-table-wrap{overflow:auto;margin-top:15px;border:1px solid #ccdee8;border-radius:9px;background:#fff}.adv-table{width:100%;border-collapse:collapse;font-size:11px}.adv-table th,.adv-table td{padding:9px 10px;border-bottom:1px solid #e2ebf0;text-align:left;vertical-align:top}.adv-table th{background:#eef7fc;color:#3b6279;white-space:nowrap}.adv-table tr:last-child td{border-bottom:0}.adv-note{margin-top:15px;padding:14px 16px;border:1px solid #cde0eb;border-radius:9px;background:#f8fcfe;color:#526c7c;font-size:12px;line-height:1.8}.adv-note strong{color:#1c668f}
      @media(max-width:980px){.adv-stats{grid-template-columns:repeat(3,1fr)}.adv-grid{grid-template-columns:1fr}}@media(max-width:620px){.adv-head{padding:18px}.adv-head h1{font-size:23px}.adv-stats{grid-template-columns:repeat(2,1fr)}.adv-card{padding:13px}}
    `; document.head.appendChild(s);
  }

  function addNav(){
    const left=$('#leftSidebar');
    if(left&&!left.querySelector('[data-advanced-guide-link]')){
      const groups=$$('.side-group',left); const group=groups.find(g=>g.querySelector('.side-group-title')?.textContent.includes('玩家工具'))||groups[0];
      if(group){const a=document.createElement('a');a.className='side-link';a.href='#advanced-guide';a.dataset.advancedGuideLink='1';a.dataset.match='advanced-guide';a.innerHTML='<span class="icon">◈</span>进阶攻略<span class="count">8</span>';group.appendChild(a);}
    }
    const top=$('.top-links');
    if(top&&!top.querySelector('[data-advanced-guide-top]')){const a=document.createElement('a');a.href='#advanced-guide';a.dataset.advancedGuideTop='1';a.textContent='进阶攻略';top.appendChild(a);}
  }

  function card(x){return `<article class="adv-card" data-group="${esc(x.group)}"><div class="adv-card-top"><span class="adv-icon">${x.icon}</span><h2>${esc(x.title)}</h2><span class="adv-priority p-${esc(x.priority)}">优先级 ${esc(x.priority)}</span></div><p class="adv-source">APK 来源：${esc(x.source)}</p><h3>客户端配置结论</h3><ul>${x.facts.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><h3>玩家执行建议</h3><ul>${x.guide.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><div class="adv-avoid"><strong>注意：</strong>${esc(x.avoid)}</div></article>`;}

  function render(){
    const main=$('#mainContent'); if(!main)return;
    const groups=['全部',...new Set(systems.map(x=>x.group))];
    main.innerHTML=`<header class="adv-head"><span class="adv-badge">线上 APK · Unity 2021.3.11f1 · LuaJIT 配置解包</span><h1>进阶系统攻略</h1><p>继续从客户端配置层整理玩家真正会用到的结论。当前已识别130张配置表，本页优先覆盖抽卡、爵位、科技、商店、装备、符文、竞技与赛季；具体运营奖励仍以当前区服界面为准。</p><div class="adv-stats"><div class="adv-stat"><strong>130</strong><span>配置表</span></div><div class="adv-stat"><strong>848</strong><span>商店商品记录</span></div><div class="adv-stat"><strong>115</strong><span>科技项目</span></div><div class="adv-stat"><strong>408</strong><span>装备升阶记录</span></div><div class="adv-stat"><strong>241</strong><span>符文配置</span></div></div></header><nav class="adv-toolbar">${groups.map((g,i)=>`<button class="adv-filter ${i===0?'active':''}" data-adv-filter="${esc(g)}">${esc(g)}</button>`).join('')}</nav><div class="adv-grid">${systems.map(card).join('')}</div><section class="adv-table-wrap"><table class="adv-table"><thead><tr><th>商店</th><th>商品批次</th><th>主要货币</th><th>刷新</th><th>兑换重点</th></tr></thead><tbody>${shopRows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></section><div class="adv-note"><strong>分析边界：</strong>客户端同时保留历史活动、等级分层和多赛季数据。站内把可确认的机制、成本、阈值与时间点做成攻略，但不会把历史批次奖励直接写成当前服固定奖励。下一批将继续整理天启战、政务刷新、奥德赛藏宝图和年度成就。</div>`;
    $$('.adv-filter',main).forEach(btn=>btn.addEventListener('click',()=>{$$('.adv-filter',main).forEach(x=>x.classList.remove('active'));btn.classList.add('active');const g=btn.dataset.advFilter;$$('.adv-card',main).forEach(x=>x.classList.toggle('hidden',g!=='全部'&&x.dataset.group!==g));}));
    const right=$('#rightSidebar'); if(right)right.innerHTML='<section class="right-card"><div class="right-card-title">进阶攻略入口</div><div class="right-card-body mini-links"><a href="#advanced-guide">系统总览</a><a href="#activity-guide">活动攻略</a><a href="#apk/tech">科技原表</a><a href="#resources">资源规划</a><a href="#apk/catalog">道具任务</a><a href="#activities">新服试炼</a></div></section><section class="right-card"><div class="right-card-title">本轮深挖</div><div class="right-card-body"><p class="profile-desc">抽卡、爵位、科技、商店、装备、符文、竞技与赛季配置已整理为可执行建议。</p></div></section>';
    main.setAttribute('aria-busy','false'); window.scrollTo({top:0,behavior:'auto'});
  }

  function handle(){addStyles();addNav();if(route()==='advanced-guide')setTimeout(render,0);}
  window.DGXS_ADVANCED_GUIDE={build:BUILD,systems};
  window.addEventListener('hashchange',handle);
  new MutationObserver(()=>addNav()).observe(document.body,{childList:true,subtree:true});
  handle();
})();
