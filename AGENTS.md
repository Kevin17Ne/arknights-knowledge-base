# AGENTS.md — 明日方舟知识库（给 DSH / AI 助手的入口说明）

## 这个仓库是什么
一个可离线查询的《明日方舟》知识库：机制笔记 + 结构化数据 + 无依赖的 Node 查询脚本。
设计目标是：任何 DSH/AI 助手 clone 后，**不联网也能查数据、能按方法论分析关卡/干员/box**。

## 先读什么
1. `INDEX.md` — 全部笔记索引（按主题）
2. `REVIEW.md` — 知识库自评：覆盖度、置信度、已知薄弱点
3. `05-攻略与meta/06-关卡攻略模板.md` — 关卡分析的 7 步模板
4. `05-攻略与meta/07-账号体检流程.md` — box 诊断流程

## 目录结构
```
01-核心机制/   伤害公式、索敌、异常、元素、术语、敌人与关卡机制
02-干员/       分支、图鉴、练卡、技能、面板、模组（含大量自动生成表）
03-关卡与模式/ 模式全览、IS/生息/保全/卫戍/合约、主线/H关索引、实战样本
04-经济与养成/ 基建、抽卡、成本、周常、模组、材料、刷取表、转换表
05-攻略与meta/ 版本快照、强度环境、模板、诊断、计划、自测
06-剧情与世界观/ 世界观、活动索引、逐章梗概
99-原始资料/   从 PRTS / 企鹅物流抓取的原始数据与页面缓存（勿手改）
tools/         查询脚本（纯 Node，无第三方依赖）
```

## 数据文件（99-原始资料/）
| 文件 | 内容 | 字段 |
|---|---|---|
| `skills_6star.json` / `skills_mid.json` | 干员技能 | name, cls, branch, rarity, skills[{name, rec, trig, sp0, spc, dur, desc}] |
| `stats_6star.json` / `stats_mid.json` | 干员面板 | name, cls, branch, cost, block, interval, hp, atk, def, res, mod |
| `modules_6star.json` | 模组 | name, mod1, mod1data, talents[{cond, eff}] |
| `敌人一览_数据.wiki` | 1737 个敌人（JSON 数组） | name, enemyLevel, enemyRace, damageType, motion, attack/defence/resistance/endure 评级 |
| `items_all.json` | 1402 个道具 | name, rarity, category1 |
| `penguin_items.json` / `penguin_stages.json` | 企鹅物流物品/关卡表 | itemId/name; stageId, code, apCost |
| `干员一览_干员id.wiki` | 462 条干员总表 | sortId,name,rarity,approach,date |

## 工具（在仓库根目录运行，需要 Node 18+）
```sh
node tools/enemy.js <关键词> [等级]      # 查敌人
node tools/item.js <关键词>              # 查道具
node tools/stage.js <关卡代号>           # 关卡数据 + 敌人评级
node tools/skilldb.js [关键词]           # 技能库（默认全部）
node tools/dmg.js <干员> <倍率%> <敌防> <敌抗> [物|法] [敌血]
node tools/farm.js <材料>                # 企鹅物流实时刷图效率（需联网）
node tools/box.js <干员...>              # 职能覆盖诊断
node tools/alt.js <干员>                 # 同分支替代
node tools/wiki.js "<PRTS页面>"          # 抓页面 wikitext（需联网）
node tools/wikitext.js "<PRTS页面>"      # 抓渲染文本（需联网）
```

## 工作约定（给 AI 助手）
1. **先查数据再回答**：干员/敌人/材料问题用对应脚本，不要凭记忆。
2. **关卡分析走模板**：数据 → 敌人 → 机制 → 胜利条件 → 阵容 → 轴 → 验证。
3. **更新知识库时**：新笔记放进对应主题目录，并在 `INDEX.md` 加一行、在 `README.md` 末尾追加日志。
4. **不要手改 `99-原始资料/`**：那是抓取缓存，重跑脚本即可。
5. **标注时效**：版本相关结论注明日期；11-01 等新版本上线后按 `05-攻略与meta/15-新干员上线校验清单.md` 校准。

## 来源与版权
- 文本与数据抓取自 PRTS wiki（CC BY-NC-SA 类许可）、企鹅物流（penguin-stats）与游戏内公开数据；游戏素材版权归鹰角网络所有。
- 本仓库仅用于个人学习/研究，请勿商用；转载数据请保留来源说明。
