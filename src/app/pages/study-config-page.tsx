import { useMemo, useState } from "react";
import { courseLibrary, learnerStatistics } from "../../mocks/dashboard-features.mock";

type SortMode = "learners-desc" | "learners-asc" | "code";

export function StudyConfigPage() {
  const [courses, setCourses] = useState(courseLibrary);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("learners-desc");

  const filteredCourses = useMemo(() => {
    const next = courses.filter((course) =>
      `${course.code} ${course.title}`.toLowerCase().includes(query.toLowerCase()),
    );

    next.sort((a, b) => {
      if (sortMode === "code") return a.code.localeCompare(b.code);
      if (sortMode === "learners-asc") return a.activeLearners - b.activeLearners;
      return b.activeLearners - a.activeLearners;
    });

    return next;
  }, [courses, query, sortMode]);

  const totalLearners = filteredCourses.reduce((sum, course) => sum + course.activeLearners, 0);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Study Config</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Course library management and learner statistics for curriculum operations.
        </p>
      </header>

      <article className="rounded-xl bg-card p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Course Library</h2>
            <p className="text-sm text-muted-foreground">Catalog of subjects, lesson packs, and assessment sets.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search course code/title..."
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="learners-desc">Learners (High-Low)</option>
              <option value="learners-asc">Learners (Low-High)</option>
              <option value="code">Course Code</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2">Course</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Lessons</th>
                <th className="pb-2">Quizzes</th>
                <th className="pb-2">Active Learners</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.code} className="border-b border-border/70 last:border-none">
                  <td className="py-3 font-medium">{course.code}</td>
                  <td className="py-3">{course.title}</td>
                  <td className="py-3">{course.lessons}</td>
                  <td className="py-3">{course.quizzes}</td>
                  <td className="py-3">{course.activeLearners.toLocaleString()}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCourses((prev) =>
                          prev.map((candidate) =>
                            candidate.code === course.code
                              ? { ...candidate, lessons: candidate.lessons + 1, quizzes: candidate.quizzes + 1 }
                              : candidate,
                          ),
                        )
                      }
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent"
                    >
                      Add Lesson (Mock)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filteredCourses.length} course(s), total active learners {totalLearners.toLocaleString()}.
        </p>
      </article>

      <div className="grid gap-4 md:grid-cols-3">
        {learnerStatistics.map((stat) => (
          <article key={stat.metric} className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.metric}</p>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{stat.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
