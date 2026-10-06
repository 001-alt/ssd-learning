import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  Gauge,
  Info,
  Play,
  ShieldCheck,
  Thermometer,
  TriangleAlert,
} from "lucide-react";
import { smartMetrics } from "../data/curriculum";
import {
  benchmark,
  cumulativeIO,
  scenarios,
  telemetry,
} from "../data/telemetry";
import type { Scenario } from "../data/telemetry";
import { Chart, PageTitle, Progress } from "../components/UI";
export function Smart() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [selected, setSelected] = useState(194);
  const metric = smartMetrics.find((m) => m.id === selected)!;
  const filtered = smartMetrics.filter(
    (m) =>
      (category === "全部" || category === m.category) &&
      `${m.name}${m.description}${m.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="DRIVE HEALTH INTELLIGENCE"
        title="读懂 SMART 健康信号"
        description="了解每个参数背后的含义，用趋势判断设备状态。"
        action={
          <span className="pill">
            <ShieldCheck size={15} /> 模拟设备 · SATA SSD
          </span>
        }
      />
      <div className="notice">
        <Info size={18} />
        SATA 属性 ID 和单位依厂商而异；NVMe
        使用健康日志字段。下列值用于学习演示，阈值应参考具体型号文档。
      </div>
      <div className="mini-stats">
        <div className="panel">
          <ShieldCheck />
          <span>
            剩余耐久估计
            <strong>
              98<small>%</small>
            </strong>
          </span>
        </div>
        <div className="panel">
          <Thermometer />
          <span>
            设备温度
            <strong>
              42<small>°C</small>
            </strong>
          </span>
        </div>
        <div className="panel">
          <Activity />
          <span>
            主机写入量
            <strong>
              12.4<small>TB</small>
            </strong>
          </span>
        </div>
      </div>
      <section className="panel">
        <div className="section-heading">
          <h2>SMART 参数解释</h2>
          <input
            className="field"
            aria-label="搜索 SMART 参数"
            placeholder="名称、ID 或中文含义"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="tabs">
          {["全部", "介质", "使用", "环境", "耐久"].map((c) => (
            <button
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID / 参数</th>
                <th>含义</th>
                <th>演示值</th>
                <th>参考范围</th>
                <th>关注级别</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className={m.id === selected ? "selected-row" : ""}
                >
                  <td>
                    <strong>
                      {m.id} · {m.name}
                    </strong>
                    <small>{m.unit}</small>
                  </td>
                  <td>{m.description}</td>
                  <td className="metric-number">{m.value}</td>
                  <td>{m.normalRange}</td>
                  <td>
                    <span className={`risk risk-${m.riskLevel}`}>
                      {m.riskLevel}
                    </span>
                  </td>
                  <td>
                    <button
                      className="text-link"
                      onClick={() => setSelected(m.id)}
                    >
                      解释
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="empty">没有匹配的参数。</div>}
        </div>
      </section>
      <section className="panel metric-detail">
        <span className="eyebrow">ATTRIBUTE {metric.id}</span>
        <h2>{metric.description}</h2>
        <p>{metric.meaning}</p>
        <div className="notice">
          <TriangleAlert size={18} />
          {metric.risk}
        </div>
        <Link to="/lessons/smart-1" className="text-link">
          学习如何解读 SMART 报告
        </Link>
      </section>
    </>
  );
}
export function Performance() {
  const [scenario, setScenario] = useState<Scenario>("daily");
  const [qd, setQd] = useState(1);
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<{
    scenario: Scenario;
    qd: number;
    run: number;
  } | null>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setResult({ scenario, qd, run: run + 1 });
      setRun((n) => n + 1);
      setRunning(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [running, scenario, qd, run]);
  const data = result ? benchmark(result.scenario, result.qd, result.run) : [];
  const avg = (key: "read" | "write" | "iops") =>
    data.length
      ? Math.round(
          data.reduce((n, d) => n + d[key], 0) / data.length,
        ).toLocaleString()
      : "—";
  return (
    <>
      <PageTitle
        eyebrow="PERFORMANCE PLAYGROUND"
        title="探索性能，而不只看峰值"
        description="调整场景和队列深度，观察不同工作负载的表现。"
      />
      <div className="notice">
        <Info size={18} />
        模拟测试不会读取或写入你的硬盘。结果用于解释
        IO、缓存和队列深度，不代表任何实际型号。
      </div>
      <div className="scenario-grid">
        {(Object.keys(scenarios) as Scenario[]).map((s) => (
          <button
            disabled={running}
            key={s}
            className={`panel scenario-card ${scenario === s ? "selected" : ""}`}
            onClick={() => setScenario(s)}
          >
            <Gauge size={24} />
            <h3>{scenarios[s].title}</h3>
            <p>{scenarios[s].description}</p>
            <span>{scenarios[s].block} 数据块</span>
          </button>
        ))}
      </div>
      <section className="panel benchmark-controls">
        <label>
          队列深度 QD
          <select
            disabled={running}
            className="field"
            value={qd}
            onChange={(e) => setQd(Number(e.target.value))}
          >
            {[1, 4, 8, 16, 32].map((v) => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div>
          <strong>60 秒模拟时间线</strong>
          <p className="small muted">大约 30 秒后模拟写入缓存耗尽</p>
        </div>
        <button
          className="button primary"
          disabled={running}
          onClick={() => setRunning(true)}
        >
          <Play size={16} />
          {running ? "正在生成模拟结果…" : "运行模拟测试"}
        </button>
      </section>
      <div className="mini-stats">
        {[
          { title: "平均顺序读取", value: avg("read"), unit: "MB/s" },
          { title: "平均顺序写入", value: avg("write"), unit: "MB/s" },
          { title: "随机 IO 吞吐", value: avg("iops"), unit: "IOPS" },
        ].map((s) => (
          <div key={s.title} className="panel">
            <Gauge />
            <span>
              {s.title}
              <strong>
                {s.value}
                <small>{s.unit}</small>
              </strong>
            </span>
          </div>
        ))}
      </div>
      {result ? (
        <>
          <p className="muted small">
            当前结果：{scenarios[result.scenario].title} · QD {result.qd} · 第{" "}
            {result.run} 次模拟。调整设置后需重新运行。
          </p>
          <div className="two-columns">
            <section className="panel">
              <h2>读取与写入速度</h2>
              <Chart
                data={data}
                unit="MB/s"
                lines={[
                  { key: "read", name: "读取", color: "#0aada5" },
                  { key: "write", name: "写入", color: "#6384db" },
                ]}
              />
            </section>
            <section className="panel">
              <h2>随机 IO 曲线</h2>
              <Chart
                data={data}
                unit="IOPS"
                lines={[{ key: "iops", name: "随机 IO", color: "#8c6ac7" }]}
              />
            </section>
          </div>
        </>
      ) : (
        <div className="panel empty">
          <Gauge size={38} />
          <h3>准备好探索性能了吗？</h3>
          <p>选择场景后运行测试，查看带宽与 IOPS 曲线。</p>
        </div>
      )}
      <section className="panel">
        <h3>如何理解这些指标</h3>
        <div className="three-columns">
          <div>
            <h4>IOPS · 每秒 IO 次数</h4>
            <p>需结合块大小和读写比例，不能只比较数字大小。</p>
          </div>
          <div>
            <h4>Latency · 请求延迟</h4>
            <p>每次 IO 的完成时间；队列加深可能提高吞吐，也增加等待。</p>
          </div>
          <div>
            <h4>4K · 小块访问</h4>
            <p>低 QD 4K 测试更适合观察交互场景，高 QD 反映并发能力。</p>
          </div>
        </div>
      </section>
    </>
  );
}
const faults = [
  {
    title: "寿命下降",
    note: "耐久估计持续降低",
    steps: [
      "备份重要数据并核验备份可读性",
      "核对寿命字段定义与主机写入量",
      "对照厂商 TBW 与保修条件",
      "按工作负载规划迁移与替换",
    ],
    outcome: "若耐久已接近厂商阈值，规划替换；存在错误时优先保护数据。",
  },
  {
    title: "温度过高",
    note: "持续负载时温度上升",
    steps: [
      "检查设备型号的温度规格",
      "观察温度与吞吐是否同时异常",
      "检查散热片、导热垫和机箱风道",
      "降低负载后重新观察趋势",
    ],
    outcome: "若温度回落且性能恢复，重点改善散热；持续异常需联系厂商。",
  },
  {
    title: "掉盘 / 识别异常",
    note: "设备间歇消失或不可识别",
    steps: [
      "优先备份可读取数据，停止不必要写入",
      "记录系统存储错误和发生时间",
      "关机断电后检查供电、线缆或插槽",
      "备份后检查厂商固件与兼容性说明",
    ],
    outcome: "持续掉盘或无法读取时，避免反复上电压测，咨询厂商或专业恢复服务。",
  },
  {
    title: "性能突然下降",
    note: "相同场景吞吐低于基线",
    steps: [
      "核对测试块大小、QD 与缓存条件",
      "查看温度是否触发热管理",
      "检查剩余空间与后台 IO 负载",
      "检查连接速率并与同条件基线比较",
    ],
    outcome: "排除温度、空间和后台负载后仍明显下降，继续检查设备日志。",
  },
  {
    title: "坏块增加",
    note: "介质错误或重分配计数增长",
    steps: [
      "备份可读取的重要文件",
      "确认 SMART 属性的厂商定义",
      "观察错误计数与不可纠正错误增量",
      "联系厂商评估更换，避免破坏性测试",
    ],
    outcome: "错误持续增长或已出现数据读取失败，应尽快停用并迁移数据。",
  },
];
export function Diagnosis() {
  const [selected, setSelected] = useState(0);
  const [checked, setChecked] = useState<Record<number, number[]>>({});
  const fault = faults[selected];
  const done = checked[selected] || [];
  return (
    <>
      <PageTitle
        eyebrow="TROUBLESHOOTING GUIDE"
        title="一步一步，找到异常的原因"
        description="先保护数据，再依据症状逐项排查。"
      />
      <div className="notice warning">
        <TriangleAlert size={19} />
        若设备有读取错误或频繁掉盘，优先备份。故障设备上反复压测、格式化可能增加数据恢复难度。
      </div>
      <div className="learning-layout">
        <aside className="panel fault-nav">
          <h3>选择故障现象</h3>
          {faults.map((f, i) => (
            <button
              key={f.title}
              className={selected === i ? "selected" : ""}
              onClick={() => setSelected(i)}
            >
              <strong>{f.title}</strong>
              <small>{f.note}</small>
            </button>
          ))}
        </aside>
        <section className="panel">
          <span className="eyebrow">DIAGNOSTIC CHECKLIST</span>
          <h2>{fault.title}</h2>
          <p className="muted">勾选已完成的检查，整理你的排查过程。</p>
          <Progress value={(done.length / fault.steps.length) * 100} />
          <div className="diagnostic-steps">
            {fault.steps.map((s, i) => (
              <label className={done.includes(i) ? "done" : ""} key={s}>
                <input
                  type="checkbox"
                  checked={done.includes(i)}
                  onChange={() =>
                    setChecked((c) => ({
                      ...c,
                      [selected]: done.includes(i)
                        ? done.filter((x) => x !== i)
                        : [...done, i],
                    }))
                  }
                />
                <span>
                  <small>步骤 0{i + 1}</small>
                  {s}
                </span>
              </label>
            ))}
          </div>
          {done.length === fault.steps.length ? (
            <div className="notice success">
              <CheckCircle2 size={22} />
              <div>
                <strong>检查清单已完成</strong>
                <p>{fault.outcome}</p>
                <small>
                  完成清单不代表故障已消除；请结合实际设备与日志确认。
                </small>
              </div>
            </div>
          ) : (
            <p className="small muted">
              已完成 {done.length} / {fault.steps.length} 步
            </p>
          )}
          <div className="flex-between">
            <button
              className="button outline"
              onClick={() => setChecked((c) => ({ ...c, [selected]: [] }))}
            >
              重新检查
            </button>
            <Link className="text-link" to="/chapters/diagnosis">
              学习诊断知识
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
export function Monitoring() {
  const [range, setRange] = useState(24);
  const [live, setLive] = useState(false);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => setOffset((v) => v + 1), 3000);
    return () => clearInterval(timer);
  }, [live]);
  const data = telemetry
    .slice(-range)
    .map((d, i) => ({
      ...d,
      temperature:
        d.temperature + (live ? Math.round(Math.sin(offset + i) * 2) : 0),
    }));
  const last = data[data.length - 1];
  return (
    <>
      <PageTitle
        eyebrow="OBSERVE · UNDERSTAND · LEARN"
        title="把设备状态，变成可读的趋势"
        description="用同一条时间线，关联温度、读写负载和设备健康。"
        action={
          <button
            className={`button ${live ? "outline" : "primary"}`}
            onClick={() => setLive(!live)}
          >
            <Activity size={17} />
            {live ? "暂停模拟刷新" : "开启模拟刷新"}
          </button>
        }
      />
      <div className="monitor-toolbar">
        <span className="pill">
          <ShieldCheck size={15} /> LAB SSD · 1 TB · 模拟数据
        </span>
        <div className="tabs">
          {[6, 12, 24].map((n) => (
            <button
              className={range === n ? "active" : ""}
              onClick={() => setRange(n)}
              key={n}
            >
              最近 {n} 小时
            </button>
          ))}
        </div>
      </div>
      <div className="overview-stats">
        {[
          { name: "温度", value: `${last.temperature}°C` },
          { name: "剩余耐久估计", value: `${last.health}%` },
          { name: "可用容量", value: `${last.capacity} GB` },
          { name: "写入速率", value: `${last.writes} MB/s` },
        ].map((s) => (
          <div className="stat-card" key={s.name}>
            <span>{s.name}</span>
            <div className="stat-value">{s.value}</div>
            <p>设备遥测示例</p>
          </div>
        ))}
      </div>
      <div className="two-columns">
        <section className="panel">
          <h2>
            温度趋势 <small>°C</small>
          </h2>
          <Chart
            data={data}
            unit="°C"
            lines={[{ key: "temperature", name: "温度", color: "#ed9f4a" }]}
          />
          <p className="small muted">
            高负载时温度升高，需结合型号规格判断是否异常。
          </p>
        </section>
        <section className="panel">
          <h2>
            读取与写入速率 <small>MB/s</small>
          </h2>
          <Chart
            data={data}
            unit="MB/s"
            lines={[
              { key: "reads", name: "读取速率", color: "#0aada5" },
              { key: "writes", name: "写入速率", color: "#6384db" },
            ]}
          />
          <p className="small muted">
            比较读写峰值与温度峰值，观察热响应滞后。
          </p>
        </section>
        <section className="panel">
          <h2>
            健康状态变化 <small>%</small>
          </h2>
          <Chart
            data={data}
            domain={[97, 100]}
            unit="%"
            lines={[{ key: "health", name: "剩余耐久估计", color: "#0aada5" }]}
          />
        </section>
        <section className="panel">
          <h2>
            可用容量趋势 <small>GB</small>
          </h2>
          <Chart
            data={data}
            unit="GB"
            lines={[{ key: "capacity", name: "可用容量", color: "#8c6ac7" }]}
          />
        </section>
      </div>
      <section className="panel">
        <h2>累计读取与写入量 · TB</h2>
        <Chart
          data={cumulativeIO.slice(-range)}
          unit="TB"
          lines={[
            { key: "readTotal", name: "累计读取量", color: "#0aada5" },
            { key: "writeTotal", name: "累计写入量", color: "#6384db" },
          ]}
        />
        <p className="small muted">
          按每小时示例平均速率积分得出的累计量，十进制单位；累计计数与速率是不同指标。
        </p>
      </section>
      <div className="notice">
        <Info size={18} />
        模拟刷新每 3
        秒改变温度演示值；横轴为示例小时，并非实时设备采样。健康估计和趋势不能保证预测突发故障。
      </div>
    </>
  );
}
