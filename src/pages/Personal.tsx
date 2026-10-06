import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  CheckCircle2,
  Flame,
  GraduationCap,
  RotateCcw,
  Trophy,
  UserRound,
} from "lucide-react";
import { chapters, lessons, quizzes } from "../data/curriculum";
import { localDate, useChapters, useLearning } from "../state/LearningContext";
import { Empty, PageTitle, Progress } from "../components/UI";
export function QuizPage() {
  const [params, setParams] = useSearchParams();
  const chapterId = chapters.some((c) => c.id === params.get("chapter"))
    ? params.get("chapter")!
    : "basics";
  const questions = quizzes.filter((q) => q.chapterId === chapterId);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { saveQuiz } = useLearning();
  const correct = questions.filter(
    (q) => (answers[q.id] || "").trim() === q.answer,
  ).length;
  const answered = questions.filter((q) => answers[q.id]?.trim()).length;
  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };
  function submit() {
    if (answered !== questions.length || submitted) return;
    saveQuiz({ chapterId, correct, total: questions.length });
    setSubmitted(true);
  }
  return (
    <>
      <PageTitle
        eyebrow="TEST YOUR KNOWLEDGE"
        title="让知识，真正成为你的能力"
        description="选择一个章节，完成选择、判断和填空练习。"
      />
      <div className="quiz-layout">
        <aside className="panel">
          <h3>选择章节</h3>
          <div className="quiz-chapters">
            {chapters.map((c) => (
              <button
                key={c.id}
                className={chapterId === c.id ? "selected" : ""}
                onClick={() => {
                  setParams({ chapter: c.id });
                  reset();
                }}
              >
                {c.title}
              </button>
            ))}
          </div>
          <div className="quiz-progress">
            <strong>
              {answered} / {questions.length} 题已回答
            </strong>
            <Progress value={(answered / questions.length) * 100} />
            <small>所有题目完成后可以提交。</small>
          </div>
        </aside>
        <div>
          {submitted && (
            <section className="quiz-result panel" role="status">
              <Trophy size={40} />
              <div>
                <span className="eyebrow">CHALLENGE COMPLETED</span>
                <h2>
                  {Math.round((correct / questions.length) * 100)} 分 ·{" "}
                  {correct} / {questions.length} 题正确
                </h2>
                <p>
                  {correct === questions.length
                    ? "全部答对！继续挑战下一个章节。"
                    : "查看下面的解析，找到值得再学一遍的知识点。"}
                </p>
              </div>
            </section>
          )}
          <div className="quiz-questions">
            {questions.map((q, i) => (
              <section key={q.id} className="panel quiz-question">
                <span className="pill neutral">
                  {q.type === "choice"
                    ? "选择题"
                    : q.type === "boolean"
                      ? "判断题"
                      : "填空题"}{" "}
                  · 0{i + 1}
                </span>
                <h3>{q.question}</h3>
                {q.options ? (
                  <fieldset disabled={submitted}>
                    <legend className="sr-only">{q.question}</legend>
                    {q.options.map((o) => (
                      <label
                        className={`answer-option ${answers[q.id] === o ? "chosen" : ""} ${submitted && o === q.answer ? "correct-answer" : ""}`}
                        key={o}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === o}
                          onChange={() =>
                            setAnswers((a) => ({ ...a, [q.id]: o }))
                          }
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </fieldset>
                ) : (
                  <input
                    className="field"
                    aria-label={q.question}
                    placeholder="输入你的答案"
                    disabled={submitted}
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                    }
                  />
                )}
                {submitted && (
                  <div
                    className={`explanation ${(answers[q.id] || "").trim() === q.answer ? "right" : "wrong"}`}
                  >
                    <strong>
                      {(answers[q.id] || "").trim() === q.answer
                        ? "回答正确"
                        : `正确答案：${q.answer}`}
                    </strong>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </section>
            ))}
          </div>
          <div className="lesson-actions">
            {submitted ? (
              <>
                <button className="button outline" onClick={reset}>
                  <RotateCcw size={17} />
                  重新挑战
                </button>
                <Link className="button outline" to={`/chapters/${chapterId}`}>
                  重新学习
                </Link>
                {chapters.findIndex((c) => c.id === chapterId) <
                  chapters.length - 1 && (
                  <button
                    className="button primary"
                    onClick={() => {
                      setParams({
                        chapter:
                          chapters[
                            chapters.findIndex((c) => c.id === chapterId) + 1
                          ].id,
                      });
                      reset();
                      window.scrollTo(0, 0);
                    }}
                  >
                    继续挑战
                  </button>
                )}
              </>
            ) : (
              <button
                className="button primary"
                disabled={answered !== questions.length}
                onClick={submit}
              >
                <CheckCircle2 size={17} />
                提交答案（{answered}/{questions.length}）
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export function Profile() {
  const { state, stats, rename, checkIn } = useLearning();
  const list = useChapters();
  const [name, setName] = useState(state.name);
  const [saved, setSaved] = useState(false);
  const next = lessons.find((l) => !state.completed.includes(l.id));
  const completedChapters = list.filter((c) => c.progress === 100);
  const bookmarks = lessons.filter((l) => state.bookmarks.includes(l.id));
  return (
    <>
      <PageTitle
        eyebrow="MY LEARNING SPACE"
        title="个人学习中心"
        description="看见你的积累，也找到下一步的方向。"
      />
      <section className="panel profile-header">
        <span className="large-avatar">
          <UserRound size={40} />
        </span>
        <div>
          <h2>{state.name}</h2>
          <p>SSD 知识探索者 · 已打卡 {state.checkIns.length} 天</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              rename(name);
              setSaved(true);
            }}
          >
            <input
              className="field"
              aria-label="昵称"
              value={name}
              maxLength={24}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
            <button className="button outline" type="submit">
              保存昵称
            </button>
            {saved && <small role="status">已保存</small>}
          </form>
        </div>
        <button className="button primary" onClick={checkIn}>
          <Flame size={18} />
          {state.checkIns.includes(localDate()) ? "今日已打卡" : "今日打卡"}
        </button>
      </section>
      <div className="overview-stats">
        {[
          {
            name: "课程完成",
            value: `${stats.completedLessons}/${stats.totalLessons}`,
          },
          { name: "完成章节", value: `${completedChapters.length}/5` },
          {
            name: "答题正确率",
            value: state.quizResults.length ? `${stats.accuracyRate}%` : "暂无",
          },
          { name: "预计剩余学习", value: `${stats.remainingStudyDays} 天` },
        ].map((s) => (
          <div className="stat-card" key={s.name}>
            <span>{s.name}</span>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="two-columns">
        <section className="panel">
          <h2>章节进度</h2>
          {list.map((c) => (
            <Link
              className="profile-progress"
              to={`/chapters/${c.id}`}
              key={c.id}
            >
              <div className="flex-between">
                <strong>{c.title}</strong>
                <span>{c.progress}%</span>
              </div>
              <Progress value={c.progress} />
            </Link>
          ))}
        </section>
        <section className="panel">
          <h2>
            <Bookmark size={20} /> 收藏知识点
          </h2>
          {bookmarks.length ? (
            bookmarks.map((l) => (
              <Link className="saved-lesson" to={`/lessons/${l.id}`} key={l.id}>
                <strong>{l.title}</strong>
                <small>{l.summary}</small>
              </Link>
            ))
          ) : (
            <Empty>在课程详情页收藏知识点，方便随时回来复习。</Empty>
          )}
          {next && (
            <div className="next-recommend">
              <span className="eyebrow">NEXT UP</span>
              <h3>{next.title}</h3>
              <Link className="button primary" to={`/lessons/${next.id}`}>
                继续学习
              </Link>
            </div>
          )}
        </section>
        <section className="panel">
          <h2>
            <GraduationCap size={20} /> 测验记录
          </h2>
          {state.quizResults.length ? (
            <div className="result-list">
              {[...state.quizResults].reverse().map((r) => (
                <div key={r.id}>
                  <div>
                    <strong>
                      {chapters.find((c) => c.id === r.chapterId)?.title}
                    </strong>
                    <small>{new Date(r.date).toLocaleString("zh-CN")}</small>
                  </div>
                  <span>
                    {Math.round((r.correct / r.total) * 100)} 分
                    <small>
                      {r.correct}/{r.total} 题
                    </small>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty>
              还没有测验记录。
              <Link to="/quiz" className="text-link">
                开始第一次挑战
              </Link>
            </Empty>
          )}
        </section>
        <section className="panel">
          <h2>
            <Flame size={20} /> 学习打卡
          </h2>
          <div className="checkin-calendar">
            {Array.from({ length: 28 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - 27 + i);
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              return (
                <span
                  key={key}
                  className={state.checkIns.includes(key) ? "checked" : ""}
                  title={`${key} ${state.checkIns.includes(key) ? "已打卡" : "未打卡"}`}
                >
                  {d.getDate()}
                </span>
              );
            })}
          </div>
          <p className="muted small">最近 28 天 · 青色代表已打卡</p>
          <div className="achievement">
            <Trophy size={28} />
            <div>
              <strong>
                {completedChapters.length ? "章节探索者" : "旅程已经开始"}
              </strong>
              <p>
                {completedChapters.length
                  ? `已完成 ${completedChapters.length} 个完整章节`
                  : "完成任意章节，解锁你的第一个成就。"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
