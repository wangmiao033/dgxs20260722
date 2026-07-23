import { mkdir, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';

const STABLE = 'https://dgxs20260722-ccn675vj8-wangmiao033s-projects.vercel.app/';
const HERO_PREVIEW = 'https://dgxs-hero-gallery-hq.vercel.app/';
const BWIKI_PREVIEW = 'https://dgxs-v5-bwiki-layout-preview.vercel.app/';

async function getText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'dgxs-static-builder/1.0' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return res.text();
}

function between(text, startMark, endMark) {
  const start = text.indexOf(startMark);
  if (start < 0) throw new Error(`Missing marker: ${startMark}`);
  const end = text.indexOf(endMark, start);
  if (end < 0) throw new Error(`Missing end marker: ${endMark}`);
  return text.slice(start, end);
}

async function loadStablePage() {
  const loader = await getText(STABLE);
  const srcs = [...loader.matchAll(/<script[^>]+src=["']([^"']*payload-v2\/chunk-\d+\.js[^"']*)["']/g)]
    .map((m) => new URL(m[1], STABLE).href);
  if (!srcs.length) throw new Error('No stable payload chunks found');

  const chunks = await Promise.all(srcs.map(async (url) => {
    const js = await getText(url);
    const match = js.match(/\+"([A-Za-z0-9+/=]+)";/);
    if (!match) throw new Error(`Invalid payload chunk: ${url}`);
    return match[1];
  }));

  return gunzipSync(Buffer.from(chunks.join(''), 'base64')).toString('utf8');
}

async function loadHeroInjection() {
  const source = await getText(HERO_PREVIEW);
  const code = between(source, 'const heroes=', '  page=page.replace');
  return new Function(`${code}; return { heroes, css, patch };`)();
}

async function loadBwikiInjection(heroes) {
  const source = await getText(BWIKI_PREVIEW);
  const code = between(source, 'const bwikiCss=', '      const target=');
  return new Function('heroJson', `${code}; return { bwikiCss, bwikiPatch };`)(JSON.stringify(heroes));
}

function finalizePage(basePage, injections) {
  let page = basePage
    .replace('</head>', `${injections.css}${injections.bwikiCss}</head>`)
    .replace('</body>', `${injections.patch}${injections.bwikiPatch}</body>`);

  page = page
    .replaceAll('高清紧凑版预览：', '英雄图鉴：')
    .replaceAll('参考 BWiki 的高密度图鉴结构 · 高清实景图预览', '高密度英雄图鉴 · APK 实景资源')
    .replaceAll('首批实景配图预览', '英雄实景配图')
    .replaceAll('预览版', '正式版')
    .replace('<title>帝国雄狮攻略百科｜英雄配队·技能搭配·新手开荒</title>', '<title>帝国雄狮攻略百科｜英雄图鉴·配队·技能攻略</title>')
    .replace('</head>', '<meta name="build-version" content="20260723-static-v5"></head>');

  if (/fetch\(['"]https:\/\/dgxs-(?:hero|v5)/.test(page)) {
    throw new Error('Generated page still contains preview runtime fetches');
  }
  return page;
}

async function main() {
  const [basePage, heroInjection] = await Promise.all([
    loadStablePage(),
    loadHeroInjection(),
  ]);
  const bwikiInjection = await loadBwikiInjection(heroInjection.heroes);
  const html = finalizePage(basePage, { ...heroInjection, ...bwikiInjection });

  await mkdir('dist', { recursive: true });
  await Promise.all([
    writeFile('dist/index.html', html),
    writeFile('dist/404.html', html),
    writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://dgxs.hnchpower.cn/sitemap.xml\n'),
    writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://dgxs.hnchpower.cn/</loc></url></urlset>'),
  ]);
  console.log(`Built static site: ${html.length} bytes, ${heroInjection.heroes.length} hero images`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
