import React, { useState, useEffect, useRef } from 'react';
import './App.css'; 

const LEVELS = [
    { id: 1, type: 'gesture', icon: '✋', title: 'High Five', target: 'high_five', hint: 'All fingers OPEN.' },
    { id: 2, type: 'gesture', icon: '✌️', title: 'Peace', target: 'peace', hint: 'Index & Middle UP.' },
    { id: 3, type: 'gesture', icon: '☝️', title: 'One', target: 'one', hint: 'Index UP.' },
    { id: 4, type: 'gesture', icon: '✊', title: 'Rock', target: 'rock', hint: 'Close all fingers.' },
    { id: 5, type: 'gesture', icon: '👍', title: 'Thumbs Up', target: 'thumbs_up', hint: 'Thumb UP.' },
    { id: 6, type: 'gesture', icon: '👌', title: 'Okay', target: 'ok', hint: 'Index touches Thumb.' },
    { id: 7, type: 'gesture', icon: '🕷️', title: 'Spidey', target: 'spider', hint: 'Index & Pinky UP.' },
    { id: 8, type: 'gesture', icon: '🤙', title: 'Call Me', target: 'call_me', hint: 'Thumb & Pinky UP.' },
    { id: 9, type: 'gesture', icon: '📐', title: 'L-Shape', target: 'l_shape', hint: 'Thumb & Index OPEN.' },
    { id: 10, type: 'gesture', icon: '👊', title: 'Fist Bump', target: 'fist', hint: 'Close fist.' },
    { id: 11, type: 'math', icon: '3️⃣', title: 'Count to 3', target: 3, hint: 'Show exactly 3 fingers.' },
    { id: 12, type: 'math', icon: '4️⃣', title: 'Count to 4', target: 4, hint: 'Show 4 fingers.' },
    { id: 13, type: 'math', icon: '🔟', title: 'Double Hand', target: 10, hint: 'Show all 10 fingers (Two hands).' },
    { id: 14, type: 'math', icon: '➕', title: '2 + 3 = ?', target: 5, hint: 'Answer is 5.' },
    { id: 15, type: 'math', icon: '➕', title: '1 + 1 = ?', target: 2, hint: 'Answer is 2.' },
    { id: 16, type: 'math', icon: '➖', title: '5 - 4 = ?', target: 1, hint: 'Answer is 1.' },
    { id: 17, type: 'math', icon: '0️⃣', title: 'Zero', target: 0, hint: 'Show zero fingers (Fist).' },
    { id: 18, type: 'math', icon: '✖️', title: '2 x 3 = ?', target: 6, hint: 'Answer is 6.' },
    { id: 19, type: 'math', icon: '➕', title: '4 + 4 = ?', target: 8, hint: 'Answer is 8.' },
    { id: 20, type: 'math', icon: '7️⃣', title: 'Lucky 7', target: 7, hint: 'Show 7 fingers.' },
    { id: 21, type: 'gesture', icon: '🎸', title: 'Rock On', target: 'spider', hint: 'Spidey/Rock sign!' },
    { id: 22, type: 'math', icon: '🐙', title: 'Octopus Legs', target: 8, hint: '8 legs.' },
    { id: 23, type: 'gesture', icon: '📞', title: 'Phone', target: 'call_me', hint: 'Call Me gesture.' },
    { id: 24, type: 'math', icon: '🌈', title: 'Rainbow', target: 7, hint: '7 Colors.' },
    { id: 25, type: 'gesture', icon: '✅', title: 'Good Job', target: 'thumbs_up', hint: 'Thumbs Up.' },
    { id: 26, type: 'math', icon: '🗓️', title: 'Weeks', target: 4, hint: '4 weeks.' },
    { id: 27, type: 'gesture', icon: '🕊️', title: 'Peace Out', target: 'peace', hint: 'Peace sign.' },
    { id: 28, type: 'math', icon: '🖐️', title: 'One Hand', target: 5, hint: '5 fingers.' },
    { id: 29, type: 'gesture', icon: '🛑', title: 'Stop', target: 'high_five', hint: 'Stop sign (Palm).' },
    { id: 30, type: 'math', icon: '🏆', title: 'The Final Test : How many Fingers do you have ? ', target: 10, hint: '10 fingers to win!' }
];

function App() {
  const [screen, setScreen] = useState('login'); 
  const [user, setUser] = useState('');
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [feedback, setFeedback] = useState("Show me your hands!");
  const [feedbackType, setFeedbackType] = useState("neutral");
  
  const [showVictory, setShowVictory] = useState(false);
  const [levelStats, setLevelStats] = useState({ stars: 0, time: 0 });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const levelRef = useRef(0);

  const gameState = useRef({
    isDetecting: false,
    levelStartTime: 0,
    holdStartTime: 0,
    holdDuration: 1500
  });
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
        setHintVisible(false);
        setFeedback("Show me your hands!");
        setFeedbackType("neutral");
    }
  }, [currentLevel, screen]);
  useEffect(() => {
    if (screen !== 'game') return;
    if (!videoRef.current || !canvasRef.current) return;
    if (!window.Hands || !window.Camera) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    
    hands.onResults((results) => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {color: '#00cec9', lineWidth: 4});
          window.drawLandmarks(ctx, landmarks, {color: '#fab1a0', lineWidth: 2});
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
      onFrame: async () => { await hands.send({image: video}); },
      width: 640, height: 480
    });
    
    camera.start();
    cameraRef.current = camera;

    return () => { if (cameraRef.current) cameraRef.current.stop(); };
  }, [screen]); 
  const updateFeedback = (msg, type) => {
    setFeedback(msg);
    setFeedbackType(type);
  };

  const checkLogic = (allHands) => {
    const lvl = LEVELS[levelRef.current];
    let isCorrect = false;
    const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    const isFingerOpen = (lm, tip) => dist(lm[tip], lm[0]) > dist(lm[tip-2], lm[0]);
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

    } else {
        const lm = allHands[0];
        const thumb = isThumbOpen(lm);
        const index = isFingerOpen(lm, 8);
        const middle = isFingerOpen(lm, 12);
        const ring = isFingerOpen(lm, 16);
        const pinky = isFingerOpen(lm, 20);

        switch(lvl.target) {
            case 'high_five': isCorrect = thumb && index && middle && ring && pinky; break;
            case 'peace': isCorrect = index && middle && !ring && !pinky; break;
            case 'rock': isCorrect = !index && !middle && !ring && !pinky; break;
            case 'one': isCorrect = index && !middle && !ring && !pinky; break;
            case 'thumbs_up': isCorrect = thumb && !index && !middle && !ring && !pinky; break;
            case 'ok': isCorrect = index === false && middle && ring && pinky; break; 
            case 'spider': isCorrect = index && pinky && !middle && !ring; break;
            case 'call_me': isCorrect = thumb && pinky && !index && !middle && !ring; break;
            case 'l_shape': isCorrect = thumb && index && !middle && !ring && !pinky; break;
            case 'fist': isCorrect = !index && !middle && !ring && !pinky; break;
            default: break; 
        }
    }

    if (isCorrect) {
       if (gameState.current.holdStartTime === 0) gameState.current.holdStartTime = Date.now();
       const elapsed = Date.now() - gameState.current.holdStartTime;
       updateFeedback(`Hold it... ${Math.ceil((gameState.current.holdDuration - elapsed)/1000)}s`, "success");
       
       if (elapsed > gameState.current.holdDuration) handleWin();
    } else {
       gameState.current.holdStartTime = 0;
       if (lvl.type !== 'math') updateFeedback("Try again...", "neutral");
    }
  };

  const handleWin = () => {
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
  };

  const handleNextLevelClick = () => {
      setShowVictory(false);
      if (currentLevel < LEVELS.length - 1) {
          setCurrentLevel(currentLevel + 1);
      } else {
          setScreen('final');
      }
  };

  const startGame = () => {
      if (!user) setUser('Hero');
      setScreen('map');
  };

  const loadLevel = (idx) => {
      setCurrentLevel(idx);
      setScreen('game');
  };

  const handleLogout = () => {
      localStorage.removeItem('gesture_save');
      window.location.reload();
  };
  return (
    <div className="app-container">
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>

      {screen === 'login' && (
        <div className="glass-panel">
            <div className="avatar">🧙‍♂️</div>
            <h1>Gesture Quest</h1>
            <p>Master Hand Magic</p>
            <input type="text" placeholder="Enter Hero Name" onChange={(e) => setUser(e.target.value)} />
            <button className="btn-main" onClick={startGame}>Start Adventure</button>
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
                </div>
            </div>
            <div className="grid-container">
                {LEVELS.map((lvl, idx) => (
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
                <button className="btn-small" onClick={() => setScreen('map')}>❌ Exit</button>
                <span className="level-badge">{LEVELS[currentLevel].type}</span>
            </div>
            <div className="arena-split">
                <div className="challenge-card">
                    <div id="big-icon">{LEVELS[currentLevel].icon}</div>
                    <h2>{LEVELS[currentLevel].title}</h2>
                    {!hintVisible && <button className="btn-small" onClick={() => setHintVisible(true)}>💡 Show Hint</button>}
                    {hintVisible && <p id="hint-text">{LEVELS[currentLevel].hint}</p>}
                </div>
                <div className="vision-card">
                    <div className="cam-wrapper">
                        <video ref={videoRef} className="input_video" style={{display:'none'}}></video>
                        <canvas ref={canvasRef} width="640" height="480"></canvas>
                    </div>
                    <div id="feedback-bar" style={{ background: feedbackType === 'success' ? '#55efc4' : 'white' }}>
                        {feedback}
                    </div>
                </div>
            </div>
        </div>
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
                <button className="btn-main" onClick={handleNextLevelClick}>Next Level ➡</button>
            </div>
        </div>
      )}

    </div>
  );
}

export default App;