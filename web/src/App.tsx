import { useState } from 'react';
import { TossCalendar } from './components/TossCalendar';

function App() {
  const [mode, setMode] = useState<'landing' | 'calendar'>('landing');

  if (mode === 'landing') {
    return (
      <div className="app landing-app">
        <main className="landing-main">
          <div className="landing-card">
            <div className="landing-logo">⚽ 풋살계엄령</div>
            <p className="landing-subtitle">풋살 일정 관리 Football Manager</p>
            <div className="landing-buttons">
              <button
                type="button"
                className="landing-btn primary"
                onClick={() => setMode('calendar')}
              >
                Web 이동
              </button>
              <a
                className="landing-btn secondary"
                href="/app-debug.apk"
                download
              >
                App 다운
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="toss-header">
        <div className="toss-header-content">
          <span className="toss-logo-icon" aria-hidden>
            ⚽
          </span>
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