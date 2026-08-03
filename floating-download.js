(() => {
  'use strict';

  const DOWNLOAD_URL = 'http://10tap.top/game/detail?game_id=893';
  const STORAGE_KEY = 'dgxs-floating-download-collapsed';

  if (document.getElementById('dgxsFloatingDownload')) return;

  const style = document.createElement('style');
  style.id = 'dgxsFloatingDownloadStyles';
  style.textContent = `
    #dgxsFloatingDownload{position:fixed;right:22px;bottom:82px;z-index:110;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;filter:drop-shadow(0 12px 28px rgba(4,28,48,.28))}
    #dgxsFloatingDownload *{box-sizing:border-box}
    .dgxs-download-card{width:302px;overflow:hidden;border:1px solid rgba(111,199,246,.72);border-radius:16px;background:linear-gradient(145deg,rgba(8,25,42,.97),rgba(10,66,105,.97));color:#fff;box-shadow:inset 0 1px rgba(255,255,255,.12);transform-origin:right bottom;animation:dgxsDownloadIn .32s ease both}
    .dgxs-download-head{display:flex;align-items:center;gap:10px;padding:13px 14px 10px}
    .dgxs-download-icon{width:44px;height:44px;flex:0 0 44px;padding:4px;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(255,255,255,.1);object-fit:cover}
    .dgxs-download-copy{min-width:0;flex:1}.dgxs-download-copy strong{display:block;font-size:15px;letter-spacing:.3px}.dgxs-download-copy span{display:block;margin-top:3px;color:#b9d9ec;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .dgxs-download-close{width:28px;height:28px;flex:0 0 28px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#dceef8;font-size:19px;line-height:1;cursor:pointer}.dgxs-download-close:hover{background:rgba(255,255,255,.2);color:#fff}
    .dgxs-download-body{padding:0 14px 14px}.dgxs-download-body p{margin:0 0 10px;color:#d0e6f3;font-size:12px;line-height:1.65}
    .dgxs-download-action{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;min-height:42px;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:linear-gradient(135deg,#22a6e8,#0876c5);color:#fff;font-size:14px;font-weight:800;text-decoration:none;transition:.18s ease}.dgxs-download-action:hover{transform:translateY(-1px);background:linear-gradient(135deg,#35b5f2,#0b88dd);box-shadow:0 8px 18px rgba(0,0,0,.2)}
    .dgxs-download-tip{display:block;margin-top:7px;color:#87b8d2;font-size:9px;text-align:center}
    .dgxs-download-mini{display:none;align-items:center;gap:7px;min-height:42px;padding:0 13px;border:1px solid rgba(111,199,246,.78);border-radius:22px;background:linear-gradient(135deg,#0a3859,#0876c5);color:#fff;font-size:12px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(5,52,86,.28);animation:dgxsDownloadIn .25s ease both}.dgxs-download-mini span:first-child{font-size:17px}
    #dgxsFloatingDownload[data-state="collapsed"] .dgxs-download-card{display:none}#dgxsFloatingDownload[data-state="collapsed"] .dgxs-download-mini{display:flex}
    @keyframes dgxsDownloadIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @media(max-width:760px){#dgxsFloatingDownload{right:12px;bottom:156px}.dgxs-download-card{width:min(300px,calc(100vw - 24px))}.dgxs-download-head{padding:11px 12px 9px}.dgxs-download-body{padding:0 12px 12px}}
    @media(prefers-reduced-motion:reduce){.dgxs-download-card,.dgxs-download-mini{animation:none}.dgxs-download-action{transition:none}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('aside');
  root.id = 'dgxsFloatingDownload';
  root.setAttribute('aria-label', '帝国雄狮下载入口');
  root.innerHTML = `
    <div class="dgxs-download-card">
      <div class="dgxs-download-head">
        <img class="dgxs-download-icon" src="/assets/site/icon.webp" alt="帝国雄狮">
        <div class="dgxs-download-copy"><strong>帝国雄狮客户端下载</strong><span>进入下载页，选择适合的游戏版本</span></div>
        <button class="dgxs-download-close" type="button" aria-label="隐藏下载窗口" title="隐藏下载窗口">×</button>
      </div>
      <div class="dgxs-download-body">
        <p>想进游戏实战验证攻略？点击下方按钮进入客户端下载页面。</p>
        <a class="dgxs-download-action" href="${DOWNLOAD_URL}" target="_blank" rel="noopener noreferrer"><span>↓</span>立即下载游戏</a>
        <small class="dgxs-download-tip">关闭后会保留一个小型下载入口</small>
      </div>
    </div>
    <button class="dgxs-download-mini" type="button" aria-label="展开游戏下载窗口" title="展开游戏下载窗口"><span>↓</span><span>游戏下载</span></button>
  `;

  let collapsed = false;
  try { collapsed = localStorage.getItem(STORAGE_KEY) === '1'; } catch {}
  root.dataset.state = collapsed ? 'collapsed' : 'expanded';

  root.querySelector('.dgxs-download-close').addEventListener('click', () => {
    root.dataset.state = 'collapsed';
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  });
  root.querySelector('.dgxs-download-mini').addEventListener('click', () => {
    root.dataset.state = 'expanded';
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  });

  document.body.appendChild(root);
})();
