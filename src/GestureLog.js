import React, { Component } from 'react';
import './App.css';
import LogItem from './LogItem';


class GestureLog extends Component {
   
    state = {
        gesture: 'High Five',
        notes: '',
        rating: 5,
        logs: []
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };


    handleSubmit = (event) => {
        event.preventDefault();
        const newLog = {
            id: Date.now(),
            gesture: this.state.gesture,
            notes: this.state.notes,
            rating: parseInt(this.state.rating),
            timestamp: new Date().toLocaleTimeString()
        };

        // CONCEPT: State Management (Updating State)
        this.setState((prevState) => ({
            logs: [newLog, ...prevState.logs],
            notes: '', // Reset form field
            rating: 5
        }));
    };

    render() {
        return (
            <div className="glass-panel" style={{ maxWidth: '600px', width: '90%' }}>
                <h2>Gesture Observation Log</h2>
                <p>Record progress and observations.</p>

                {/* CONCEPT: Forms */}
                <form onSubmit={this.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '5px' }}>Target Gesture:</label>
                        <select
                            name="gesture"
                            value={this.state.gesture}
                            onChange={this.handleChange}
                            className="form-control"
                            style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
                        >
                            <option value="High Five">High Five ✋</option>
                            <option value="Peace">Peace ✌️</option>
                            <option value="Rock">Rock ✊</option>
                            <option value="Thumbs Up">Thumbs Up 👍</option>
                            <option value="Okay">Okay 👌</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '5px' }}>Observation Notes:</label>
                        <textarea
                            name="notes"
                            value={this.state.notes}
                            onChange={this.handleChange}
                            placeholder="How did they respond?"
                            className="form-control"
                            rows="3"
                            style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-5):</label>
                        <input
                            type="number"
                            name="rating"
                            value={this.state.rating}
                            onChange={this.handleChange}
                            min="1"
                            max="5"
                            style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
                        />
                    </div>

                    <button type="submit" className="btn-main">Add Observation</button>
                </form>

                <div className="logs-container">
                    <h3>Recent Logs ({this.state.logs.length})</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {this.state.logs.map(log => (
                            // CONCEPT: Stateless Component Usage
                            <LogItem key={log.id} log={log} />
                        ))}
                        {this.state.logs.length === 0 && <p style={{ opacity: 0.6 }}>No logs yet.</p>}
                    </div>
                </div>

                <button
                    className="btn-small"
                    onClick={this.props.onBack}
                    style={{ marginTop: '20px', background: '#ff7675' }}
                >
                    Back to Map
                </button>
            </div>
        );
    }
}

export default GestureLog;
