import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Activity,
  BookOpen,
  CircleHelp,
  Cpu,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useLearning } from "./state/LearningContext";
import { lessons } from "./data/curriculum";
import { Dashboard } from "./pages/Dashboard";
import { Chapters, LessonDetail } from "./pages/Learning";
import { Smart, Performance, Diagnosis, Monitoring } from "./pages/Lab";
import { QuizPage, Profile } from "./pages/Personal";
const navigation = [
  { path: "/", title: "学习概览", icon: LayoutDashboard },
  { path: "/chapters", title: "章节学习", icon: BookOpen },
  { path: "/smart", title: "SMART 参数", icon: ShieldCheck },
  { path: "/performance", title: "性能测试", icon: Gauge },
  { path: "/diagnosis", title: "故障诊断", icon: CircleHelp },
  { path: "/monitoring", title: "可视化监控", icon: Activity },
  { path: "/quiz", title: "知识测验", icon: GraduationCap },
  { path: "/profile", title: "个人中心", icon: UserRound },
];
export default function App() {
  const { state, stats, storageError } = useLearning();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setMenu(false);
    setSearch("");
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const results = search.trim()
    ? lessons.filter((l) =>
        `${l.title}${l.summary}${l.keyPoints.join("")}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      )
    : [];
  return (
    <div className="app-shell">
      {menu && (
        <button
          className="sidebar-backdrop"
          aria-label="关闭菜单"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Cpu size={25} />
          </span>
          <span>
            SSD<span className="brand-light"> LAB</span>
            <small>固态硬盘学习平台</small>
          </span>
        </Link>
        <div className="nav-label">LEARNING WORKSPACE</div>
        <nav>
          {navigation.map((n, i) => (
            <NavLink key={n.path} to={n.path} end={n.path === "/"}>
              <n.icon size={19} />
              <span>{n.title}</span>
              {i === 1 && <em>05</em>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-course">
          <div className="flex-between">
            <span>你的学习旅程</span>
            <span>{stats.progress}%</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${stats.progress}%` }} />
          </div>
          <small>每一步，都让存储更清晰。</small>
          <Link to="/chapters">
            探索学习路径 <BookOpen size={15} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          <span className="avatar">{state.name[0]}</span>
          <div>
            <strong>{state.name}</strong>
            <small>SSD 知识探索者</small>
          </div>
          <Link to="/profile" aria-label="打开个人中心">
            <UserRound size={18} />
          </Link>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-toggle"
              aria-label="切换导航"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span>学习工作台</span>
            <span className="breadcrumb-divider">/</span>
            <strong>
              {location.pathname.startsWith("/lessons")
                ? "课程详情"
                : navigation.find((n) => n.path === location.pathname)?.title ||
                  "章节学习"}
            </strong>
          </div>
          <div className="header-actions">
            <div className="searchbox">
              <Search size={17} />
              <input
                aria-label="搜索课程知识点"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索课程、知识点…"
              />
              {search && (
                <button
                  className="icon-button"
                  aria-label="清空搜索"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </button>
              )}
              {search.trim() && (
                <div className="search-results">
                  {results.length ? (
                    results.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => navigate(`/lessons/${l.id}`)}
                      >
                        <BookOpen size={16} />
                        <span>
                          {l.title}
                          <small>{l.summary}</small>
                        </span>
                      </button>
                    ))
                  ) : (
                    <p>没有匹配课程，试试「NAND」或「温度」。</p>
                  )}
                </div>
              )}
            </div>
            <Link className="header-avatar" to="/profile" aria-label="个人中心">
              {state.name[0]}
            </Link>
          </div>
        </header>
        {storageError && (
          <div className="notice">
            浏览器存储不可用，本次进度仅保留到页面关闭。
          </div>
        )}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/chapters/:id" element={<Chapters />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/smart" element={<Smart />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="*"
              element={
                <div className="empty">
                  <h1>页面未找到</h1>
                  <Link to="/" className="button primary">
                    返回学习概览
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>
        <footer>
          SSD LAB <span>让每一份数据，都有被理解的价值。</span>
          <span>学习演示 · 数据保存在此浏览器</span>
        </footer>
      </div>
    </div>
  );
}
