const fs=require('fs');
const rows=fs.readFileSync('99-原始资料/干员一览_干员id.wiki','utf8').trim().split('\n').slice(1)
  .map(l=>l.split(',')).filter(r=>r.length>=5&&r[2]==='5'&&!r[1].includes('卫戍协议')&&!r[1].includes('预备'));
(async()=>{
 const out=[];
 for(const r of rows){
  const name=r[1];
  try{
   const u='https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(name)+'&prop=wikitext&format=json&formatversion=2&redirects=1';
   const d=await fetch(u).then(x=>x.json());
   if(d.error){console.error('ERR',name);continue}
   const t=d.parse.wikitext;
   const g=k=>{const m=t.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
   out.push({name,cls:g('职业'),branch:g('分支'),
     redeploy:g('再部署'),cost:g('部署费用'),block:g('阻挡数'),interval:g('攻击速度'),
     hp:g('精英2_满级_生命上限'),atk:g('精英2_满级_攻击'),def:g('精英2_满级_防御'),res:g('精英2_满级_法术抗性'),
     trust_hp:g('信赖加成_生命上限'),trust_atk:g('信赖加成_攻击'),trust_def:g('信赖加成_防御'),
     mod:g('模组1数据'),date:r[4]});
   console.log('ok',name);
   fs.writeFileSync('99-原始资料/stats_6star.json',JSON.stringify(out));
  }catch(e){console.error('FAIL',name,e.message)}
  await new Promise(x=>setTimeout(x,220));
 }
 console.log('DONE',out.length);
})();
