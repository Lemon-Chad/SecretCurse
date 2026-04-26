import React, { useEffect, useState } from 'react';
import './App.css';
import { api, setToken } from './core/api';
import Home from './pages/home';
import AuthenticationScreen from './pages/authenticate';

enum PageState {
  WAITING,
  AUTHENTICATE,
  HOME,
}

function App() {
  const [resp, setResp] = useState<string>("waiting...");

  setToken("test");

  const [state, setState] = useState<PageState>(PageState.WAITING);

  useEffect(() => {
    api.me().then(_ => {
      setState(PageState.HOME);
    }).catch(_ => {
      setState(PageState.AUTHENTICATE);
    });
  }, []);

  return (<div className="app">
    <div className="app-title"><h1>Secret Curses</h1></div>
    <div className="app-body">
      {(state === PageState.WAITING) && <p>Connecting</p>}
      {(state === PageState.AUTHENTICATE) && <AuthenticationScreen/>}
      {(state === PageState.HOME) && <Home/>}
    </div>
  </div>);
}

export default App;
