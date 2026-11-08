import css from "./page.module.css";

export default function Home() {
  return (
    <main className={css.main}>
      <h1 className={css.title}> JobTrack</h1>
      <p className={css.subtitle}>
        Track your job applications, recruiters and follow-ups in one place.
      </p>
    </main>
  );
}