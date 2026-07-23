(() => {
  'use strict';

  const BUILD = '20260723-v9';
  const APK_FACTS = {
    apkDate: '2026-07-03',
    unity: '2021.3.11f1',
    rechargeTiers: [6, 30, 68, 128, 328, 648, 998, 1998],
    sourceTables: [
      'cfg_act_type', 'cfg_act_new_trial', 'cfg_act_recharge', 'cfg_acc_pay',
      'cfg_acc_consume', 'cfg_act_discount_shop', 'cfg_act_battle_pass',
      'cfg_act_limit_free', 'cfg_act_gold_crazy', 'cfg_pay', 'actWeekly'
    ]
  };

  const activities = [
    {
      id: 'new-trial', name: '新服试炼 / 领主试炼', type: '开服', priority: 'S', spend: '免费为主',
      source: 'cfg_act_new_trial · BenefitNewTrialView',
      facts: [
        '客户端配置包含7日任务结构，任务覆盖主殿、攻城、军务、英雄突破、产业、技能和资源消耗。',
        '配置中存在金币消耗500、1000、2000、3000、5000、10000档，以及银币消耗最高500万档。',
        '每完成1个任务累计1个狂欢礼包；活动结束未领取奖励会通过邮件补发。'
      ],
      guide: [
        '前6天只完成自然推进能覆盖的任务，不要为了单个礼包提前透支金币。',
        '消费类任务集中到最后1—2天，与折扣商店、累计消费、限时免单叠加完成。',
        '主殿、产业和英雄培养任务优先做，通常能同时推进七日开荒和战令。'
      ],
      avoid: '不要第一天看到消费任务就立刻花满。活动后段经常出现更高价值的叠加入口。'
    },
    {
      id: 'seven-login', name: '七日登录', type: '开服', priority: 'S', spend: '免费',
      source: 'cfg_act_type ID 6004 · BenefitSevenLoginView',
      facts: ['APK 内置独立七日登录界面与奖励渲染器。', '属于开服期基础福利，按日领取。'],
      guide: ['每天上线先领取，再处理日常任务。', '漏登后先检查是否支持补签或邮件补发，不要直接放弃整轮奖励。'],
      avoid: '不要把七日登录和七日充值混为一项；前者通常不要求付费。'
    },
    {
      id: 'hero-reset', name: '英雄重置', type: '养成', priority: 'S', spend: '免费/低损耗',
      source: 'cfg_act_type ID 6005 · BenefitSevenHeroResetView',
      facts: [
        '开服前7天可随时重置英雄，保留星级，返还全部培养道具和100%已消耗银币。',
        '符文和装备会回到仓库。',
        '开服7天后每8天开启1天，银币仅退还50%。'
      ],
      guide: ['前7天大胆测试2—3套核心阵容，最终在第7天结束前完成收口。', '优先重置被替代的副C或临时过渡英雄，主力核心不要频繁来回切换。'],
      avoid: '第7天后再重置会损失一半银币；准备换阵容时提前截图并核对装备、符文位置。'
    },
    {
      id: 'free-order', name: '限时免单', type: '消费', priority: 'S', spend: '金币',
      source: 'cfg_act_type ID 1005 · cfg_act_limit_free',
      facts: [
        '开放时段为12:00—14:00、18:00—次日06:00。',
        '单次购买触发免单概率为20%。',
        '同一商品30次以内必定触发一次免单。'
      ],
      guide: ['把必须购买的折扣商品放到开放时段购买。', '先买长期刚需且单价合理的商品，利用免单降低平均成本。', '需要完成累计消费时，优先在本活动开放期间进行。'],
      avoid: '“30次内必出”不代表第30次前的总投入一定划算；低价值商品不要为保底强行买满。'
    },
    {
      id: 'magic-gate', name: '魔法之门', type: '消费', priority: 'A', spend: '金币',
      source: 'cfg_act_type ID 4003',
      facts: [
        '购买银币会附赠开启魔法之门的机会，每天还有免费次数。',
        '购买次数达到阶段要求可获得额外奖励。',
        '每次开启获得25点魔力值，可在魔力商店兑换；活动结束魔力值清空。'
      ],
      guide: ['先用完每日免费次数，再决定是否购买。', '只冲能够完整拿到阶段奖励的档位，避免停在阶段线前。', '魔力值优先换稀缺的定向养成材料，不换可日常刷取的基础资源。'],
      avoid: '活动结束魔力值会清空，最后一天必须完成兑换。'
    },
    {
      id: 'crystal', name: '水晶占卜', type: '充值', priority: 'A', spend: '充值联动',
      source: 'cfg_act_type ID 4004 · BenefitLimitChooseDrawView',
      facts: [
        '首次占卜免费。',
        '奖励池由玩家从3个奖池中自行选择，开始占卜后本轮不可再调整。',
        '活动期间每充值满500金币获得1次占卜机会。',
        '占卜次数和未使用次数在活动结束后清除。'
      ],
      guide: ['免费抽之前先把奖池配置好，最高稀缺度奖励放入允许的核心位置。', '充值只做到既定预算档，不要为了“差一次”临时抬高预算。', '额外次数最后一天全部用完。'],
      avoid: '第一次占卜后不能重选奖池；确认配置前不要点击开始。'
    },
    {
      id: 'gold-carnival', name: '金币狂欢', type: '充值', priority: 'S', spend: '充值后投金币',
      source: 'cfg_act_type ID 6002 · cfg_act_gold_crazy',
      facts: [
        '累计充值达到指定额度可获得抽取次数。',
        '投入金币后按倍率返还，配置声明稳赚不赔。',
        '倍率概率：10倍8.7%、6倍13.9%、3.5倍9.5%、2.5倍9.0%、1.5倍16.0%、1.1倍42.0%。',
        '最多抽3次必出10倍；活动结束剩余次数清零。'
      ],
      guide: ['已有充值计划时优先把充值放在金币狂欢周期，获取额外返利。', '拿到次数后尽快完成，不要留到活动结束。', '金币投入量以不影响主殿、技能和日常周转为底线。'],
      avoid: '“稳赚不赔”只针对投入金币的倍率返还，不代表为获得次数而新增充值一定划算。'
    },
    {
      id: 'cumulative-recharge', name: '累计充值', type: '充值', priority: 'A', spend: '多档累计',
      source: 'cfg_acc_pay · cfg_act_sum_recharge',
      facts: [
        '客户端配置存在500、1000、2000、5000、10000、20000、30000、50000等累计充值值梯度。',
        '充值商品档位包含6、30、68、128、328、648、998、1998元。',
        '活动奖励随活动批次变化，站内不把历史配置奖励当成当前服固定奖励。'
      ],
      guide: ['先确定最终预算档，再倒推每天或每轮充值，不要逐档临时加码。', '优先与首充叠加、连续充值、水晶占卜、金币狂欢同时覆盖。', '距离下一档较远时立即停止，保留预算等下一期活动。'],
      avoid: '客户端存在大量历史活动批次，同一门槛的奖励可能随区服和周期变化，以当前活动界面为准。'
    },
    {
      id: 'single-recharge', name: '单笔充值 / 特惠充值', type: '充值', priority: 'A', spend: '指定单笔',
      source: 'cfg_act_recharge · cfg_pay',
      facts: ['常见充值商品档位：6、30、68、128、328、648、998、1998元。', '单笔奖励通常要求一次购买指定档位，拆分充值可能不计入。'],
      guide: ['活动要求“单笔”时直接选对应商品，不要用多次小额凑总额。', '先检查该档位能否同时计入累充、连充和占卜次数。', '低预算优先6/30/68元能够触发多重奖励的档。'],
      avoid: '单笔充值和累计充值的判定不同；付款前先看活动条件文字。'
    },
    {
      id: 'continue-pay', name: '连续充值', type: '充值', priority: 'A', spend: '连续多日',
      source: 'cfg_continue_pay · BenefitSevenPayContinueView',
      facts: ['APK 包含七日连续充值和周常连续充值界面。', '配置存在按连续天数判定的奖励节点。'],
      guide: ['决定参与后，从第一天开始保持最低有效档，最后一天再判断是否补高档。', '设每日提醒，避免中途断签导致前期投入无法拿满终点奖励。'],
      avoid: '无法保证连续登录或预算不确定时，不建议在第一天启动高档连续充值。'
    },
    {
      id: 'cumulative-consume', name: '累计消费', type: '消费', priority: 'A', spend: '金币',
      source: 'cfg_acc_consume · BenefitWonderfulConsumeView',
      facts: ['客户端存在300、800、1500、3000、5000、10000、20000、30000等常见消费梯度。', '活动统计通常为活动期内消耗金币，不等同于充值金额。'],
      guide: ['把英雄抽取、折扣商店、主殿资源补缺等计划消费集中到活动期。', '消费前先列刚需清单；只为跨过距离很近的奖励档补消费。', '与限时免单同时进行，提高同一批金币的综合回报。'],
      avoid: '不要购买低价值物品硬凑高档；奖励价值必须高于额外消费机会成本。'
    },
    {
      id: 'discount-shop', name: '折扣商店 / 异域商队', type: '商店', priority: 'A', spend: '金币',
      source: 'cfg_act_discount_shop · cfg_act_type ID 3001/4005',
      facts: ['APK 配置包含数百个折扣商品批次、限购次数、原价和折扣价。', '异域商队文案为“强化物资，逆天折扣限量开启”。'],
      guide: ['优先顺序：定向英雄/稀缺召唤道具 > 高级技能与觉醒材料 > 通用养成材料 > 银币粮草。', '折扣只代表相对原价，仍需比较当前阶段是否刚需。', '限购商品先买低次数高稀缺项，再处理基础资源。'],
      avoid: '不要因为显示高折扣就清空商店；大量基础资源仍可通过日常玩法获得。'
    },
    {
      id: 'port-trade', name: '港口贸易', type: '长期卡', priority: 'S', spend: '一次开通',
      source: 'cfg_act_type ID 2002',
      facts: ['客户端文案：开通后持续20天，领取标称价值36000金币的物资。'],
      guide: ['准备连续活跃20天的低中氪玩家优先级较高。', '开通越早，越能覆盖开服主殿、技能和英雄培养周期。', '购买前确认奖励是每日手领还是自动发放。'],
      avoid: '无法持续登录时实际领取价值会明显下降。'
    },
    {
      id: 'battle-pass', name: '战令', type: '长期卡', priority: 'S', spend: '通行证',
      source: 'cfg_act_battle_pass · BenefitBattlePassPanel',
      facts: ['APK 内置多类战令等级、免费轨和付费轨配置。', '战令进度与长期活跃任务绑定。'],
      guide: ['先确认本期能达到高等级，再购买付费轨。', '中后期购买通常可追溯领取已解锁奖励，可先观察自己的进度速度。', '日常和新服试炼任务尽量同步完成。'],
      avoid: '赛季剩余时间不足、等级明显无法做满时，不建议只为前几级奖励购买。'
    },
    {
      id: 'level-gift', name: '升级豪礼 / 等级礼包', type: '成长', priority: 'B', spend: '按等级解锁',
      source: 'cfg_act_level_gift · BenefitLevelGiftPanel',
      facts: ['APK 内置按条件/等级开放的礼包配置。'],
      guide: ['只买当前卡点所需材料，不要提前囤积短期内用不到的包。', '升级礼包应与主殿冲级、战令和新服试炼的阶段目标一起评估。'],
      avoid: '礼包“原价”不是实际价值，基础资源占比过高时优先级下降。'
    },
    {
      id: 'high-spend', name: '神话降临 / 神铸遗迹 / 金狮套装', type: '高阶', priority: 'B', spend: '中高预算',
      source: 'cfg_act_type ID 5001/6009/6010 · BenefitGodCastingPanel',
      facts: ['APK 中存在神话英雄、神铸商店、稀有装备和套装活动的独立界面与配置。'],
      guide: ['只有在明确主力英雄和长期阵容后再投入。', '优先追确定性兑换或保底，不追无上限随机结果。', '先计算距离关键英雄/套装成型还差多少，不做半成品投入。'],
      avoid: '高阶活动最容易形成沉没成本；无法达到保底或成套节点时及时停止。'
    }
  ];

  const paidResourceAdvice = {
    '银币': ['不建议原价直购', '优先：港口贸易、战令、折扣资源包', '冲榜或主殿卡点时再补缺口'],
    '金币': ['优先：首充叠加、港口贸易、金币狂欢', '消费尽量叠加累计消费和限时免单', '保留一部分金币做活动周转'],
    '粮草': ['优先通过日常与活动礼包获取', '仅在连续攻城且自然产出不足时购买', '不建议为囤积大量单独充值'],
    '黑铁': ['主殿或装备明确卡点时购买', '只选高折扣限购包', '避免超前囤积'],
    '木材': ['主殿冲级卡点再补', '优先折扣商店与战令附带资源', '日常阶段不建议原价购买'],
    '英雄碎片': ['优先定向英雄、保底兑换', '随机抽取只做计划档位', '不要为非核心英雄追高'],
    '经验': ['不建议单独付费', '通过无尽试炼、战令和新服任务获取', '培养资源先集中主队'],
    '功勋': ['原则上不建议付费购买', '优先军务、建设、战功等稳定来源'],
    '英雄请帖': ['限时礼包、单笔充值叠加、战令优先', '先看是否接近保底或定向节点'],
    '圣光密函': ['高价值但成本较高', '只在传奇保底或定向活动期购买', '预算不足时不追高档累充']
  };

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route = () => { try { return decodeURIComponent(location.hash.slice(1) || 'home'); } catch { return location.hash.slice(1) || 'home'; } };

  function addStyles() {
    if ($('#activityGuideStyles')) return;
    const style = document.createElement('style');
    style.id = 'activityGuideStyles';
    style.textContent = `
      .act-guide-head{position:relative;overflow:hidden;padding:24px;border:1px solid #bfd9e9;border-radius:12px;background:linear-gradient(135deg,#fff 0%,#edf8ff 62%,#dbeffd 100%);box-shadow:0 10px 28px rgba(27,82,116,.08)}
      .act-guide-head:after{content:'EVENT';position:absolute;right:12px;top:-22px;font-size:86px;font-weight:900;color:rgba(19,126,190,.06)}
      .act-guide-head h1{position:relative;margin:8px 0;font-size:28px}.act-guide-head p{position:relative;max-width:800px;margin:0;color:#536b7c;line-height:1.8}
      .act-guide-badge{position:relative;display:inline-flex;padding:4px 9px;border:1px solid #bcdcf0;border-radius:999px;background:#e7f5ff;color:#126eaa;font-size:11px;font-weight:700}
      .act-guide-stats{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:17px}.act-guide-stat{padding:11px;border:1px solid #cfe2ee;border-radius:8px;background:rgba(255,255,255,.82);text-align:center}.act-guide-stat strong{display:block;color:#1178b8;font-size:20px}.act-guide-stat span{font-size:10px;color:#6c7d8b}
      .act-guide-toolbar{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0}.act-filter{padding:7px 11px;border:1px solid #c5dce9;border-radius:7px;background:#fff;color:#45657a;font-size:12px}.act-filter.active,.act-filter:hover{border-color:#168ed0;background:#168ed0;color:#fff}
      .act-budget-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-bottom:15px}.act-budget{padding:13px;border:1px solid #d2e3ec;border-radius:9px;background:#fff}.act-budget strong{display:block;margin-bottom:6px;color:#1c5f88}.act-budget p{margin:0;color:#647987;font-size:11px;line-height:1.7}
      .act-guide-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.act-guide-card{padding:16px;border:1px solid #cbdde8;border-radius:10px;background:#fff;box-shadow:0 5px 16px rgba(24,75,105,.05)}.act-guide-card.hidden{display:none}.act-guide-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.act-guide-card h2{margin:10px 0 5px;font-size:18px}.act-guide-source{margin:0 0 12px;color:#81919c;font-size:10px}.act-chip{display:inline-flex;padding:3px 7px;border-radius:999px;background:#edf7fc;color:#267ba8;font-size:10px}.act-priority{margin-left:auto;padding:3px 7px;border-radius:5px;background:#eaf8ef;color:#24824a;font-size:10px;font-weight:800}.act-priority.p-B{background:#fff5df;color:#9a6814}
      .act-guide-card h3{margin:12px 0 6px;padding-bottom:5px;border-bottom:1px solid #e5edf2;font-size:13px}.act-guide-card ul{margin:0;padding-left:18px;color:#526b7b;font-size:12px;line-height:1.75}.act-avoid{margin-top:11px;padding:9px 11px;border-left:3px solid #d99b35;background:#fff9ec;color:#6c5a38;font-size:11px;line-height:1.7}
      .act-raw-note{margin-top:15px;padding:14px 16px;border:1px solid #cde0eb;border-radius:9px;background:#f8fcfe;color:#526c7c;font-size:12px;line-height:1.8}.act-raw-note strong{color:#1c668f}
      .paid-guide-pills{display:flex!important;flex-wrap:wrap;gap:5px}.paid-guide-pill{padding:4px 7px;border:1px solid #ead9b7;border-radius:999px;background:#fffaf0;color:#815e20;font-size:10px}
      @media(max-width:900px){.act-guide-grid{grid-template-columns:1fr}.act-budget-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:620px){.act-guide-head{padding:18px}.act-guide-head h1{font-size:23px}.act-guide-stats{grid-template-columns:repeat(2,1fr)}.act-budget-grid{grid-template-columns:1fr}.act-guide-card{padding:13px}}
    `;
    document.head.appendChild(style);
  }

  function addNav() {
    const left = $('#leftSidebar');
    if (left && !left.querySelector('[data-activity-guide-link]')) {
      const groups = $$('.side-group', left);
      const group = groups.find(g => g.querySelector('.side-group-title')?.textContent.includes('系统资料')) || groups[0];
      if (group) {
        const a = document.createElement('a');
        a.className = 'side-link';
        a.href = '#activity-guide';
        a.dataset.activityGuideLink = '1';
        a.dataset.match = 'activity-guide';
        a.innerHTML = `<span class="icon">✷</span>活动攻略<span class="count">${activities.length}</span>`;
        group.appendChild(a);
      }
    }
    const top = $('.top-links');
    if (top && !top.querySelector('[data-activity-guide-top]')) {
      const a = document.createElement('a');
      a.href = '#activity-guide';
      a.dataset.activityGuideTop = '1';
      a.textContent = '活动攻略';
      top.appendChild(a);
    }
  }

  function renderCard(a) {
    return `<article class="act-guide-card" data-type="${esc(a.type)}">
      <div class="act-guide-top"><span class="act-chip">${esc(a.type)}</span><span class="act-chip">${esc(a.spend)}</span><span class="act-priority p-${esc(a.priority)}">优先级 ${esc(a.priority)}</span></div>
      <h2>${esc(a.name)}</h2><p class="act-guide-source">APK 来源：${esc(a.source)}</p>
      <h3>客户端规则</h3><ul>${a.facts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      <h3>玩家攻略</h3><ul>${a.guide.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      <div class="act-avoid"><strong>避坑：</strong>${esc(a.avoid)}</div>
    </article>`;
  }

  function renderPage() {
    const main = $('#mainContent');
    if (!main) return;
    const types = ['全部', ...new Set(activities.map(x=>x.type))];
    main.innerHTML = `
      <header class="act-guide-head">
        <span class="act-guide-badge">Unity ${APK_FACTS.unity} · 客户端活动配置</span>
        <h1>活动攻略与付费规划</h1>
        <p>根据当前线上 APK 的活动类型表、充值表、累计消费表、新服试炼表、折扣商店表和战令表整理。客户端规则与玩家建议分开展示；具体奖励内容和开放日期仍以当前区服活动界面为准。</p>
        <div class="act-guide-stats"><div class="act-guide-stat"><strong>${activities.length}</strong><span>活动攻略</span></div><div class="act-guide-stat"><strong>11</strong><span>核心配置表</span></div><div class="act-guide-stat"><strong>${APK_FACTS.rechargeTiers.length}</strong><span>充值商品档位</span></div><div class="act-guide-stat"><strong>7日</strong><span>新服试炼周期</span></div></div>
      </header>
      <nav class="act-guide-toolbar">${types.map((x,i)=>`<button class="act-filter ${i===0?'active':''}" data-act-filter="${esc(x)}">${esc(x)}</button>`).join('')}</nav>
      <section class="act-budget-grid">
        <div class="act-budget"><strong>零氪</strong><p>七日登录、新服试炼、英雄重置、每日免费次数。金币只用于确定性成长。</p></div>
        <div class="act-budget"><strong>低氪</strong><p>首充叠加、港口贸易、可完成的战令；充值尽量覆盖2—3个活动。</p></div>
        <div class="act-budget"><strong>中氪</strong><p>累充定档，叠加单笔/连充/占卜/金币狂欢；折扣商店只买稀缺项。</p></div>
        <div class="act-budget"><strong>高氪</strong><p>先确定保底和成套目标，再参与神话、神铸和套装活动，拒绝无上限追抽。</p></div>
      </section>
      <div class="act-guide-grid" id="activityGuideGrid">${activities.map(renderCard).join('')}</div>
      <div class="act-raw-note"><strong>数据边界：</strong>APK 内含大量历史活动批次和多区服配置。站内可以确认活动机制、门槛结构和客户端文案，但不能把旧批次奖励直接当作当前区服奖励。充值前请以游戏内正在展示的奖励和剩余时间为最终依据。<br><strong>已解析表：</strong>${APK_FACTS.sourceTables.map(esc).join('、')}。</div>`;

    $$('.act-filter', main).forEach(btn => btn.addEventListener('click', () => {
      $$('.act-filter', main).forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.actFilter;
      $$('.act-guide-card', main).forEach(card => card.classList.toggle('hidden', type !== '全部' && card.dataset.type !== type));
    }));
    if ($('#rightSidebar')) $('#rightSidebar').innerHTML = `<section class="right-card"><div class="right-card-title">活动速查</div><div class="right-card-body mini-links"><a href="#activity-guide">全部活动</a><a href="#activities">开服活动旧资料</a><a href="#resources">资源规划</a><a href="#apk/catalog">APK配置目录</a></div></section><section class="right-card"><div class="right-card-title">充值商品档位</div><div class="right-card-body"><p class="profile-desc">${APK_FACTS.rechargeTiers.join(' / ')} 元</p><p class="profile-desc">档位来自客户端 cfg_pay；是否开放、首充倍率和奖励以当前服为准。</p></div></section>`;
    main.setAttribute('aria-busy','false');
    window.scrollTo({top:0,behavior:'auto'});
  }

  function patchResourceAdvice() {
    if (!route().startsWith('resources')) return;
    const candidates = $$('.resource-card, .resource-item, .wiki-section .section-body > article, .wiki-section .section-body > div');
    candidates.forEach(card => {
      const title = card.querySelector('h1,h2,h3,strong')?.textContent?.trim();
      const advice = paidResourceAdvice[title];
      if (!advice || card.dataset.paidGuidePatched) return;
      const nodes = [...card.querySelectorAll('*')].filter(x => x.children.length === 0 && x.textContent.trim() === '资料未列出');
      nodes.forEach(node => {
        node.className = `${node.className || ''} paid-guide-pills`.trim();
        node.innerHTML = advice.map(x=>`<span class="paid-guide-pill">${esc(x)}</span>`).join('');
      });
      card.dataset.paidGuidePatched = '1';
    });
  }

  function handleRoute() {
    addStyles(); addNav();
    if (route() === 'activity-guide') setTimeout(renderPage, 0);
    else setTimeout(patchResourceAdvice, 60);
  }

  window.DGXS_ACTIVITY_GUIDE = {build:BUILD, activities, facts:APK_FACTS};
  window.addEventListener('hashchange', handleRoute);
  const observer = new MutationObserver(() => { addNav(); patchResourceAdvice(); });
  observer.observe(document.body, {childList:true, subtree:true});
  handleRoute();
})();
