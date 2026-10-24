// usage: node tools/box.js 维什戴尔 黍 桃金娘 ...
const fs=require('fs');
const stats=JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/stats_6star.json','utf8'));
const mid=(()=>{try{return JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/stats_mid.json','utf8'))}catch(e){return []}})();
const all=[...stats,...mid];
const TAGS={
 '尖兵':['dp','ground'],'冲锋手':['dp','ground'],'情报官':['dp','ranged'],'战术家':['dp','summon','ranged'],'执旗手':['dp','buff'],'策士':['dp','buff'],
 '无畏者':['ground','phys'],'斗士':['ground','phys'],'剑豪':['ground','phys'],'强攻手':['ground','phys','aoe'],'重剑手':['ground','phys','aoe'],'撼地者':['ground','phys','aoe'],'收割者':['ground','phys','aoe','selfheal'],'教官':['ground','phys','ranged'],'领主':['ground','phys','ranged'],'术战者':['ground','arts'],'武者':['ground','phys','selfheal'],'解放者':['ground','phys','burst'],'本源近卫':['ground','element'],'佣兵':['ground','phys'],
 '铁卫':['ground','tank'],'守护者':['ground','tank','heal'],'不屈者':['ground','tank','selfheal'],'决战者':['ground','tank'],'哨戒铁卫':['ground','tank','ranged'],'要塞':['ranged','aoe'],'驭法铁卫':['ground','tank','arts'],'本源铁卫':['ground','tank','element'],
 '速射手':['ranged','phys','anti_air'],'神射手':['ranged','phys'],'重射手':['ranged','phys'],'散射手':['ranged','phys','aoe'],'炮手':['ranged','phys','aoe'],'攻城手':['ranged','phys'],'猎手':['ranged','phys'],'投掷手':['ranged','phys','aoe'],'回环射手':['ranged','phys'],'裂空炮手':['ranged','phys','anti_air'],
 '中坚术师':['ranged','arts'],'扩散术师':['ranged','arts','aoe'],'链术师':['ranged','arts','control'],'轰击术师':['ranged','arts','aoe'],'秘术师':['ranged','arts','burst'],'阵法术师':['ranged','arts'],'驭械术师':['ranged','arts','summon'],'塑灵术师':['ranged','arts','summon'],'本源术师':['ranged','arts','element'],
 '医师':['heal'],'群愈师':['heal','aoe'],'疗养师':['heal'],'链愈师':['heal'],'行医':['heal','element'],'咒愈师':['heal','arts'],'守望者':['heal'],
 '凝滞师':['ranged','arts','control'],'削弱者':['ranged','debuff'],'召唤师':['ranged','summon'],'吟游者':['heal','buff'],'工匠':['buff','summon'],'护佑者':['heal','buff'],'巫役':['ranged','element','debuff'],'游击手':['ranged','control','buff'],
 '处决者':['ground','fast'],'伏击客':['ground','phys','aoe'],'傀儡师':['ground','dodge'],'推击手':['ground','shift'],'钩索师':['ground','shift','ranged'],'行商':['ground','phys'],'陷阱师':['ranged','summon','control'],'怪杰':['ground','phys'],'炼金师':['ranged','support'],'巡空者':['ground','shift']
};
const need=['dp','tank','phys','arts','heal','control','element','anti_air','shift','fast'];
const names=process.argv.slice(2);
if(!names.length){console.log('usage: node tools/box.js <干员1> <干员2> ...');process.exit(1)}
const found=[],miss=[];
for(const n of names){const o=all.find(x=>x.name===n||x.name.includes(n));if(!o){miss.push(n);continue}found.push({name:o.name,branch:o.branch,cls:o.cls,tags:TAGS[o.branch]||[]})}
console.log('已识别 '+found.length+' 名'+(miss.length?'，未识别: '+miss.join('、'):''));
const cover={};
for(const f of found){ for(const t of f.tags){ (cover[t]=cover[t]||[]).push(f.name) } }
console.log('\n职能覆盖：');
for(const t of need) console.log('  '+(cover[t]?'✓':'✗')+' '+t+': '+(cover[t]?cover[t].join('、'):'—'));
const gaps=need.filter(t=>!cover[t]);
console.log('\n缺口：'+(gaps.join('、')||'无'));
if(gaps.length){ console.log('\n可用六星补充（同职能）：');
 for(const g of gaps){ const c=stats.filter(o=>(TAGS[o.branch]||[]).includes(g)).slice(0,6).map(o=>o.name+'('+o.branch+')'); console.log('  '+g+': '+c.join('、') ) }
}
