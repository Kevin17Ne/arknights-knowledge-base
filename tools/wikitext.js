// rendered plain text: node wikitext.js "<page>" 
const [,,page]=process.argv;
fetch('https://prts.wiki/api.php?action=parse&page='+encodeURIComponent(page)+'&prop=text&format=json&formatversion=2')
 .then(r=>r.json()).then(d=>{
  if(d.error){console.log('ERR',d.error.info);process.exit(1)}
  let h=d.parse.text;
  h=h.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'');
  h=h.replace(/<\/(tr|p|div|h[1-6]|li)>/gi,'\n').replace(/<br\s*\/?>/gi,'\n').replace(/<\/t[dh]>/gi,' | ');
  h=h.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
  h=h.split('\n').map(l=>l.trim()).filter(l=>l).join('\n');
  h=h.replace(/\n{2,}/g,'\n');
  const f='/data/user/0/app.dsh.mobile/files/dsh-home/workspaces/arknights-kb/99-原始资料/'+page.replace(/[\/\\:*?"<>|]/g,'_')+'.txt';
  require('fs').writeFileSync(f,h);
  console.log('SAVED',f,h.length);
 })
