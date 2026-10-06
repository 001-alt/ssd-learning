# SSD Lab · 固态硬盘学习平台

基于 [SSD_learning.md](./SSD_learning.md) 实现的完整前端学习平台。React + Vite + TypeScript + Tailwind CSS + React Router + Recharts，无需后端即可运行。

## 快速启动

需要 Node.js 20.19+ 或 22.12+（建议使用当前 LTS）和 npm。

```bash
npm install
npm run dev
```

打开终端显示的本地地址，默认 `http://localhost:5173`。

```bash
npm run build       # TypeScript 检查与生产构建
npm run preview     # 预览 dist，默认端口 4173
```

## 目录结构

```text
SSD_learn/
├── SSD_learning.md             # 原始需求
├── index.html                  # 可运行入口与中文元信息
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts              # React 与 Tailwind Vite 插件
├── public/favicon.svg
└── src/
    ├── main.tsx                # Router 与状态 Provider
    ├── App.tsx                 # 共享布局、导航、搜索与路由
    ├── types.ts                # Chapter / Lesson / SmartMetric / Quiz / Stats
    ├── styles.css              # 全局主题与响应式布局
    ├── components/UI.tsx       # 标题、进度条、Recharts 图表
    ├── data/
    │   ├── curriculum.ts       # 5 章、20 节课程、7 个 SMART 参数、12 道题
    │   ├── glossary.ts         # 章节术语与中文定义
    │   └── telemetry.ts        # 监控时间序列、性能场景与模拟函数
    ├── state/LearningContext.tsx # 学习状态、校验与 localStorage 持久化
    └── pages/
        ├── Dashboard.tsx       # 首页、路线图与今日计划
        ├── Learning.tsx        # 章节与课程详情
        ├── Lab.tsx             # SMART / 性能 / 诊断 / 监控
        └── Personal.tsx        # 测验与个人中心
```

## 完整学习流程

1. 首页展示真实课程完成度、正确率、推荐下一节和今日计划。
2. 进入章节查看目标、术语与四节课程，按需选择学习顺序。
3. 课程提供定义、作用、原理、案例、注意事项与知识总结；收藏或标记完成。
4. 标记完成后可进入下一节；章节状态随课程完成度自动计算。
5. 在 SMART 页面搜索或筛选参数，选择解释查看风险提示。
6. 性能页面选择办公、游戏或创作场景和 QD，运行模拟，观察读写与随机 IO 曲线。
7. 诊断页面选择症状并完成检查清单，获得相应处理建议；清单为当前页面临时状态。
8. 监控页面切换 6/12/24 小时时间范围，启停模拟刷新，查看温度、读写速率、健康与容量趋势。
9. 完成章节测验，提交后展示分数、逐题解析，支持重新学习、重新挑战和下一章挑战。
10. 个人中心查看章节进度、收藏、历史成绩和最近 28 天打卡，支持修改昵称。

搜索框可按标题、简介和知识总结快速查找课程。移动端提供折叠导航；所有页面支持直接访问与刷新。

## 数据与统计

- `Chapter` 包含顺序、状态、难度和进度；状态和进度由已完成课程派生。
- `Lesson` 包含结构化正文、知识点、时长和完成状态；基础 mock 的 `completed` 为默认值，页面读取 Context 中的用户进度。
- `SmartMetric` 包含原始 ID、名称、含义、单位、风险、分类和演示值。
- `Quiz` 支持单选、判断、填空；填空去除首尾空格后精确比较。
- `Stats` / `DashboardStats` 包含总章节、总课程、已完成课程、正确率、剩余天数与总进度。
- 正确率按全部历史提交的正确题数 / 总题数计算，重复挑战也计入记录。
- 剩余学习天数按每日完成两节估算；课程时长是内容估计，不是实际计时。
- `localStorage` 键为 `ssd-lab-learning-v1`，保存完成课程、收藏、打卡日期、测验记录、最近访问课程和昵称。
- 首次进入没有预先完成的课程或伪造用户测验记录；首页周学习节奏图明确为示例。
- 存储读取进行基础结构校验；写入失败会显示提示并在内存中继续使用。
- 打卡按浏览器本地日期计算，重复打卡不会累计；状态只属于当前浏览器，不跨设备同步。

## 重要边界

所有设备遥测和测试均为模拟，不访问用户硬盘，不包含真实 SMART 读取、性能压测、账户认证或后台服务。NVMe 健康日志与 SATA 属性不是同一套 ID 体系；SATA SMART ID、单位、阈值以具体型号厂商文档为准。诊断清单用于学习，不保证故障已消除，重要数据应独立备份。

## 扩展与部署

新增章节、课程或题目时修改 `curriculum.ts`，使用唯一 ID 并正确关联 `chapterId`；学习统计会自动更新。接入后端时将 Context 的读写替换为 API repository，将 `telemetry.ts` 替换为服务数据接口。版本化存储键便于未来迁移。

将 `npm run build` 生成的 `dist/` 部署到静态服务器。使用 BrowserRouter，服务器必须把未知页面路径回退到 `index.html`，否则刷新详情页会 404。Nginx 示例：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

项目没有外部字体或图片依赖，图标使用 Lucide，图表使用 Recharts；Tailwind CSS 4 通过 Vite 插件加载，主题和组件样式集中在 `styles.css`。
