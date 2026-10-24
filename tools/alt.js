// usage: node tools/alt.js <干员>
const fs=require('fs');
const d=[];
for(const f of ['stats_6star.json','stats_mid.json']){try{d.push(...JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/'+f,'utf8')))}catch(e){}}
const name=process.argv[2];
const op=d.find(x=>x.name===name)||d.find(x=>x.name.includes(name));
if(!op){console.log('未找到');process.exit(1)}
const n=x=>parseInt(x)||0;
const same=d.filter(x=>x.branch===op.branch&&x.name!==op.name);
const rar=x=>!x.rarity?'6★':x.rarity==='5'?'6★':x.rarity==='4'?'5★':x.rarity==='3'?'4★':x.rarity+'★';
console.log(op.name+'（'+op.cls+'-'+op.branch+'）攻击'+op.atk+' 费用'+op.cost+' 间隔'+op.interval);
console.log('\n同分支可替代：');
for(const x of same.sort((a,b)=>n(b.atk)-n(a.atk))) console.log('  '+x.name+' ['+rar(x)+'] 攻击'+x.atk+' 生命'+x.hp+' 费用'+x.cost+' 阻挡'+x.block);
if(!same.length) console.log('  （无同分支其他干员）');
