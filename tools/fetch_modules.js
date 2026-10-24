const fs=require('fs');
const rows=fs.readFileSync('99-原始资料/干员一览_干员id.wiki','utf8').trim().split('\n').slice(1)
  .map(l=>l.split(',')).filter(r=>r.length>=5&&r[2]==='5'&&!r[1].includes('卫戍协议')&&!r[1].includes('预备'));
const clean=s=>s.replace(/\{\{color\|[^|]*\|([^{}]*)\}\}/g,'$1').replace(/\{\{术语\|[^|]*\|([^{}]*)\}\}/g,'$1')
 .replace(/\{\{变动数值lite\|[^|]*\|[^|]*\|([^{}]*)\}\}/g,'$1').replace(/\{\{\*\|([^{}]*)\|([^{}]*)\}\}/g,'$2').replace(/\{\{\u00b1\|([^{}]*)\|([^{}]*)\}\}/g,'$2').replace(/\{\{[^{}]*\}\}/g,'').replace(/'''/g,'').replace(/\s+/g,' ').trim();
(async()=>{
 const out=[];
 for(const r of rows){
  const name=r[1];
  try{
   const u='https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(name)+'&prop=wikitext&format=json&formatversion=2&redirects=1';
   const d=await fetch(u).then(x=>x.json());
   if(d.error)continue;
   const t=d.parse.wikitext;
   const g=k=>{const m=t.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
   const talents=[];
   for(let i=1;i<=4;i++){
     const cond=g('天赋'+i+'条件'), eff=g('天赋'+i+'效果');
     if(cond&&eff) talents.push({cond,eff:clean(eff)});
   }
   out.push({name,cls:g('职业'),branch:g('分支'),mod1:g('模组1名'),mod1data:g('模组1数据'),mod0:g('初始模组名'),talents});
   if(out.length%20===0) console.log('progress',out.length);
   fs.writeFileSync('99-原始资料/modules_6star.json',JSON.stringify(out));
  }catch(e){}
  await new Promise(x=>setTimeout(x,200));
 }
 console.log('DONE',out.length);
})();
