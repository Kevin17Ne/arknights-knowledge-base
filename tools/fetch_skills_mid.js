// 批量抓取 6★ 干员技能数据 -> 99-原始资料/skills_mid.json
const fs=require('fs');
const rows=fs.readFileSync('99-原始资料/干员一览_干员id.wiki','utf8').trim().split('\n').slice(1)
  .map(l=>l.split(',')).filter(r=>r.length>=5&&r[2]==='4'||r[2]==='3'&&!r[1].includes('卫戍协议')&&!r[1].includes('预备'));
const clean=s=>s.replace(/\{\{color\|[^|]*\|([^{}]*)\}\}/g,'$1').replace(/\{\{术语\|[^|]*\|([^{}]*)\}\}/g,'$1')
 .replace(/\{\{\*\|([^{}]*)\|([^{}]*)\}\}/g,'$2').replace(/\{\{±\|([^{}]*)\|([^{}]*)\}\}/g,'$2')
 .replace(/\{\{变动数值lite[^}]*\}\}/g,'').replace(/\{\{[^{}]*\}\}/g,'').replace(/<br\s*\/?>/g,'；')
 .replace(/'''/g,'').replace(/\n/g,' ').replace(/\s+/g,' ').trim();
(async()=>{
  const out=[];
  for(const r of rows){
    const name=r[1];
    try{
      const u='https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(name)+'&prop=wikitext&format=json&formatversion=2&redirects=1';
      const d=await fetch(u).then(x=>x.json());
      if(d.error){console.error('ERR',name,d.error.info);continue}
      const t=d.parse.wikitext;
      const g=k=>{const m=t.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
      const sec=t.split('==技能==')[1]||'';
      const blocks=sec.split(/'''技能\d（/).slice(1);
      const skills=[];
      for(const b of blocks){
        const s=b.split('{{技能')[1]||b;
        const f=k=>{const m=s.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
        if(!f('技能名'))continue;
        skills.push({name:f('技能名'),rec:f('技能类型1'),trig:f('技能类型2'),
          sp0:f('技能专精3初始'),spc:f('技能专精3消耗'),dur:f('技能专精3持续'),desc:clean(f('技能专精3描述')||f('技能7描述'))});
      }
      out.push({name,cls:g('职业'),branch:g('分支'),rarity:5,date:r[4],skills});
      console.log('ok',name,skills.length);
      fs.writeFileSync('99-原始资料/skills_mid.json',JSON.stringify(out));
    }catch(e){console.error('FAIL',name,e.message)}
    await new Promise(r=>setTimeout(r,250));
  }
  console.log('DONE',out.length);
})();
