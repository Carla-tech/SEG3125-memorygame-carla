import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const THEMES = {
  sweets: {
    label: 'Sweet Treats',
    description: 'Soft dessert icons with a warm playful mood.',
    icons: ['🍓', '🧁', '🍯', '🍒', '🍩', '🍪', '🍋', '🍬'],
  },
  nature: {
    label: 'Nature Glow',
    description: 'Calm nature symbols for a softer visual memory task.',
    icons: ['🌿', '🌸', '🌙', '⭐', '🦋', '🍃', '🌼', '☁️'],
  },
};

const LEVELS = {
  beginner: { label: 'Beginner', pairs: 4, hint: '4 pairs - good for first-time users' },
  standard: { label: 'Standard', pairs: 6, hint: '6 pairs - balanced challenge' },
  challenge: { label: 'Challenge', pairs: 8, hint: '8 pairs - more memory load' },
};

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(themeKey, levelKey) {
  const icons = THEMES[themeKey].icons.slice(0, LEVELS[levelKey].pairs);
  return shuffle([...icons, ...icons].map((icon, index) => ({ id: `${icon}-${index}`, icon, matched: false })));
}

function App() {
  const [theme, setTheme] = useState('sweets');
  const [level, setLevel] = useState('beginner');
  const [deck, setDeck] = useState(() => buildDeck('sweets', 'beginner'));
  const [flipped, setFlipped] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('Choose a level and theme, then start matching pairs.');
  const [gameStarted, setGameStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const totalPairs = LEVELS[level].pairs;
  const completed = matches === totalPairs;

  const accuracy = useMemo(() => {
    if (moves === 0) return 100;
    return Math.max(0, Math.round((matches / moves) * 100));
  }, [matches, moves]);

  useEffect(() => {
    if (!gameStarted || completed) return undefined;
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [gameStarted, completed]);

  function startGame(nextTheme = theme, nextLevel = level) {
    setTheme(nextTheme);
    setLevel(nextLevel);
    setDeck(buildDeck(nextTheme, nextLevel));
    setFlipped([]);
    setMatches(0);
    setMoves(0);
    setSeconds(0);
    setGameStarted(true);
    setStatus('Game started. Flip two cards and look for a matching pair.');
  }

  function handleCardClick(card) {
    if (!gameStarted || completed) return;
    if (card.matched || flipped.find((item) => item.id === card.id) || flipped.length === 2) return;

    const nextFlipped = [...flipped, card];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((value) => value + 1);
      const [first, second] = nextFlipped;
      if (first.icon === second.icon) {
        setDeck((oldDeck) => oldDeck.map((item) => item.icon === first.icon ? { ...item, matched: true } : item));
        setMatches((value) => value + 1);
        setStatus('Match found! Keep going.');
        setTimeout(() => setFlipped([]), 650);
      } else {
        setStatus('Not a match. Try to remember where each symbol was.');
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }

  const gridClass = totalPairs === 4 ? 'grid beginner-grid' : totalPairs === 6 ? 'grid standard-grid' : 'grid challenge-grid';

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom" aria-label="GlowMatch navigation">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#top">GlowMatch<span className="brand-dot">.</span></a>
          <div className="ms-auto d-flex gap-2 flex-wrap">
            <a href="#setup" className="nav-link small fw-semibold">Setup</a>
            <a href="#game" className="nav-link small fw-semibold">Play</a>
            <a href="#contact" className="nav-link small fw-semibold">Contact</a>
          </div>
        </div>
      </nav>

      <header id="top" className="hero py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <p className="eyebrow">SEG3125 Assignment 3 - Memory Game</p>
              <h1 className="display-4 fw-bold mb-3">A gentle memory game for matching glowing pairs.</h1>
              <p className="lead text-muted">GlowMatch lets users choose a difficulty level and visual theme, then practice short-term visual memory by finding hidden pairs.</p>
              <div className="d-flex gap-3 flex-wrap mt-4">
                <a href="#setup" className="btn btn-primary btn-lg">Choose game settings</a>
                <button className="btn btn-outline-dark btn-lg" onClick={() => startGame()}>Quick start</button>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-card shadow-soft">
                <div className="score-row"><span>Memory focus</span><strong>Visual recall</strong></div>
                <div className="score-row"><span>Interaction</span><strong>Flip cards</strong></div>
                <div className="score-row"><span>Feedback</span><strong>Immediate</strong></div>
                <div className="mini-deck" aria-hidden="true"><span>🌸</span><span>?</span><span>🧁</span><span>?</span></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="setup" className="section-padding">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4">
                <p className="eyebrow">Setup</p>
                <h2 className="section-title">Select your memory challenge.</h2>
                <p className="text-muted">The setup uses clear input patterns and a small number of choices to support learnability.</p>
              </div>
              <div className="col-lg-8">
                <div className="setup-panel shadow-soft">
                  <fieldset className="mb-4">
                    <legend className="h5 fw-bold">1. Choose a level</legend>
                    <div className="row g-3">
                      {Object.entries(LEVELS).map(([key, item]) => (
                        <div className="col-md-4" key={key}>
                          <button className={`choice-card w-100 ${level === key ? 'selected' : ''}`} onClick={() => setLevel(key)} type="button" aria-pressed={level === key}>
                            <strong>{item.label}</strong>
                            <span>{item.hint}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mb-4">
                    <legend className="h5 fw-bold">2. Choose a visual theme</legend>
                    <div className="row g-3">
                      {Object.entries(THEMES).map(([key, item]) => (
                        <div className="col-md-6" key={key}>
                          <button className={`choice-card theme-choice w-100 ${theme === key ? 'selected' : ''}`} onClick={() => setTheme(key)} type="button" aria-pressed={theme === key}>
                            <strong>{item.label}</strong>
                            <span>{item.description}</span>
                            <span className="theme-icons" aria-hidden="true">{item.icons.slice(0, 4).join(' ')}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  <button className="btn btn-primary btn-lg" onClick={() => startGame(theme, level)}>Start selected game</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="game" className="section-padding bg-soft">
          <div className="container">
            <div className="row g-4 align-items-start">
              <div className="col-lg-4">
                <div className="status-card shadow-soft">
                  <p className="eyebrow">Live feedback</p>
                  <h2 className="h3 fw-bold">{completed ? 'Game complete!' : 'Playing board'}</h2>
                  <p className="status-text" aria-live="polite">{completed ? `Great work. You completed ${totalPairs} pairs in ${moves} moves.` : status}</p>
                  <div className="stats-grid">
                    <div><span>Moves</span><strong>{moves}</strong></div>
                    <div><span>Matches</span><strong>{matches}/{totalPairs}</strong></div>
                    <div><span>Time</span><strong>{seconds}s</strong></div>
                    <div><span>Accuracy</span><strong>{accuracy}%</strong></div>
                  </div>
                  <button className="btn btn-outline-dark w-100 mt-3" onClick={() => startGame(theme, level)}>Restart</button>
                  {completed && <a href="#setup" className="btn btn-primary w-100 mt-2">Try another level</a>}
                </div>
              </div>
              <div className="col-lg-8">
                <div className="game-board-wrapper shadow-soft">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <div>
                      <h2 className="h4 fw-bold mb-1">{THEMES[theme].label} - {LEVELS[level].label}</h2>
                      <p className="text-muted mb-0">Flip two cards. Matched cards stay visible.</p>
                    </div>
                    <span className="badge rounded-pill text-bg-light">{deck.length} cards</span>
                  </div>
                  <div className={gridClass} role="grid" aria-label="Memory card grid">
                    {deck.map((card) => {
                      const visible = card.matched || flipped.find((item) => item.id === card.id);
                      return (
                        <button
                          key={card.id}
                          className={`memory-card ${visible ? 'is-visible' : ''} ${card.matched ? 'is-matched' : ''}`}
                          onClick={() => handleCardClick(card)}
                          type="button"
                          aria-label={visible ? `Card showing ${card.icon}` : 'Hidden memory card'}
                        >
                          <span aria-hidden="true">{visible ? card.icon : '?'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4">
                <p className="eyebrow">Design logic</p>
                <h2 className="section-title">Built for learnability.</h2>
              </div>
              <div className="col-lg-8">
                <div className="row g-3">
                  <div className="col-md-4"><div className="principle-card"><h3>Simple choices</h3><p>Levels and themes are grouped so users can start quickly.</p></div></div>
                  <div className="col-md-4"><div className="principle-card"><h3>Gestalt grouping</h3><p>Cards use similarity, proximity, and figure-ground contrast.</p></div></div>
                  <div className="col-md-4"><div className="principle-card"><h3>Immediate feedback</h3><p>Status messages and matched states help users recover from mistakes.</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer-section py-5">
        <div className="container d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center">
          <div>
            <p className="eyebrow text-accent">Contact</p>
            <h2 className="h3 fw-bold">Carla El Hajj Ali</h2>
            <p className="mb-0">Email: <a href="mailto:carla.hajjali@gmail.com">carla.hajjali@gmail.com</a></p>
          </div>
          <a className="btn btn-light btn-lg" href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
