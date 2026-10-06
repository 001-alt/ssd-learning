import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Play,
  ShieldAlert,
} from "lucide-react";
import { chapters, lessons } from "../data/curriculum";
import { glossary } from "../data/glossary";
import { useChapters, useLearning } from "../state/LearningContext";
import { PageTitle, Progress } from "../components/UI";
export function Chapters() {
  const { id } = useParams();
  const list = useChapters();
  const chapter = list.find((c) => c.id === (id || "basics"));
  const { state } = useLearning();
  if (!chapter)
    return (
      <div className="empty">
        章节不存在。<Link to="/chapters">返回章节列表</Link>
      </div>
    );
  const ls = lessons.filter((l) => l.chapterId === chapter.id);
  return (
    <>
      <PageTitle
        eyebrow="STRUCTURED LEARNING"
        title="章节学习"
        description="从基本概念到动手实践，按自己的节奏建立知识体系。"
      />
      <div className="learning-layout">
        <aside className="panel chapter-navigation">
          <h3>学习路线</h3>
          {list.map((c) => (
            <Link
              key={c.id}
              to={`/chapters/${c.id}`}
              className={chapter.id === c.id ? "selected" : ""}
            >
              <span className="chapter-number">0{c.order}</span>
              <div>
                <strong>{c.title}</strong>
                <small>
                  {c.status} · {c.progress}%
                </small>
              </div>
              {c.progress === 100 && <CheckCircle2 size={17} />}
            </Link>
          ))}
        </aside>
        <div>
          <section className="chapter-banner">
            <span className="pill">
              CHAPTER 0{chapter.order} · {chapter.difficulty}
            </span>
            <h2>{chapter.title}</h2>
            <p>{chapter.description}</p>
            <div className="flex-between">
              <span>4 节课程 · 约 50 分钟</span>
              <strong>{chapter.progress}% 完成</strong>
            </div>
            <Progress value={chapter.progress} />
          </section>
          <section className="panel learning-goals">
            <h3>本章学习目标</h3>
            {chapter.goals.map((g) => (
              <p key={g}>
                <Check size={17} />
                {g}
              </p>
            ))}
            <div className="terms">
              {chapter.terms.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </section>
          <div className="section-heading">
            <h2>课程内容</h2>
            <Link className="text-link" to={`/quiz?chapter=${chapter.id}`}>
              章节测验
            </Link>
          </div>
          <div className="lesson-list">
            {ls.map((l, i) => (
              <Link
                className="panel lesson-row"
                key={l.id}
                to={`/lessons/${l.id}`}
              >
                <span
                  className={`lesson-index ${state.completed.includes(l.id) ? "done" : ""}`}
                >
                  {state.completed.includes(l.id) ? (
                    <Check size={22} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <div>
                  <h3>{l.title}</h3>
                  <p>{l.summary}</p>
                  <span>
                    <Clock3 size={13} /> {l.duration} 分钟
                  </span>
                </div>
                <span className="lesson-state">
                  {state.completed.includes(l.id) ? (
                    "已完成"
                  ) : (
                    <Play size={18} />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export function LessonDetail() {
  const { id } = useParams();
  const { state, complete, bookmark, visit } = useLearning();
  const lesson = lessons.find((l) => l.id === id);
  useEffect(() => {
    if (id && lessons.some((l) => l.id === id)) visit(id);
  }, [id]);
  if (!lesson)
    return (
      <div className="empty">
        课程不存在。<Link to="/chapters">返回章节列表</Link>
      </div>
    );
  const chapter = chapters.find((c) => c.id === lesson.chapterId)!;
  const next = lessons[lessons.indexOf(lesson) + 1];
  const done = state.completed.includes(lesson.id);
  return (
    <>
      <PageTitle
        eyebrow={`CHAPTER 0${chapter.order} / LESSON ${lesson.id.split("-")[1]}`}
        title={lesson.title}
        description={`${lesson.summary} · 预计 ${lesson.duration} 分钟`}
        action={
          <button
            className="button outline"
            onClick={() => bookmark(lesson.id)}
          >
            <Bookmark
              size={17}
              fill={
                state.bookmarks.includes(lesson.id) ? "currentColor" : "none"
              }
            />
            {state.bookmarks.includes(lesson.id) ? "已收藏" : "收藏课程"}
          </button>
        }
      />
      <div className="course-layout">
        <article className="panel lesson-content">
          <Link className="text-link" to={`/chapters/${chapter.id}`}>
            返回 {chapter.title}
          </Link>
          {(
            [
              { key: "definition", title: "01 / 概念定义" },
              { key: "purpose", title: "02 / 作用与价值" },
              { key: "principle", title: "03 / 工作原理" },
              { key: "example", title: "04 / 典型案例" },
            ] as const
          ).map((s) => (
            <section key={s.key}>
              <h2>{s.title}</h2>
              <p>{lesson.content[s.key]}</p>
            </section>
          ))}
          <div className="caution">
            <ShieldAlert size={23} />
            <div>
              <strong>关键注意事项</strong>
              <p>{lesson.content.caution}</p>
            </div>
          </div>
          <div className="lesson-actions">
            <button
              className={`button ${done ? "outline" : "primary"}`}
              onClick={() => complete(lesson.id)}
            >
              <CheckCircle2 size={18} />
              {done ? "本节已完成" : "标记本节完成"}
            </button>
            {done && (
              <Link
                className="button primary"
                to={
                  next ? `/lessons/${next.id}` : `/quiz?chapter=${chapter.id}`
                }
              >
                {next ? "继续下一节" : "开始章节测验"}
              </Link>
            )}
          </div>
          {!done && (
            <p className="small muted">
              阅读后标记完成，即可保存进度并继续下一节。
            </p>
          )}
        </article>
        <aside>
          <section className="panel">
            <h3>
              <Lightbulb size={18} /> 知识点总结
            </h3>
            <ul className="keypoints">
              {lesson.keyPoints.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h3>关键术语</h3>
            <dl className="glossary">
              {chapter.terms.map((t) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{glossary[t]}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="panel">
            <h3>本章课程</h3>
            <div className="course-toc">
              {lessons
                .filter((l) => l.chapterId === chapter.id)
                .map((l) => (
                  <Link
                    className={l.id === id ? "active" : ""}
                    key={l.id}
                    to={`/lessons/${l.id}`}
                  >
                    {state.completed.includes(l.id) && <Check size={14} />}
                    {l.title}
                  </Link>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
