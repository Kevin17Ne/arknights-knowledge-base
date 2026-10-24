const fs=require('fs');
const dir=__dirname+'/../99-原始资料/';
const items=JSON.parse(fs.readFileSync(dir+'penguin_items.json','utf8'));
const stages=JSON.parse(fs.readFileSync(dir+'penguin_stages.json','utf8'));
const smap={}; stages.forEach(s=>{if(s.existence&&s.existence.CN&&s.existence.CN.exist) smap[s.stageId]=s});
const list=['固源岩','固源岩组','提纯源岩','异铁','异铁组','异铁块','酮凝集','酮凝集组','酮阵列','糖','糖组','糖聚块','聚酸酯','聚酸酯组','聚酸酯块','装置','全新装置','改量装置','RMA70-12','RMA70-24','研磨石','五水研磨石','扭转醇','白马醇','轻锰矿','三水锰矿','凝胶','聚合凝胶','炽合金','炽合金块','晶体元件','晶体电路','化合切削液','切削原液','半自然溶剂','精炼溶剂','环烃聚质','环烃预制体','转质盐组','转质盐聚块','褐素纤维','固化纤维板','类凝结核','手性屈光体','D32钢','双极纳米片','聚合剂','晶体电子单元','烧结核凝晶','重相位对映体','技巧概要·卷3','采购凭证','碳素','碳素组','龙门币'];
(async()=>{
 let out='# 材料最优刷取（企鹅物流实时数据）\n\n> 数据：penguin-stats CN 服务器，样本≥50，按“每理智产出”排序；活动关（如 DV/DM/TW）仅在开放时可用。\n> 查询：`node tools/farm.js <材料名>`\n\n| 材料 | 最优关卡 | 理智 | 掉率/次 | 每理智 | 次优 |\n|---|---|---|---|---|---|\n';
 for(const name of list){
  const item=items.find(o=>o.name===name); if(!item){console.log('skip',name);continue}
  try{
   const r=await fetch('https://penguin-stats.io/PenguinStats/api/v2/result/matrix?server=CN&itemIds='+item.itemId).then(x=>x.json());
   const rows=(r.matrix||[]).filter(m=>m.itemId===item.itemId&&m.times>=50&&smap[m.stageId]);
   const agg={};rows.forEach(m=>{const s=smap[m.stageId];const k=s.code;if(!agg[k])agg[k]={code:k,ap:s.apCost,q:0,t:0,type:s.stageType};agg[k].q+=m.quantity;agg[k].t+=m.times});const calc=Object.values(agg).filter(x=>x.t>=50).map(x=>({code:x.code,ap:x.ap,rate:x.q/x.t,perAp:(x.q/x.t)/(x.ap||1),type:x.type})).sort((a,b)=>b.perAp-a.perAp);
   if(!calc.length){console.log('nodata',name);continue}
   const a=calc[0],b=calc[1];
   out+='| '+name+' | '+a.code+' | '+a.ap+' | '+a.rate.toFixed(2)+' | '+a.perAp.toFixed(3)+' | '+(b?b.code+' ('+b.perAp.toFixed(3)+')':'-')+' |\n';
   console.log('ok',name,a.code);
  }catch(e){console.log('fail',name,e.message)}
  await new Promise(x=>setTimeout(x,250));
 }
 fs.writeFileSync('04-经济与养成/08-材料刷取表.md',out);
 console.log('DONE');
})();
