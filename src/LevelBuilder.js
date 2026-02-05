import React, { Component } from 'react';
import './App.css';
import LevelCard from './LevelCard';

class LevelBuilder extends Component {

  state = {
    title: '',
    icon: '⭐',
    target: 'High Five',
    hint: '',
    createdLevels: []
  };


  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };


  handleSubmit = (event) => {
    event.preventDefault();


    const newLevel = {
      id: Date.now(),
      title: this.state.title,
      icon: this.state.icon,
      target: this.state.target,
      hint: this.state.hint
    };


    this.props.onAddLevel({ ...newLevel, type: 'gesture' });


    this.setState((prevState) => ({
      createdLevels: [newLevel, ...prevState.createdLevels],

      title: '',
      hint: ''
    }));
  };

  render() {
    return (
      <div className="glass-panel" style={{ maxWidth: '900px', width: '90%', flexDirection: 'row', gap: '30px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem' }}>🛠️</span>
            <h2>Level Builder</h2>
            <p style={{ margin: '5px 0' }}>Design your challenge!</p>
          </div>

          <form onSubmit={this.handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <label style={{ alignSelf: 'flex-start', marginLeft: '15%', fontWeight: 'bold', color: '#636e72', marginBottom: '5px' }}>Title</label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="e.g. Super Wave"
              required
              style={{ width: '70%', marginBottom: '10px' }}
            />

            <label style={{ alignSelf: 'flex-start', marginLeft: '15%', fontWeight: 'bold', color: '#636e72', marginBottom: '5px' }}>Icon</label>
            <select name="icon" value={this.state.icon} onChange={this.handleChange} style={{ width: '80%', marginBottom: '10px' }}>
              <option value="⭐">⭐ Star</option>
              <option value="👋">👋 Wave</option>
              <option value="🦁">🦁 Lion</option>
              <option value="🚀">🚀 Rocket</option>
              <option value="💖">💖 Heart</option>
              <option value="🏠">🏠 House</option>
            </select>

            <label style={{ alignSelf: 'flex-start', marginLeft: '15%', fontWeight: 'bold', color: '#636e72', marginBottom: '5px' }}>Gesture</label>
            <select name="target" value={this.state.target} onChange={this.handleChange} style={{ width: '80%', marginBottom: '10px' }}>
              <option value="High Five">High Five ✋</option>
              <option value="Peace">Peace ✌️</option>
              <option value="Rock">Rock ✊</option>
              <option value="Thumbs Up">Thumbs Up 👍</option>
              <option value="Okay">Okay 👌</option>
              <option value="Fist Bump">Fist Bump 👊</option>
            </select>

            <label style={{ alignSelf: 'flex-start', marginLeft: '15%', fontWeight: 'bold', color: '#636e72', marginBottom: '5px' }}>Hint</label>
            <input
              type="text"
              name="hint"
              value={this.state.hint}
              onChange={this.handleChange}
              placeholder="e.g. Open hand"
              required
              style={{ width: '70%', marginBottom: '10px' }}
            />

            <button type="submit" className="btn-main" style={{ marginTop: '10px', width: '80%', fontSize: '1.2rem', padding: '12px' }}>
              Create Level
            </button>
          </form>
          <button
            className="btn-small"
            onClick={this.props.onBack}
            style={{ marginTop: '20px', background: 'transparent', color: '#636e72', boxShadow: 'none', border: '2px solid #dfe6e9' }}
          >
            ← Back to Login
          </button>
        </div>

        <div style={{ flex: 1, background: 'rgba(255,255,255,0.4)', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0, color: '#6c5ce7' }}>Preview Stats</h3>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fd79a8' }}>{this.state.createdLevels.length}</div>
                <div style={{ fontSize: '0.8rem', color: '#b2bec3' }}>Levels Created</div>
              </div>
              <div style={{ background: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00cec9' }}>XP</div>
                <div style={{ fontSize: '0.8rem', color: '#b2bec3' }}>Builder Rank</div>
              </div>
            </div>

            <h4 style={{ margin: '10px 0', color: '#636e72' }}>Recent Creations:</h4>
            {this.state.createdLevels.length === 0 && (
              <div style={{ opacity: 0.5, fontStyle: 'italic', marginTop: '30px', textAlign: 'center' }}>
                Start building to see cards here!
              </div>
            )}
            {this.state.createdLevels.map(lvl => (
              <LevelCard key={lvl.id} level={lvl} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default LevelBuilder;
