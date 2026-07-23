(() => {
  'use strict';
  const D = window.APK_GUIDE_DATA;
  if (!D) return;

  const $ = (s, r=document) => r.querySelector(s);
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nl = (v='') => esc(v).replace(/\n/g,'<br>');
  const route = () => { try { return decodeURIComponent(location.hash.slice(1) || 'home'); } catch { return location.hash.slice(1) || 'home'; } };
  const main = () => $('#mainContent');
  const right = () => $('#rightSidebar');
  const careerOrder = {格斗:1,博学:2,均衡:3};
  const qualityName = {1:'普通',2:'稀有',3:'史诗',4:'传说',5:'神话'};
  const heroAvatarIds = new Set('1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,3001,3002,3003,3004,3005,4001,4002,4003,4004,4005,4006,4007,4008,4010,9001,9005,9020,9021,9022,9103,9110,9117,9119,9121,9122,9123,9124,9125,9127,9998,9999'.split(','));
  const heroPortraitIds = new Set('1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,3001,3002,3003,3004,3005,4001,4002,4003,4004,4005,4006,4007,4008,4010,9001,9004,9005,9020,9021,9022,9101,9102,9103,9125'.split(','));

  function heroImage(h, kind='avatar') {
    const skinId = String(h.skinId || h.id);
    const wantsPortrait = kind === 'portrait';
    const portrait = wantsPortrait && heroPortraitIds.has(skinId);
    if (!portrait && !heroAvatarIds.has(skinId)) {
      return `<span class="apk-hero-fallback" title="APK 中未包含图片">${esc(h.name).slice(0,1)}</span>`;
    }
    const folder = portrait ? 'portraits' : 'avatars';
    const suffix = portrait ? '2' : '1';
    return `<img src="/assets/heroes/${folder}/${skinId}_${suffix}.png" alt="${esc(h.name)}${portrait?'立绘':'头像'}" loading="lazy">`;
  }

  function addStyles() {
    if ($('#apkGuideStyles')) return;
    const style = document.createElement('style');
    style.id = 'apkGuideStyles';
    style.textContent = `
      .apk-source-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border-radius:999px;background:#e7f5ff;border:1px solid #bcdcf0;color:#126eaa;font-size:11px;font-weight:700}
      .apk-hero-callout{margin:0 0 16px;padding:14px 16px;border:1px solid #bcd9eb;border-radius:10px;background:linear-gradient(135deg,#f8fcff,#eaf6fd);display:flex;align-items:center;justify-content:space-between;gap:14px}.apk-hero-callout h3{margin:0 0 4px;font-size:16px}.apk-hero-callout p{margin:0;color:#5f7282;font-size:12px}.apk-hero-callout a{white-space:nowrap}
      .apk-page-head{position:relative;overflow:hidden;padding:24px;border:1px solid #bfd9e9;border-radius:12px;background:linear-gradient(135deg,#fdfefe 0%,#eff8fd 62%,#dceff9 100%);box-shadow:0 10px 28px rgba(27,82,116,.08)}.apk-page-head:after{content:'APK';position:absolute;right:18px;top:-22px;font-size:96px;font-weight:900;color:rgba(19,126,190,.07)}.apk-page-head h1{position:relative;margin:7px 0 8px;font-size:28px}.apk-page-head p{position:relative;margin:0;max-width:740px;color:#536b7c;line-height:1.8}.apk-stats{position:relative;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin-top:18px}.apk-stat{padding:10px;border:1px solid #cfe2ee;border-radius:8px;background:rgba(255,255,255,.8);text-align:center}.apk-stat strong{display:block;font-size:20px;color:#1178b8}.apk-stat span{font-size:10px;color:#6c7d8b}
      .apk-tabs{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0}.apk-tab{display:inline-flex;align-items:center;gap:5px;padding:7px 11px;border:1px solid #c5dce9;border-radius:7px;background:#fff;color:#45657a;font-size:12px;text-decoration:none}.apk-tab:hover,.apk-tab.active{border-color:#168ed0;background:#168ed0;color:#fff}
      .apk-tools{display:flex;align-items:center;gap:8px;margin:0 0 13px}.apk-tools input,.apk-tools select{min-height:36px;border:1px solid #bfd5e2;border-radius:7px;background:#fff;padding:0 11px;color:#24384a}.apk-tools input{flex:1}.apk-result-count{font-size:11px;color:#70818f;white-space:nowrap}
      .apk-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.apk-card{display:block;padding:13px;border:1px solid #cbdde8;border-radius:9px;background:#fff;color:inherit;text-decoration:none;box-shadow:0 4px 13px rgba(24,75,105,.04)}.apk-card:hover{border-color:#7ab9dc;transform:translateY(-1px)}.apk-card h3{margin:5px 0 5px;font-size:15px}.apk-card p{margin:0;color:#637685;font-size:11px;line-height:1.65}.apk-card-top{display:flex;align-items:center;gap:7px}.apk-card-identity{display:grid;grid-template-columns:58px minmax(0,1fr);gap:11px;align-items:center;margin-top:10px}.apk-card-avatar{width:58px;height:58px;overflow:hidden;border:1px solid #bcd8e8;border-radius:10px;background:linear-gradient(145deg,#e8f6fd,#d6ebf6)}.apk-card-avatar img{display:block;width:100%;height:100%;object-fit:cover}.apk-hero-fallback{display:flex;width:100%;height:100%;align-items:center;justify-content:center;color:#5f8196;font-size:23px;font-weight:800}.apk-tag{display:inline-flex;padding:2px 6px;border-radius:999px;background:#edf7fc;color:#267ba8;font-size:10px}.apk-quality{margin-left:auto;color:#b27c1f;font-size:10px}.apk-attrs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:10px}.apk-attrs span{padding:5px 3px;border-radius:5px;background:#f3f8fb;text-align:center;font-size:9px;color:#667c8c}.apk-attrs b{display:block;color:#20384a;font-size:12px}
      .apk-detail{border:1px solid #c4dbe8;border-radius:12px;background:#fff;overflow:hidden}.apk-detail-head{padding:22px;background:linear-gradient(135deg,#f9fdff,#eaf6fc);border-bottom:1px solid #d8e7ef}.apk-detail-identity{display:grid;grid-template-columns:150px minmax(0,1fr);gap:22px;align-items:center}.apk-detail-portrait{width:150px;height:210px;overflow:hidden;border:1px solid #b9d5e5;border-radius:12px;background:linear-gradient(145deg,#e8f6fd,#d6ebf6);box-shadow:0 8px 24px rgba(28,83,116,.12)}.apk-detail-portrait img{display:block;width:100%;height:100%;object-fit:contain}.apk-detail-head h1{margin:8px 0 5px;font-size:30px}.apk-detail-head p{margin:0;color:#566e7e;line-height:1.75}.apk-detail .apk-attrs{max-width:520px}.apk-detail-body{padding:18px}.apk-block{margin:0 0 18px}.apk-block:last-child{margin-bottom:0}.apk-block h2{margin:0 0 9px;padding-bottom:7px;border-bottom:1px solid #e0e9ef;font-size:16px}.apk-pills{display:flex;flex-wrap:wrap;gap:7px}.apk-pill{padding:7px 9px;border:1px solid #cde0eb;border-radius:7px;background:#f8fcfe;font-size:11px}.apk-story{white-space:pre-wrap;color:#415b6e;font-size:13px;line-height:1.9}.apk-list{display:grid;gap:8px}.apk-list-item{padding:12px 13px;border:1px solid #d2e1e9;border-radius:8px;background:#fff}.apk-list-item h3{margin:0 0 5px;font-size:14px}.apk-list-item p{margin:0;color:#5f7381;font-size:11px;line-height:1.7}.apk-list-meta{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:5px}.apk-table-wrap{overflow:auto;border:1px solid #ccdee8;border-radius:9px;background:#fff}.apk-table{width:100%;border-collapse:collapse;font-size:11px}.apk-table th,.apk-table td{padding:9px 10px;border-bottom:1px solid #e2ebf0;text-align:left;vertical-align:top}.apk-table th{position:sticky;top:0;background:#eef7fc;color:#3b6279;white-space:nowrap}.apk-table tr:last-child td{border-bottom:0}.apk-table td p{margin:0;color:#617583;line-height:1.6}.apk-empty{padding:35px;text-align:center;color:#70828e}
      .apk-source-section{margin-top:18px}.apk-source-section .section-body{padding:16px}.apk-source-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-bottom:13px}.apk-source-grid div{padding:9px;border:1px solid #d5e5ed;border-radius:7px;background:#f8fcfe;text-align:center}.apk-source-grid small{display:block;color:#71828d;font-size:10px}.apk-source-grid strong{font-size:15px;color:#18394f}.apk-source-text{color:#4e6676;font-size:12px;line-height:1.8}.apk-source-section details{margin-top:11px;padding:10px 12px;border:1px solid #d4e3eb;border-radius:8px;background:#fbfdfe}.apk-source-section summary{cursor:pointer;font-weight:700;font-size:12px}.apk-source-section details p{white-space:pre-wrap;color:#465f70;line-height:1.85;font-size:12px}
      @media(max-width:980px){.apk-stats{grid-template-columns:repeat(3,1fr)}.apk-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:620px){.apk-page-head{padding:18px}.apk-page-head h1{font-size:23px}.apk-stats{grid-template-columns:repeat(2,1fr)}.apk-grid{grid-template-columns:1fr}.apk-tools{align-items:stretch;flex-direction:column}.apk-source-grid{grid-template-columns:repeat(2,1fr)}.apk-hero-callout{align-items:flex-start;flex-direction:column}.apk-detail-head{padding:17px}.apk-detail-identity{grid-template-columns:96px minmax(0,1fr);gap:13px;align-items:start}.apk-detail-portrait{width:96px;height:134px}.apk-detail-head h1{font-size:25px}}
    `;
    document.head.appendChild(style);
  }

  function addNav() {
    const left = $('#leftSidebar');
    if (!left || left.querySelector('[data-apk-guide-link]')) return;
    const groups = [...left.querySelectorAll('.side-group')];
    const group = groups.find(g => g.querySelector('.side-group-title')?.textContent.includes('系统资料')) || groups.at(-1);
    if (!group) return;
    const a = document.createElement('a');
    a.className = 'side-link';
    a.href = '#apk';
    a.dataset.apkGuideLink = '1';
    a.innerHTML = `<span class="icon">▣</span>APK资料库<span class="count">${D.meta.counts.heroes + D.meta.counts.skills}</span>`;
    group.appendChild(a);
  }

  const tabDefs = [
    ['heroes','英雄档案'],['skills','技能大全'],['functions','功能开放'],['tech','科技树'],['calendar','日程赛季'],['copies','章节副本'],['bonds','英雄羁绊'],['catalog','道具任务']
  ];
  function tabs(active) { return `<nav class="apk-tabs">${tabDefs.map(([id,name])=>`<a class="apk-tab ${active===id?'active':''}" href="#apk/${id}">${name}</a>`).join('')}</nav>`; }

  function pageHead(active) {
    const c=D.meta.counts;
    return `<header class="apk-page-head"><span class="apk-source-badge">Unity ${esc(D.meta.unityVersion)} · APK 内置配置</span><h1>游戏原始资料库</h1><p>直接从线上安卓包中的 Unity AssetBundle 与 LuaJIT 配置提取。此处展示的是客户端内置说明和数值字段，不是根据截图猜测的攻略。</p><div class="apk-stats"><div class="apk-stat"><strong>${c.heroes}</strong><span>英雄档案</span></div><div class="apk-stat"><strong>${c.skills}</strong><span>技能说明</span></div><div class="apk-stat"><strong>${c.functions}</strong><span>功能开放</span></div><div class="apk-stat"><strong>${c.technologies}</strong><span>科技项目</span></div><div class="apk-stat"><strong>${c.bonds}</strong><span>英雄羁绊</span></div><div class="apk-stat"><strong>2,547</strong><span>道具与任务</span></div></div></header>${tabs(active)}`;
  }

  function heroCards(list) {
    return `<div class="apk-grid">${list.map(h=>`<a class="apk-card" href="#apk/hero/${h.id}"><div class="apk-card-top"><span class="apk-tag">${esc(h.class)}</span><span class="apk-tag">ID ${h.id}</span><span class="apk-quality">${qualityName[h.quality]||('品质'+h.quality)}</span></div><div class="apk-card-identity"><div class="apk-card-avatar">${heroImage(h)}</div><div><h3>${esc(h.name)}${h.subtitle?` <small>· ${esc(h.subtitle)}</small>`:''}</h3><p>${esc(h.position || h.desc || '游戏内英雄档案')}</p></div></div><div class="apk-attrs"><span>力量<b>${h.attrs.force}</b></span><span>智力<b>${h.attrs.wisdom}</b></span><span>魅力<b>${h.attrs.charm}</b></span><span>统率<b>${h.attrs.leadership}</b></span></div></a>`).join('')}</div>`;
  }

  function renderHeroes() {
    const list=[...D.heroes].sort((a,b)=>(careerOrder[a.class]||9)-(careerOrder[b.class]||9)||b.quality-a.quality||a.id-b.id);
    main().innerHTML=pageHead('heroes')+`<div class="apk-tools"><input id="apkSearch" placeholder="搜索英雄名称、称号、定位或故事关键词"><select id="apkClass"><option>全部职业</option><option>格斗</option><option>博学</option><option>均衡</option></select><span class="apk-result-count" id="apkCount">${list.length} 名英雄</span></div><div id="apkResults">${heroCards(list)}</div>`;
    const apply=()=>{const q=$('#apkSearch').value.trim().toLowerCase(),cl=$('#apkClass').value;const r=list.filter(h=>(cl==='全部职业'||h.class===cl)&&(!q||[h.name,h.subtitle,h.position,h.analysis,h.desc,h.story].join(' ').toLowerCase().includes(q)));$('#apkResults').innerHTML=r.length?heroCards(r):'<div class="apk-empty">没有匹配的英雄</div>';$('#apkCount').textContent=`${r.length} 名英雄`;};
    $('#apkSearch').addEventListener('input',apply);$('#apkClass').addEventListener('change',apply);
  }

  function heroDetail(id) {
    const h=D.heroes.find(x=>String(x.id)===String(id));
    if(!h){main().innerHTML=pageHead('heroes')+'<div class="apk-empty">未找到英雄数据</div>';return;}
    const existing=window.WIKI_DATA?.entries?.find(e=>e.title===h.name&&e.category==='英雄图鉴');
    main().innerHTML=`<div class="apk-detail"><header class="apk-detail-head"><div class="apk-detail-identity"><div class="apk-detail-portrait">${heroImage(h,'portrait')}</div><div><span class="apk-source-badge">英雄 ID ${h.id} · ${esc(h.class)}</span><h1>${esc(h.name)}${h.subtitle?` <small>· ${esc(h.subtitle)}</small>`:''}</h1><p>${esc(h.position||h.desc)}</p><div class="apk-attrs"><span>力量<b>${h.attrs.force}</b></span><span>智力<b>${h.attrs.wisdom}</b></span><span>魅力<b>${h.attrs.charm}</b></span><span>统率<b>${h.attrs.leadership}</b></span></div></div></div></header><div class="apk-detail-body">
      ${existing?`<div class="apk-block"><a class="btn light small" href="#article/${existing.id}">查看站内配队攻略 →</a></div>`:''}
      <section class="apk-block"><h2>官方定位与分析</h2><p class="apk-source-text">${nl(h.analysis||h.desc)}</p>${h.assistDesc?`<div class="apk-pill" style="margin-top:8px">助战共鸣：${esc(h.assistDesc)}</div>`:''}</section>
      <section class="apk-block"><h2>天赋与觉醒</h2>${h.talents.length?`<div class="apk-list">${h.talents.map(t=>`<article class="apk-list-item"><h3>${esc(t.name||('天赋 '+t.id))}</h3><p>${nl(t.desc||t.desc2||t.assist_desc)}</p>${t.assist_desc&&t.desc?`<p>助战：${nl(t.assist_desc)}</p>`:''}</article>`).join('')}</div>`:'<p class="apk-source-text">客户端配置中未提供可读天赋说明。</p>'}</section>
      <section class="apk-block"><h2>英雄羁绊</h2>${h.bonds.length?`<div class="apk-list">${h.bonds.map(b=>`<article class="apk-list-item"><div class="apk-list-meta"><span class="apk-tag">需要 ${esc(b.needHeroName||('英雄 '+b.needHeroId))}</span></div><h3>${esc(b.name)}</h3><p>${nl(b.desc)}</p></article>`).join('')}</div>`:'<p class="apk-source-text">暂无羁绊配置。</p>'}</section>
      <section class="apk-block"><h2>英雄故事</h2><p class="apk-story">${esc(h.story||h.desc||'暂无故事文本')}</p></section>
    </div></div>${tabs('heroes')}`;
  }

  function listPage(active, rows, opts={}) {
    const {placeholder='搜索名称或说明', titleKey='name', textKeys=['desc'], meta=(r)=>'', renderExtra=(r)=>''}=opts;
    const render=list=>`<div class="apk-list">${list.map(r=>`<article class="apk-list-item">${meta(r)?`<div class="apk-list-meta">${meta(r)}</div>`:''}<h3>${esc(r[titleKey]||'未命名')}</h3><p>${nl(textKeys.map(k=>r[k]).filter(Boolean).join('\n'))}</p>${renderExtra(r)}</article>`).join('')}</div>`;
    main().innerHTML=pageHead(active)+`<div class="apk-tools"><input id="apkSearch" placeholder="${esc(placeholder)}"><span class="apk-result-count" id="apkCount">${rows.length} 条</span></div><div id="apkResults">${render(rows)}</div>`;
    $('#apkSearch').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();const list=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));$('#apkResults').innerHTML=list.length?render(list):'<div class="apk-empty">没有匹配内容</div>';$('#apkCount').textContent=`${list.length} 条`;});
  }

  function renderSkills(){listPage('skills',D.skills,{placeholder:'搜索技能名称、类型、触发回合或效果',meta:r=>`<span class="apk-tag">ID ${r.id}</span><span class="apk-tag">${esc(r.skill_type_desc||r.type_note||'技能')}</span>${r.max_level?`<span class="apk-tag">最高 ${r.max_level} 级</span>`:''}`,textKeys:['desc_brief','desc'],renderExtra:r=>r.high_eff_desc?`<p style="margin-top:6px"><b>高效效果：</b>${nl(r.high_eff_desc)}</p>`:''});}
  function renderFunctions(){const rows=D.functions; main().innerHTML=pageHead('functions')+`<div class="apk-table-wrap"><table class="apk-table"><thead><tr><th>等级</th><th>功能</th><th>功能 ID</th><th>入口资源</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r.level}级</b></td><td>${esc(r.name)}</td><td>${r.id}</td><td>${esc(r.bg||'—')}</td></tr>`).join('')}</tbody></table></div>`;}
  function renderTech(){listPage('tech',D.technologies,{placeholder:'搜索科技名称、兵种或效果',meta:r=>`<span class="apk-tag">ID ${r.id}</span><span class="apk-tag">解锁 ${r.unlock_level||1}级</span><span class="apk-tag">最高 ${r.max_level||1}级</span>`,textKeys:['desc']});}
  function renderCalendar(){main().innerHTML=pageHead('calendar')+`<section class="apk-block"><h2>每日与周期玩法</h2><div class="apk-list">${D.daily.map(r=>`<article class="apk-list-item"><div class="apk-list-meta"><span class="apk-tag">序列 ${r.index}</span><span class="apk-tag">入口 ${r.link||0}</span></div><h3>${nl(r.desc)}</h3></article>`).join('')}</div></section><section class="apk-block"><h2>赛季节点</h2><div class="apk-list">${D.seasons.map(r=>`<article class="apk-list-item"><h3>${esc(r.name)}</h3><p>${nl(r.desc)}</p></article>`).join('')}</div></section>`;}
  function renderCopies(){main().innerHTML=pageHead('copies')+`<section class="apk-block"><h2>主线章节</h2><div class="apk-list">${D.chapters.map(r=>`<article class="apk-list-item"><div class="apk-list-meta"><span class="apk-tag">第 ${r.chapter_id} 章</span></div><h3>${esc(r.name)}</h3><p>${nl(r.desc)}</p></article>`).join('')}</div></section><section class="apk-block"><h2>副本目录</h2><div class="apk-grid">${D.copies.map(r=>`<article class="apk-card"><div class="apk-card-top"><span class="apk-tag">ID ${r.id}</span><span class="apk-tag">需要 ${r.need_lv||1}级</span></div><h3>${esc(r.name)}</h3><p>${nl(r.desc)}</p></article>`).join('')}</div></section>`;}
  function renderBonds(){const rows=D.heroes.flatMap(h=>h.bonds.map(b=>({...b,heroName:h.name,heroId:h.id})));listPage('bonds',rows,{placeholder:'搜索羁绊名称、英雄或效果',titleKey:'name',meta:r=>`<span class="apk-tag">${esc(r.heroName)}</span><span class="apk-tag">需要 ${esc(r.needHeroName||r.needHeroId)}</span>`,textKeys:['desc']});}

  function loadCatalog(callback){if(window.APK_GUIDE_CATALOG){callback();return;}main().insertAdjacentHTML('beforeend','<div class="apk-empty" id="apkCatalogLoading">正在加载 1,153 个道具与 1,394 条任务…</div>');const s=document.createElement('script');s.src='/apk-guide-catalog.js?v=20260723';s.onload=callback;s.onerror=()=>{$('#apkCatalogLoading').textContent='资料目录加载失败，请刷新重试。';};document.head.appendChild(s);}
  function renderCatalog(){main().innerHTML=pageHead('catalog');loadCatalog(()=>{const C=window.APK_GUIDE_CATALOG;const rows=[...C.items.map(x=>({...x,_kind:'道具',_title:x.name,_text:x.desc})),...C.missions.map(x=>({...x,_kind:'任务',_title:x.title,_text:x.cond_desc||x.desc}))];const render=list=>`<div class="apk-list">${list.slice(0,250).map(r=>`<article class="apk-list-item"><div class="apk-list-meta"><span class="apk-tag">${r._kind}</span><span class="apk-tag">ID ${r.type_id||r.id}</span></div><h3>${esc(r._title)}</h3><p>${nl(r._text)}</p></article>`).join('')}</div>${list.length>250?`<div class="apk-empty">结果较多，仅展示前 250 条，请继续输入关键词缩小范围。</div>`:''}`;main().innerHTML=pageHead('catalog')+`<div class="apk-tools"><input id="apkSearch" placeholder="搜索道具名称、任务名称或完成条件"><select id="apkKind"><option>全部</option><option>道具</option><option>任务</option></select><span class="apk-result-count" id="apkCount">${rows.length} 条</span></div><div id="apkResults">${render(rows)}</div>`;const apply=()=>{const q=$('#apkSearch').value.trim().toLowerCase(),kind=$('#apkKind').value;const list=rows.filter(r=>(kind==='全部'||r._kind===kind)&&(!q||JSON.stringify(r).toLowerCase().includes(q)));$('#apkResults').innerHTML=list.length?render(list):'<div class="apk-empty">没有匹配内容</div>';$('#apkCount').textContent=`${list.length} 条`;};$('#apkSearch').addEventListener('input',apply);$('#apkKind').addEventListener('change',apply);});}

  function renderApkRoute() {
    const parts=route().split('/'); if(parts[0]!=='apk') return false;
    addNav(); addStyles();
    const view=parts[1]||'heroes';
    if(view==='hero') heroDetail(parts[2]);
    else if(view==='heroes') renderHeroes();
    else if(view==='skills') renderSkills();
    else if(view==='functions') renderFunctions();
    else if(view==='tech') renderTech();
    else if(view==='calendar') renderCalendar();
    else if(view==='copies') renderCopies();
    else if(view==='bonds') renderBonds();
    else if(view==='catalog') renderCatalog();
    else renderHeroes();
    if(right()) right().innerHTML=`<div class="side-card"><h3>APK 数据来源</h3><p>构建日期：${esc(D.meta.apkBuildDate)}</p><p>Unity：${esc(D.meta.unityVersion)}</p><p>配置提取：${esc(D.meta.generated)}</p><p style="word-break:break-all">SHA-256：${esc(D.meta.apkSha256.slice(0,16))}…</p></div><div class="side-card"><h3>数据说明</h3><p>客户端字段可能包含尚未开放、活动限定或预留内容，实际开放状态以游戏内服务器为准。</p></div>`;
    main()?.focus({preventScroll:true});
    return true;
  }

  function enhanceHeroArticle() {
    const r=route(); const m=r.match(/^article\/(.+)$/); if(!m) return;
    const entry=window.WIKI_DATA?.entries?.find(e=>e.id===m[1]); if(!entry||entry.category!=='英雄图鉴') return;
    const h=D.heroes.find(x=>x.name===entry.title); if(!h) return;
    const host=main(); if(!host||host.querySelector('.apk-source-section')) return;
    const anchor=host.querySelector('.hero-detail-layout')||host.querySelector('.article-infobox')||host.querySelector('.article-content');
    const sec=document.createElement('section');sec.className='wiki-section apk-source-section';sec.innerHTML=`<div class="section-heading"><span class="section-icon">▣</span><h2>APK 原始英雄资料</h2><a href="#apk/hero/${h.id}">完整档案 →</a></div><div class="section-body"><div class="apk-source-grid"><div><small>力量</small><strong>${h.attrs.force}</strong></div><div><small>智力</small><strong>${h.attrs.wisdom}</strong></div><div><small>魅力</small><strong>${h.attrs.charm}</strong></div><div><small>统率</small><strong>${h.attrs.leadership}</strong></div></div><p class="apk-source-text"><b>${esc(h.position||'英雄定位')}</b><br>${nl(h.analysis||h.desc)}</p>${h.talents.length?`<details><summary>查看天赋与觉醒配置（${h.talents.length} 条）</summary>${h.talents.map(t=>`<p><b>${esc(t.name||('天赋 '+t.id))}</b><br>${nl(t.desc||t.desc2||t.assist_desc)}</p>`).join('')}</details>`:''}${h.story?`<details><summary>查看 APK 内置英雄故事</summary><p>${esc(h.story)}</p></details>`:''}</div>`;
    if(anchor) anchor.insertAdjacentElement('afterend',sec); else host.appendChild(sec);
  }

  function addHomeCallout() {
    if(route()!=='home') return; const host=main(); if(!host||host.querySelector('.apk-hero-callout')) return;
    const target=host.querySelector('.wiki-section'); if(!target) return;
    const div=document.createElement('div');div.className='apk-hero-callout';div.innerHTML=`<div><h3>APK 原始资料库已上线</h3><p>新增 76 名英雄档案、112 个技能、115 项科技，以及完整道具与任务检索。</p></div><a class="btn primary small" href="#apk">进入资料库 →</a>`;target.insertAdjacentElement('beforebegin',div);
  }

  function apply() {
    addStyles(); addNav();
    if(renderApkRoute()) return;
    setTimeout(()=>{addNav();enhanceHeroArticle();addHomeCallout();},30);
  }
  window.addEventListener('hashchange',()=>setTimeout(apply,0));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0));
  setTimeout(apply,120);
})();
