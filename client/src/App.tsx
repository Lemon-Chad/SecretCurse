import React, { useEffect, useState } from 'react';
import './App.css';
import { api } from './core/api';

function App() {
  const [resp, setResp] = useState<string>("waiting...");

  useEffect(() => {
    api.ping().then(res => {
      setResp(res.pong);
    });
  });

  return (<div className="app">
    <div className="app-title"><h1>Secret Curses</h1></div>
    <div className="app-body">
      <p>{resp}</p>
    </div>
  </div>);
}

export default App;
