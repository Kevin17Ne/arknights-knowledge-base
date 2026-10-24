// usage: node tools/item.js <keyword>
const fs=require('fs');
const d=JSON.parse(fs.readFileSync(__dirname+'/../99-原始资料/items_all.json','utf8'));
const kw=process.argv[2]||'';
const r=d.filter(x=>(x.name||'').includes(kw));
console.log(r.length+' items');
for(const x of r.slice(0,50)) console.log([x.name,'R'+x.rarity,x.category1,x.category2].join(' | '));
