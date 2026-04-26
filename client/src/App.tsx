import React, { useEffect, useState } from 'react';
import './App.css';
import { api, setToken, User } from './core/api';
import Home from './pages/home';
import AuthenticationScreen from './pages/authenticate';

enum PageState {
  WAITING,
  AUTHENTICATE,
  HOME,
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

  return (<div className="app">
    <div className="app-title"><h1>Secret Curses</h1></div>
    <div className="app-body">
      {(state === PageState.WAITING) && <p>Connecting</p>}
      {(state === PageState.AUTHENTICATE) && <AuthenticationScreen tryAuthenticate={() => setAuthenticateKey(k => k + 1)}/>}
      {(state === PageState.HOME) && <Home/>}
    </div>
  </div>);
}

export default App;
