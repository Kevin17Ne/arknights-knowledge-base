const fs=require('fs');
const bosses=JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/敌人一览_数据.wiki','utf8')).filter(e=>e.enemyLevel==='领袖');
const bset=new Set(bosses.map(b=>b.name));
const map={0:'0-11',1:'1-12',2:'2-10',3:'3-8',4:'4-10',5:'5-11',6:'6-18',7:'7-20',8:'JT8-3',9:'9-21',10:'10-19',11:'11-21',12:'12-21',13:'13-22',14:'14-23',15:'15-21',16:'16-19',17:'17-21'};
(async()=>{
 let md='# 各章最终关与领袖（自动生成）\n\n> 方法：取每章最后一个主线关卡，拉取敌人列表，匹配敌库中的“领袖”条目。\n\n| 章 | 最终关 | 领袖 |\n|---|---|---|\n';
 for(const [c,code] of Object.entries(map)){
  try{
   const u='https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(code)+'&prop=wikitext&format=json&formatversion=2&redirects=1';
   const d=await fetch(u).then(x=>x.json());
   if(d.error){md+='| '+c+' | '+code+' | 抓取失败 |\n';continue}
   const t=d.parse.wikitext;
   const names=[...t.matchAll(/\|敌人\d+=([^\n|]*)/g)].map(m=>m[1].trim());
   const bl=[...new Set(names.filter(n=>bset.has(n)))];
   const title=d.parse.title;
   md+='| '+c+' | '+title+' | '+(bl.join('、')||'（未匹配到领袖）')+' |\n';
   console.log(c,code,bl.join(','));
  }catch(e){console.log('fail',code,e.message)}
  await new Promise(r=>setTimeout(r,200));
 }
 fs.writeFileSync('03-关卡与模式/13-各章领袖.md',md);
 console.log('DONE');
})();
