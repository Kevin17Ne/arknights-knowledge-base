// usage: node tools/farm.js <材料名> [条数]
const fs=require('fs');
const dir=__dirname+'/../99-原始资料/';
const items=JSON.parse(fs.readFileSync(dir+'penguin_items.json','utf8'));
const stages=JSON.parse(fs.readFileSync(dir+'penguin_stages.json','utf8'));
const kw=process.argv[2]; const lim=parseInt(process.argv[3])||8;
if(!kw){console.log('usage: node tools/farm.js 固源岩');process.exit(1)}
const item=items.find(o=>o.name===kw)||items.find(o=>o.name.includes(kw));
if(!item){console.log('未找到材料');process.exit(1)}
const smap={}; stages.forEach(s=>{if(s.existence&&s.existence.CN&&s.existence.CN.exist) smap[s.stageId]=s});
(async()=>{
 const r=await fetch('https://penguin-stats.io/PenguinStats/api/v2/result/matrix?server=CN&itemIds='+item.itemId).then(x=>x.json());
 const rows=(r.matrix||[]).filter(m=>m.itemId===item.itemId&&m.times>=50&&smap[m.stageId]);
 const calc=rows.map(m=>{const s=smap[m.stageId];const rate=m.quantity/m.times;return {code:s.code,ap:s.apCost,rate,perAp:rate/(s.apCost||1),times:m.times}});
 calc.sort((a,b)=>b.perAp-a.perAp);
 console.log(item.name+'（'+item.itemId+'） 最佳刷取：');
 for(const c of calc.slice(0,lim)) console.log('  '+c.code+'  '+c.ap+'理智  掉率'+c.rate.toFixed(3)+'/次  每理智'+c.perAp.toFixed(4)+'  样本'+c.times);
})();
