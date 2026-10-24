// 用法：GITHUB_TOKEN=xxx node tools/github_upload.js <repo名> [--private]
// 通过 GitHub API 把当前目录（仓库根）全部文件一次性提交到指定仓库（无需 git）
const fs = require('fs');
const path = require('path');
const TOKEN = process.env.GITHUB_TOKEN;
const repo = process.argv[2];
const isPrivate = process.argv.includes('--private');
if (!TOKEN || !repo) {
  console.log('用法：GITHUB_TOKEN=xxx node tools/github_upload.js <repo名> [--private]');
  process.exit(1);
}
const API = 'https://api.github.com';
const H = {
  Authorization: 'Bearer ' + TOKEN,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'dsh-arknights-kb'
};
const SKIP = [/^\.git\//, /\.tar\.gz$/, /node_modules\//, /\.DS_Store$/, /^cargo\.html$/, /^c6\.json$/, /^items\.json$/, /^penguin_test\.json$/];

async function api(method, p, body) {
  const r = await fetch(API + p, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const txt = await r.text();
  let json; try { json = JSON.parse(txt); } catch (e) { json = { raw: txt }; }
  if (!r.ok) throw new Error(method + ' ' + p + ' -> ' + r.status + ' ' + (json.message || txt.slice(0, 200)));
  return json;
}

function walk(dir, base = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? base + '/' + name : name;
    if (SKIP.some(re => re.test(rel))) continue;
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walk(full, rel));
    else out.push({ rel, full, size: st.size });
  }
  return out;
}

(async () => {
  const me = await api('GET', '/user');
  console.log('账号：' + me.login + '，仓库：' + repo + (isPrivate ? '（私有）' : '（公开）'));
  let exists = false;
  try { await api('GET', '/repos/' + me.login + '/' + repo); exists = true; } catch (e) { exists = false; }
  if (!exists) {
    await api('POST', '/user/repos', {
      name: repo, private: isPrivate,
      description: '明日方舟知识库（笔记 + 数据 + 查询工具）'
    });
    console.log('已创建仓库');
  } else {
    console.log('仓库已存在，将在其默认分支上追加一个提交');
  }

  const files = walk(process.cwd());
  console.log('待上传文件：' + files.length + ' 个，共 ' + (files.reduce((a, b) => a + b.size, 0) / 1048576).toFixed(2) + ' MB');

  const tree = [];
  let i = 0;
  for (const f of files) {
    const content = fs.readFileSync(f.full);
    const blob = await api('POST', '/git/blobs', { content: content.toString('base64'), encoding: 'base64' });
    tree.push({ path: f.rel, mode: '100644', type: 'blob', sha: blob.sha });
    i++;
    if (i % 20 === 0) console.log('已上传 blob ' + i + '/' + files.length);
  }

  let body = { tree };
  let parents = [];
  if (exists) {
    const info = await api('GET', '/repos/' + me.login + '/' + repo);
    const branch = info.default_branch || 'main';
    let ref = null;
    try { ref = await api('GET', '/git/ref/heads/' + branch); } catch (e) { ref = null; }
    if (!ref) { exists = false; console.log('仓库为空，按首次提交处理'); }
    else {
    const parentSha = ref.object.sha;
    const parent = await api('GET', '/git/commits/' + parentSha);
    body.base_tree = parent.tree.sha;
    parents = [parentSha];
    console.log('基于分支 ' + branch + ' 追加');
    }
  }
  const newTree = await api('POST', '/git/trees', body);
  const commit = await api('POST', '/git/commits', {
    message: '更新明日方舟知识库 ' + new Date().toISOString().slice(0, 10),
    tree: newTree.sha, parents
  });
  if (exists) {
    const info = await api('GET', '/repos/' + me.login + '/' + repo);
    const branch = info.default_branch || 'main';
    await api('PATCH', '/git/refs/heads/' + branch, { sha: commit.sha, force: false });
  } else {
    await api('POST', '/git/refs', { ref: 'refs/heads/main', sha: commit.sha });
  }
  console.log('完成：https://github.com/' + me.login + '/' + repo);
})();
