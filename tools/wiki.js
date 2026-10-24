// usage: node wiki.js "<page title>" [outfile]
const [,, page, out] = process.argv;
const fs = require('fs');
const url = 'https://prts.wiki/api.php?action=parse&page=' + encodeURIComponent(page) + '&prop=wikitext&format=json&formatversion=2';
fetch(url).then(r=>r.json()).then(d=>{
  if (d.error) { console.log('ERR', d.error.code, d.error.info); process.exit(1); }
  const t = d.parse.wikitext;
  const f = out || ('/data/user/0/app.dsh.mobile/files/dsh-home/workspaces/arknights-kb/99-原始资料/' + page.replace(/[\/\\:*?"<>|]/g,'_') + '.wiki');
  fs.writeFileSync(f, t);
  const heads = t.split('\n').filter(l=>/^=+[^=]/.test(l)).map(l=>l.trim()).slice(0,60);
  console.log('SAVED', f, t.length, 'chars');
  console.log(heads.join('\n'));
}).catch(e=>{console.log('FETCHERR', e.message)});
