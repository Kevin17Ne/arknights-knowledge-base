// usage: node tools/stage.js <关卡代号或页面名>
const fs=require('fs');
const page=process.argv[2];
if(!page){console.log('usage: node tools/stage.js 7-18');process.exit(1)}
const url='https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(page)+'&prop=wikitext&format=json&formatversion=2&redirects=1';
fetch(url).then(r=>r.json()).then(d=>{
  if(d.error){console.log('ERR',d.error.info);return}
  const t=d.parse.wikitext;
  const g=k=>{const m=t.match(new RegExp('\\|'+k+'=([^\\n]*)'));return m?m[1].trim():''};
  console.log('页面:',d.parse.title);
  for(const k of ['关卡代号','关卡名','关卡类型','推荐等级','部署上限','初始COST','COST上限','目标点耐久','敌人数量','地图大小','作战消耗','首次掉落','常规掉落']) console.log(k+':',g(k));
  const desc=g('关卡描述').replace(/<br\s*\/?>/g,' / ').replace(/\{\{color\|[^|]*\|([^}]*)\}\}/g,'$1').replace(/\{\{[^{}]*\}\}/g,'').replace(/\{\{|\}\}/g,'');
  console.log('描述:',desc);
  const en=[...t.matchAll(/\|敌人(\d+)=([^\n|]*)/g)].map(m=>m[2]);
  const cnt=[...t.matchAll(/\|敌人(\d+)数量=([^\n|]*)/g)].map(m=>m[2]);
  if(en.length){
    const db=JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/敌人一览_数据.wiki','utf8'));
    const m={};db.forEach(e=>m[e.name]=e);
    console.log('敌人:');
    en.forEach((n,i)=>{const e=m[n];console.log('  '+n+'×'+(cnt[i]||'?')+(e?'  ['+e.enemyLevel+'] 攻'+e.attack+' 防'+e.defence+' 抗'+e.resistance+' 血'+e.endure+' '+e.damageType+'/'+e.motion:'（无数据）'))});
  }
}).catch(e=>console.log('FETCHERR',e.message));
