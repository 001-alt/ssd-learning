import { Link } from "react-router-dom";
import {
  Activity,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  Flame,
  GraduationCap,
  Layers3,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { lessons } from "../data/curriculum";
import { weeklyActivity } from "../data/telemetry";
import { localDate, useChapters, useLearning } from "../state/LearningContext";
import { PageTitle, Progress } from "../components/UI";
const icons = [Cpu, ShieldCheck, Zap, Activity, Layers3];
export function Dashboard() {
  const { state, stats, checkIn } = useLearning();
  const chapters = useChapters();
  const next = lessons.find((l) => !state.completed.includes(l.id));
  const checked = state.checkIns.includes(localDate());
  return (
    <>
      <PageTitle
        eyebrow="YOUR LEARNING JOURNEY"
        title={`你好，${state.name} 👋`}
        description="从原理到实践，一起探索固态硬盘的世界。"
        action={
          <button
            className={`button ${checked ? "outline" : "primary"}`}
            onClick={checkIn}
          >
            <Flame size={17} />
            {checked ? "今日已打卡" : "学习打卡"}
          </button>
        }
      />
      <div className="overview-stats">
        {[
          {
            label: "学习章节",
            value: "05",
            suffix: "个章节",
            icon: Layers3,
            foot: "循序渐进的知识体系",
          },
          {
            label: "已完成课程",
            value: String(stats.completedLessons).padStart(2, "0"),
            suffix: `/ ${stats.totalLessons} 节`,
            icon: CheckCircle2,
            foot: "每一节都是新的收获",
          },
          {
            label: "总学习进度",
            value: stats.progress,
            suffix: "%",
            icon: Target,
            foot: `${stats.totalLessons - stats.completedLessons} 节课程等待探索`,
          },
          {
            label: "测验正确率",
            value: state.quizResults.length ? stats.accuracyRate : "—",
            suffix: state.quizResults.length ? "%" : "暂无记录",
            icon: GraduationCap,
            foot: state.quizResults.length
              ? `已完成 ${state.quizResults.length} 次挑战`
              : "完成测验，检验学习成果",
          },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="flex-between">
              <span>{s.label}</span>
              <s.icon size={19} />
            </div>
            <div className="stat-value">
              {s.value}
              <small>{s.suffix}</small>
            </div>
            <p>{s.foot}</p>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-primary">
          <section className="hero-learning">
            <div className="hero-copy">
              <span className="hero-badge">
                <Sparkles size={13} /> 为你推荐的学习路径
              </span>
              <h2>
                读懂存储，
                <br />
                从这里开始。
              </h2>
              <p>
                用一条清晰的学习路线，连接 SSD 原理、
                <br className="desktop-only" />
                健康监控与实际问题。
              </p>
              <Link
                to={next ? `/lessons/${next.id}` : "/quiz"}
                className="button hero-button"
              >
                <Play size={15} fill="currentColor" />
                {next ? "开始学习" : "挑战知识测验"}
              </Link>
              <div className="hero-meta">
                <span>
                  <BookOpen size={14} />5 个章节
                </span>
                <span>
                  <Clock3 size={14} />约 4 小时
                </span>
                <span>
                  <GraduationCap size={15} />
                  零基础友好
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="chip-diagram">
                <div className="chip-label">SOLID STATE DRIVE</div>
                <Cpu size={56} strokeWidth={1} />
                <strong>SSD</strong>
                <span>NAND FLASH · NVMe</span>
                <div className="chip-status">
                  <span /> KNOWLEDGE CONNECTED
                </div>
              </div>
              <span className="tech-tag tag-one">NAND FLASH</span>
              <span className="tech-tag tag-two">NVMe / PCIe</span>
            </div>
          </section>
          <section className="section">
            <div className="section-heading">
              <div>
                <h2>你的 SSD 学习路线</h2>
                <p>五个阶段，把知识连成一张完整的地图</p>
              </div>
              <Link to="/chapters" className="text-link">
                查看全部章节
              </Link>
            </div>
            <div className="roadmap">
              {chapters.map((c, i) => {
                const Icon = icons[i];
                return (
                  <Link
                    to={`/chapters/${c.id}`}
                    className={`roadmap-card ${c.color}`}
                    key={c.id}
                  >
                    <div className="flex-between">
                      <span className="chapter-icon">
                        <Icon size={23} />
                      </span>
                      <span className="step-number">0{c.order}</span>
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <div className="chapter-meta">
                      <span>{c.difficulty}</span>
                      <span>4 节课程 · 50 分钟</span>
                    </div>
                    <Progress value={c.progress} />
                    <div className="flex-between progress-label">
                      <span>{c.status}</span>
                      <span>{c.progress}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
          <section className="section continue-panel">
            <div className="section-heading">
              <div>
                <h2>{next ? "下一站，继续探索" : "学习路径已完成"}</h2>
                <p>把今天的一点进步，变成明天的知识积累</p>
              </div>
              <span className="pill">推荐课程</span>
            </div>
            {next ? (
              <div className="next-lesson">
                <span className="lesson-icon">
                  <BookOpen size={25} />
                </span>
                <div>
                  <h3>{next.title}</h3>
                  <p>
                    {next.summary} · {next.duration} 分钟
                  </p>
                </div>
                <Link to={`/lessons/${next.id}`} className="button outline">
                  进入课程
                </Link>
              </div>
            ) : (
              <Link to="/quiz" className="button primary">
                检验学习成果
              </Link>
            )}
          </section>
        </div>
        <aside className="dashboard-secondary">
          <section className="panel plan-panel">
            <div className="section-heading">
              <h2>今日学习计划</h2>
              <span className="soft-icon">
                <Target size={18} />
              </span>
            </div>
            <p className="muted">小目标，大进步</p>
            <div className="plan-list">
              {lessons
                .filter((l) => !state.completed.includes(l.id))
                .slice(0, 2)
                .map((l, i) => (
                  <Link key={l.id} to={`/lessons/${l.id}`}>
                    <span className="plan-check">{i + 1}</span>
                    <div>
                      <strong>{l.title}</strong>
                      <small>
                        <Clock3 size={12} /> {l.duration} 分钟 · 课程学习
                      </small>
                    </div>
                  </Link>
                ))}
              <Link to="/quiz">
                <span className="plan-check">
                  <Check size={15} />
                </span>
                <div>
                  <strong>完成一次知识测验</strong>
                  <small>
                    <GraduationCap size={13} /> 巩固今天的收获
                  </small>
                </div>
              </Link>
            </div>
            <div className="plan-tip">
              <Flame size={17} />
              <span>
                已打卡 <strong>{state.checkIns.length}</strong>{" "}
                天，保持探索的节奏
              </span>
            </div>
          </section>
          <section className="panel activity-panel">
            <div className="section-heading">
              <h2>学习节奏</h2>
              <span className="pill neutral">示例</span>
            </div>
            <div className="activity-total">
              241<small>分钟 / 本周</small>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#8797a8" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#eff7f8" }}
                    formatter={(v) => [`${v} 分钟`, "示例学习时长"]}
                  />
                  <Bar
                    dataKey="minutes"
                    fill="#1ab4a8"
                    radius={[5, 5, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="muted small">
              课程时长分布示例，不代表实际学习计时。
            </p>
          </section>
          <section className="knowledge-card">
            <span className="eyebrow">DID YOU KNOW?</span>
            <div className="knowledge-icon">
              <Cpu size={26} />
            </div>
            <h3>M.2 ≠ NVMe</h3>
            <p>
              M.2 是外形规格，NVMe 是通信协议。看起来相似的
              SSD，可能使用完全不同的接口。
            </p>
            <Link to="/lessons/basics-3">探索这个知识点</Link>
          </section>
        </aside>
      </div>
    </>
  );
}
