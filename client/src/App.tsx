import React, { useEffect, useState } from 'react';
import './App.css';
import { api, setToken, User } from './core/api';
import Home from './pages/home';
import AuthenticationScreen from './pages/authenticate';
import Match from './pages/match';
import { socketApi } from './core/socket';

enum PageState {
  WAITING,
  AUTHENTICATE,
  HOME,
  IN_MATCH,
}

function App() {
  const [state, setState] = useState<PageState>(PageState.WAITING);

  const [usr, setUsr] = useState<User | null>(null);

  const [authenticateKey, setAuthenticateKey] = useState(0);

  useEffect(() => {
    api.me().then(u => {
      setState(PageState.HOME);
      setUsr(u);
    }).catch(_ => {
      setState(PageState.AUTHENTICATE);
      setUsr(null);
    });
  }, [ authenticateKey ]);

  socketApi.matchFoundListener(() => setState(PageState.IN_MATCH));

  return (<div className="app">
    <div className="app-title"><h1>Secret Curses</h1></div>
    <div className="app-body">
      {(state === PageState.WAITING) && <p>Connecting</p>}
      {(state === PageState.AUTHENTICATE) && <AuthenticationScreen tryAuthenticate={() => setAuthenticateKey(k => k + 1)}/>}
      {(state === PageState.HOME) && <Home usr={usr!}/>}
      {(state === PageState.IN_MATCH) && <Match/>}
    </div>
  </div>);
}

export default App;
