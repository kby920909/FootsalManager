import { TossCalendar } from './components/TossCalendar';

function App() {
  return (
    <div className="app">
      <header className="toss-header">
        <div className="toss-header-content">
          <span className="toss-logo-icon" aria-hidden>⚽</span>
          <div className="toss-logo-text">풋살계엄령</div>
          <span className="toss-logo-subtitle">Football Manager</span>
        </div>
      </header>
      <main className="toss-main">
        <section className="toss-section">
          <h2 className="toss-section-title">일정</h2>
          <TossCalendar />
        </section>
      </main>
    </div>
  );
}

export default App;
