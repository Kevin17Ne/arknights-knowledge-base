// usage: node tools/skill.js <干员名> [--md]
const fs=require('fs');
const name=process.argv[2];
const clean=s=>s
 .replace(/\{\{color\|[^|]*\|([^{}]*)\}\}/g,'$1')
 .replace(/\{\{术语\|[^|]*\|([^{}]*)\}\}/g,'$1')
 .replace(/\{\{\*\|([^{}]*)\|([^{}]*)\}\}/g,'$2')
 .replace(/\{\{±\|([^{}]*)\|([^{}]*)\}\}/g,'$2')
 .replace(/\{\{变动数值lite[^}]*\}\}/g,'')
 .replace(/\{\{[^{}]*\}\}/g,'')
 .replace(/<br\s*\/?>/g,'；').replace(/'''/g,'').replace(/\n/g,' ').replace(/\s+/g,' ').trim();
const url='https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(name)+'&prop=wikitext&format=json&formatversion=2&redirects=1';
fetch(url).then(r=>r.json()).then(d=>{
 if(d.error){console.log('ERR',d.error.info);return}
 const t=d.parse.wikitext;
 const g=k=>{const m=t.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
 console.log('### '+d.parse.title+'｜'+g('职业')+'-'+g('分支')+'｜'+clean(g('特性')).slice(0,60));
 const sec=t.split('==技能==')[1]||'';
 const blocks=sec.split(/'''技能\d（/).slice(1);
 for(const b of blocks){
   const skill=b.split('{{技能')[1]||b;
   const f=k=>{const m=skill.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
   const nm=f('技能名'); if(!nm) continue;
   const m3desc=clean(f('技能专精3描述')||f('技能7描述'));
   const sp='初始'+f('技能专精3初始')+' 消耗'+f('技能专精3消耗')+(f('技能专精3持续')?' 持续'+f('技能专精3持续'):'');
   console.log('- **'+nm+'**（'+f('技能类型1')+'/'+f('技能类型2')+'）M3: 初始/消耗/持续='+sp);
   console.log('  '+m3desc.slice(0,260));
 }
}).catch(e=>console.log('FETCHERR',e.message));
