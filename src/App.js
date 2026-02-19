import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LevelBuilder from './LevelBuilder';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

const INITIAL_LEVELS = [
  // Levels 1-5: Counting (Gestures)
  { id: 1, type: 'math', icon: '☝️', title: 'Count to 1', target: 1, hint: 'Show 1 finger.', inputMode: 'camera' },
  { id: 2, type: 'math', icon: '✌️', title: 'Count to 2', target: 2, hint: 'Show 2 fingers.', inputMode: 'camera' },
  { id: 3, type: 'math', icon: '3️⃣', title: 'Count to 3', target: 3, hint: 'Show 3 fingers.', inputMode: 'camera' },
  { id: 4, type: 'math', icon: '4️⃣', title: 'Count to 4', target: 4, hint: 'Show 4 fingers.', inputMode: 'camera' },
  { id: 5, type: 'math', icon: '🖐️', title: 'Count to 5', target: 5, hint: 'Show 5 fingers.', inputMode: 'camera' },

  // Levels 6-10: Simple Addition (Gestures)
  { id: 6, type: 'math', icon: '🍎', title: '1 + 1 = ?', target: 2, hint: 'Show 2 fingers.', inputMode: 'camera', visual: { type: 'apple', count1: 1, count2: 1, op: '+' } },
  { id: 7, type: 'math', icon: '🍌', title: '2 + 1 = ?', target: 3, hint: 'Show 3 fingers.', inputMode: 'camera', visual: { type: 'banana', count1: 2, count2: 1, op: '+' } },
  { id: 8, type: 'math', icon: '🍇', title: '2 + 2 = ?', target: 4, hint: 'Show 4 fingers.', inputMode: 'camera', visual: { type: 'grape', count1: 2, count2: 2, op: '+' } },
  { id: 9, type: 'math', icon: '🍊', title: '3 + 2 = ?', target: 5, hint: 'Show 5 fingers.', inputMode: 'camera', visual: { type: 'orange', count1: 3, count2: 2, op: '+' } },
  { id: 10, type: 'math', icon: '🔟', title: '5 + 5 = ?', target: 10, hint: 'Show 10 fingers.', inputMode: 'camera', visual: { type: 'star', count1: 5, count2: 5, op: '+' } },

  // Levels 11-15: Multiple Choice Questions
  { id: 11, type: 'mcq', icon: '🎯', title: 'What is 3 + 2?', target: '5', hint: 'Pick the right answer!', inputMode: 'mcq', options: ['3', '4', '5', '6'] },
  { id: 12, type: 'mcq', icon: '🧩', title: 'Which number comes after 7?', target: '8', hint: 'Think about counting!', inputMode: 'mcq', options: ['6', '7', '8', '9'] },
  { id: 13, type: 'mcq', icon: '🎨', title: 'What is 10 - 3?', target: '7', hint: 'Count backwards!', inputMode: 'mcq', options: ['5', '6', '7', '8'] },
  { id: 14, type: 'mcq', icon: '🌈', title: 'Which is the biggest number?', target: '9', hint: 'Find the largest!', inputMode: 'mcq', options: ['3', '5', '7', '9'] },
  { id: 15, type: 'mcq', icon: '🎪', title: 'How many sides does a triangle have?', target: '3', hint: 'Think of a triangle!', inputMode: 'mcq', options: ['2', '3', '4', '5'] },

  // Levels 16-20: Typing Answers
  { id: 16, type: 'math', icon: '⌨️', title: 'Type: 5 + 3', target: 8, hint: 'Type 8', inputMode: 'keyboard', visual: { type: 'car', count1: 5, count2: 3, op: '+' } },
  { id: 17, type: 'math', icon: '⌨️', title: 'Type: 6 - 2', target: 4, hint: 'Type 4', inputMode: 'keyboard', visual: { type: 'ball', count1: 6, count2: 2, op: '-' } },
  { id: 18, type: 'math', icon: '⌨️', title: 'Type: 10 - 5', target: 5, hint: 'Type 5', inputMode: 'keyboard', visual: { type: 'cookie', count1: 10, count2: 5, op: '-' } },
  { id: 19, type: 'math', icon: '⌨️', title: 'Type: 7 + 0', target: 7, hint: 'Type 7', inputMode: 'keyboard', visual: { type: 'cat', count1: 7, count2: 0, op: '+' } },
  { id: 20, type: 'math', icon: '⌨️', title: 'Type: 9 - 9', target: 0, hint: 'Type 0', inputMode: 'keyboard', visual: { type: 'dog', count1: 9, count2: 9, op: '-' } },

  // Level 21-25: Voice Answers
  { id: 21, type: 'math', icon: '🎙️', title: 'Say: 1 + 1', target: 2, hint: 'Say "Two"', inputMode: 'voice', visual: { type: 'bird', count1: 1, count2: 1, op: '+' } },
  { id: 22, type: 'math', icon: '🎙️', title: 'Say: 2 + 2', target: 4, hint: 'Say "Four"', inputMode: 'voice', visual: { type: 'fish', count1: 2, count2: 2, op: '+' } },
  { id: 23, type: 'math', icon: '🎙️', title: 'Say: 5 - 2', target: 3, hint: 'Say "Three"', inputMode: 'voice', visual: { type: 'frog', count1: 5, count2: 2, op: '-' } },
  { id: 24, type: 'math', icon: '🎙️', title: 'Say: 3 + 3', target: 6, hint: 'Say "Six"', inputMode: 'voice', visual: { type: 'sun', count1: 3, count2: 3, op: '+' } },
  { id: 25, type: 'math', icon: '🎙️', title: 'Say: 10 - 1', target: 9, hint: 'Say "Nine"', inputMode: 'voice', visual: { type: 'moon', count1: 10, count2: 1, op: '-' } },

  // Level 26-30: Multiplication with Visuals
  { id: 26, type: 'math', icon: '✖️', title: '2 x 2', target: 4, hint: '2 groups of 2', inputMode: 'keyboard', visual: { type: 'flower', count1: 2, count2: 2, op: 'x' } },
  { id: 27, type: 'math', icon: '✖️', title: '3 x 2', target: 6, hint: '3 groups of 2', inputMode: 'keyboard', visual: { type: 'star', count1: 3, count2: 2, op: 'x' } },
  { id: 28, type: 'math', icon: '✖️', title: '4 x 1', target: 4, hint: '4 groups of 1', inputMode: 'keyboard', visual: { type: 'apple', count1: 4, count2: 1, op: 'x' } },
  { id: 29, type: 'math', icon: '✖️', title: '2 x 3', target: 6, hint: '2 groups of 3', inputMode: 'keyboard', visual: { type: 'heart', count1: 2, count2: 3, op: 'x' } },
  { id: 30, type: 'math', icon: '✖️', title: '5 x 2', target: 10, hint: '5 groups of 2', inputMode: 'keyboard', visual: { type: 'diamond', count1: 5, count2: 2, op: 'x' } }
];

function App() {
  const [levels, setLevels] = useState(() => {
    const savedLevels = localStorage.getItem('math_lab_mcq');
    return savedLevels ? JSON.parse(savedLevels) : INITIAL_LEVELS;
  });

  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState('');
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [feedback, setFeedback] = useState("Show me your hands!");
  const [feedbackType, setFeedbackType] = useState("neutral");
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showCalmOverlay, setShowCalmOverlay] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [levelStats, setLevelStats] = useState({ stars: 0, time: 0 });

  const appRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const levelRef = useRef(0);
  const clickTracker = useRef({ count: 0, lastTime: 0 });

  const gameState = useRef({
    isDetecting: false,
    levelStartTime: 0,
    holdStartTime: 0,
    holdDuration: 1500
  });

  // --- Helper Functions (Defined before Effects) ---

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateFeedback = React.useCallback((msg, type) => {
    setFeedback(msg);
    setFeedbackType(type);
  }, []);

  const handleNextLevelClick = React.useCallback(() => {
    setShowVictory(false);
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setScreen('final');
    }
  }, [currentLevel, levels]);

  const handleWin = React.useCallback(() => {
    gameState.current.isDetecting = false;

    const timeTakenSec = (Date.now() - gameState.current.levelStartTime) / 1000;
    let stars = 1;
    if (timeTakenSec < 5) stars = 3;
    else if (timeTakenSec < 10) stars = 2;

    const newScore = score + (stars * 10);
    setScore(newScore);
    if (currentLevel === unlocked) setUnlocked(unlocked + 1);

    localStorage.setItem('gesture_save', JSON.stringify({
      user, score: newScore, unlocked: Math.max(unlocked, currentLevel + 1)
    }));

    setLevelStats({ stars, time: Math.floor(timeTakenSec) });
    setShowVictory(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [score, currentLevel, unlocked, user]);

  const checkInput = React.useCallback((val) => {
    const lvl = levels[levelRef.current];
    if (!lvl) return;

    const target = lvl.target.toString().toLowerCase();
    const input = val.toString().toLowerCase();

    if (lvl.inputMode === 'keyboard' && val !== "") {
      speak(val);
    }

    const numWords = {
      'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
      'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10', 'zero': '0'
    };

    let normalizedInput = input;
    if (lvl.inputMode === 'voice' && numWords[input]) {
      normalizedInput = numWords[input];
    }

    if (normalizedInput === target || input.includes(target)) {
      handleWin();
    } else {
      updateFeedback("Try again!", "neutral");
      setTimeout(() => setFeedback(""), 1000);
    }
  }, [levels, handleWin, updateFeedback]);

  const checkLogic = React.useCallback((allHands) => {
    const lvl = levels[levelRef.current];
    if (!lvl) return;

    let isCorrect = false;
    const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    const isFingerOpen = (lm, tip) => dist(lm[tip], lm[0]) > dist(lm[tip - 2], lm[0]);
    const isThumbOpen = (lm) => dist(lm[4], lm[17]) > dist(lm[3], lm[17]);
    const countFingers = (lm) => {
      let count = 0;
      if (isThumbOpen(lm)) count++;
      if (isFingerOpen(lm, 8)) count++;
      if (isFingerOpen(lm, 12)) count++;
      if (isFingerOpen(lm, 16)) count++;
      if (isFingerOpen(lm, 20)) count++;
      return count;
    };

    if (lvl.type === 'math') {
      let total = 0;
      for (const hand of allHands) {
        total += countFingers(hand);
      }
      if (total === lvl.target) isCorrect = true;
      else updateFeedback(`I count ${total}...`, "neutral");
    }

    if (isCorrect) {
      if (gameState.current.holdStartTime === 0) gameState.current.holdStartTime = Date.now();
      const elapsed = Date.now() - gameState.current.holdStartTime;
      updateFeedback(`Hold it... ${Math.ceil((gameState.current.holdDuration - elapsed) / 1000)}s`, "success");

      if (elapsed > gameState.current.holdDuration) handleWin();
    } else {
      gameState.current.holdStartTime = 0;
    }
  }, [levels, updateFeedback, handleWin]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech Recognition not supported in this browser. Try Chrome.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback("Listening...", "neutral");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      checkInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setFeedback("Error listening. Try again.", "neutral");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const addLevel = (newLevel) => {
    setLevels(prev => [...prev, newLevel]);
  };

  const startGame = () => {
    if (!user) setUser('Hero');
    setScreen('map');
  };

  const loadLevel = (idx) => {
    setCurrentLevel(idx);
    setScreen('game');
  };

  const handleReset = () => {
    localStorage.removeItem('math_lab_mcq');
    localStorage.removeItem('custom_levels');
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('gesture_save');
    window.location.reload();
  };

  // --- Effects ---

  useEffect(() => {
    if (levels.length > INITIAL_LEVELS.length) {
      localStorage.setItem('math_lab_mcq', JSON.stringify(levels));
    }
  }, [levels]);

  useEffect(() => {
    const saved = localStorage.getItem('gesture_save');
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user || 'Hero');
      setScore(data.score || 0);
      setUnlocked(data.unlocked || 0);
      setScreen('map');
    }
  }, []);

  useEffect(() => {
    levelRef.current = currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    if (screen === 'game') {
      gameState.current.isDetecting = true;
      gameState.current.levelStartTime = Date.now();
      gameState.current.holdStartTime = 0;
      const lvl = levels[currentLevel];
      setHintVisible(false);

      if (lvl.inputMode === 'keyboard') {
        setFeedback("Type your answer...");
      } else if (lvl.inputMode === 'voice') {
        setFeedback("Tap Mic to Speak...");
      } else {
        setFeedback("Show me your hands!");
      }

      setFeedbackType("neutral");
      setInputValue("");
      setIsListening(false);
    }
  }, [currentLevel, screen, levels]);

  // Keyboard & Click Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screen === 'game') {
        const lvl = levels[currentLevel];

        if (e.key === 'Escape') {
          setScreen('map');
          return;
        }

        if (lvl.inputMode === 'keyboard') {
          if (e.key === 'Enter') {
            checkInput(inputValue);
          } else if (e.key.length === 1) { // Single character
            speak(e.key);
          }
        }
      } else if (showVictory) {
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          handleNextLevelClick();
        }
      }
    };

    const handleGlobalClick = () => {
      const now = Date.now();
      if (now - clickTracker.current.lastTime < 1000) {
        clickTracker.current.count++;
      } else {
        clickTracker.current.count = 1;
      }
      clickTracker.current.lastTime = now;

      if (clickTracker.current.count >= 5) {
        setShowCalmOverlay(true);
        clickTracker.current.count = 0;
        speak("It's okay. Take a deep breath.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [screen, currentLevel, inputValue, levels, showVictory, checkInput, handleNextLevelClick]);

  // Camera Logic
  useEffect(() => {
    if (screen !== 'game') return;
    const lvl = levels[currentLevel];
    if (lvl && lvl.inputMode !== 'camera' && lvl.type !== 'gesture') return;

    if (!videoRef.current || !canvasRef.current || !window.Hands || !window.Camera) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const hands = new window.Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: '#00cec9', lineWidth: 4 });
          window.drawLandmarks(ctx, landmarks, { color: '#fab1a0', lineWidth: 2 });
        }
        if (gameState.current.isDetecting) {
          checkLogic(results.multiHandLandmarks);
        }
      } else {
        if (gameState.current.isDetecting) {
          gameState.current.holdStartTime = 0;
          updateFeedback("Show me your hands!", "neutral");
        }
      }
      ctx.restore();
    });

    const camera = new window.Camera(video, {
      onFrame: async () => { await hands.send({ image: video }); },
      width: 480, height: 360
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
  }, [screen, currentLevel, levels, checkLogic, updateFeedback]); // Added checkLogic, updateFeedback

  const renderVisuals = (level) => {
    if (!level.visual) return null;
    const { type, count1, count2, op } = level.visual;
    const icons = {
      apple: '🍎', banana: '🍌', grape: '🍇', orange: '🍊', star: '⭐',
      car: '🚗', ball: '⚽', cookie: '🍪', cat: '🐱', dog: '🐶',
      bird: '🐦', fish: '🐟', frog: '🐸', sun: '☀️', moon: '🌙',
      flower: '🌸', heart: '❤️', diamond: '💎'
    };
    const icon = icons[type] || '❓';

    if (op === 'x') {
      return (
        <div className="visual-container">
          {Array.from({ length: count1 }).map((_, i) => (
            <div key={i} className="visual-group">
              {Array.from({ length: count2 }).map((_, j) => (
                <span key={j} className="visual-icon">{icon}</span>
              ))}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="visual-container">
          {Array.from({ length: count1 }).map((_, i) => <span key={`a-${i}`} className="visual-icon">{icon}</span>)}
          <span className="visual-op">{op}</span>
          {Array.from({ length: count2 }).map((_, i) => <span key={`b-${i}`} className="visual-icon">{icon}</span>)}
        </div>
      );
    }
  };
  return (
    <div className="app-container" ref={appRef}>
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>

      {screen === 'login' && (
        <div className="glass-panel">
          <div className="avatar">🧙‍♂️</div>
          <h1>Math Quest</h1>
          <p>Master Math Skills</p>
          <input type="text" placeholder="Enter Hero Name" onChange={(e) => setUser(e.target.value)} />
          <button className="btn-main" onClick={startGame}>Start Adventure</button>
          <div style={{ marginTop: '20px' }}>
            <button
              className="btn-small"
              onClick={() => setScreen('builder')}
              style={{ background: '#6c5ce7', color: 'white', padding: '10px 20px', fontSize: '1rem' }}
            >
              🛠️ Level Builder
            </button>
          </div>
        </div>
      )}

      {screen === 'map' && (
        <div className="glass-panel">
          <div className="map-header">
            <h2>World Map</h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className="level-badge">Hero: {user}</span>
              <span className="level-badge" style={{ background: '#fd79a8' }}>Score: {score}</span>
              <button
                className="btn-small"
                onClick={handleLogout}
                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              >
                Logout
              </button>
              <button
                className="btn-small"
                onClick={handleReset}
                style={{ fontSize: '0.8rem', padding: '5px 10px', background: '#d63031' }}
              >
                Reset Progress
              </button>
            </div>
          </div>
          <div className="grid-container">
            {levels.map((lvl, idx) => (
              <div
                key={idx}
                className={`level-node ${idx > unlocked ? 'locked' : ''}`}
                onClick={() => idx <= unlocked && loadLevel(idx)}
              >
                <div className="node-num">{idx + 1}</div>
                <div className="node-icon">{lvl.icon}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {screen === 'game' && (
        <div className="glass-panel">
          <div className="top-hud">
            <button className="btn-small" onClick={() => setScreen('map')} title="Press Esc">❌ Exit</button>
            <span className="level-badge">{levels[currentLevel].type}</span>
            <button className="btn-small" onClick={() => captureScreen()} title="Save your progress">📸 Capture</button>
          </div>
          <div className="arena-split">
            <div className="challenge-card">
              <div id="big-icon">{levels[currentLevel].icon}</div>
              <h2>{levels[currentLevel].title}</h2>
              {!hintVisible && <button className="btn-small" onClick={() => setHintVisible(true)}>💡 Show Hint</button>}
              {hintVisible && <p id="hint-text">{levels[currentLevel].hint}</p>}
            </div>
            <div className="vision-card">
              {levels[currentLevel].visual && renderVisuals(levels[currentLevel])}

              {(levels[currentLevel].inputMode === 'camera' || levels[currentLevel].type === 'gesture') && (
                <div className="cam-wrapper">
                  <video ref={videoRef} className="input_video" style={{ display: 'none' }}></video>
                  <canvas ref={canvasRef} width="480" height="360"></canvas>
                </div>
              )}

              {levels[currentLevel].inputMode === 'keyboard' && (
                <div className="input-area">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="?"
                    style={{ fontSize: '2rem', padding: '10px', width: '100px', textAlign: 'center' }}
                  />
                  <button className="btn-main" onClick={() => checkInput(inputValue)}>Check</button>
                </div>
              )}

              {levels[currentLevel].inputMode === 'voice' && (
                <div className="input-area">
                  <button
                    className={`btn-voice ${isListening ? 'listening' : ''}`}
                    onClick={startListening}
                    style={{ fontSize: '3rem', padding: '20px', borderRadius: '50%', background: isListening ? '#ff7675' : '#74b9ff' }}
                  >
                    🎙️
                  </button>
                  <p style={{ fontSize: '1.2rem' }}>{inputValue || "Tap to Speak"}</p>
                </div>
              )}

              {levels[currentLevel].inputMode === 'mcq' && (
                <div className="mcq-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', width: '100%', maxWidth: '500px' }}>
                  {levels[currentLevel].options.map((option, idx) => (
                    <button
                      key={idx}
                      className="mcq-option"
                      onClick={() => checkInput(option)}
                      style={{
                        fontSize: '2.5rem',
                        padding: '30px',
                        borderRadius: '25px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        background: ['#ff7675', '#74b9ff', '#55efc4', '#fdcb6e'][idx],
                        color: 'white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        fontFamily: 'Fredoka One, cursive'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-5px)';
                        e.target.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}


              <div id="feedback-bar" style={{ background: feedbackType === 'success' ? '#55efc4' : 'white' }}>
                {feedback}
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'builder' && (
        <LevelBuilder onBack={() => setScreen('login')} onAddLevel={addLevel} />
      )}

      {screen === 'final' && (
        <div className="glass-panel">
          <h1>CONGRATULATIONS! 🏆</h1>
          <p>Final Score: {score}</p>
          <button className="btn-main" onClick={() => setScreen('map')}>Back to Map</button>
        </div>
      )}

      {showVictory && (
        <div className="modal">
          <div className="modal-card">
            <h1>Victory! 🎉</h1>
            <div style={{ fontSize: '3rem', margin: '10px 0' }}>
              {"⭐".repeat(levelStats.stars)}
            </div>
            <p>Time: {levelStats.time}s</p>
            <button className="btn-main" onClick={handleNextLevelClick} title="Press Enter">Next Level ➡</button>
            <button className="btn-small" onClick={() => captureScreen()} style={{ marginTop: '10px' }}>📸 Save Moment</button>
          </div>
        </div>
      )}

      {showCalmOverlay && (
        <div className="modal" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-card" style={{ background: '#74b9ff', color: 'white' }}>
            <h1 style={{ fontSize: '4rem', color: 'white' }}>✌️</h1>
            <h2>It's Okay!</h2>
            <p style={{ color: 'white', fontSize: '1.5rem' }}>Take a deep breath...</p>
            <button className="btn-main" onClick={() => setShowCalmOverlay(false)} style={{ background: 'white', color: '#74b9ff', marginTop: '20px' }}>I'm Ready</button>
          </div>
        </div>
      )}

    </div>
  );
}

const captureScreen = () => {
  const element = document.body; // Capture entire body or app container
  html2canvas(element).then(canvas => {
    const link = document.createElement('a');
    link.download = 'gesture-quest-moment.png';
    link.href = canvas.toDataURL();
    link.click();
  });
};

export default App;