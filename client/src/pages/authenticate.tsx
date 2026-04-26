import { useEffect, useState } from "react";
import "../App.css";
import "./authenticate.css";
import { api } from "../core/api";

type FormState = {
    login: {
        username: string;
        password: string;
    };
    register: {
        username: string;
        password: string;
    };
};

function LoginComponent({ formState, setFormState, login } : { formState: FormState, setFormState: (arg0: FormState) => void, login: () => void }) {
    return (<div className="authFields">
        <label className="authLabel">
            Username
        </label>
        <input className="authInput" value={formState.login.username} onChange={(e) => setFormState({ 
            login: { 
                username: e.target.value,
                password: formState.login.password,
            },
            register: formState.register
        })}/>

        <label className="authLabel">
            Password
        </label>
        <input type="password" className="authInput" value={formState.login.password} onChange={(e) => setFormState({ 
            login: { 
                username: formState.login.username,
                password: e.target.value,
            },
            register: formState.register
        })}/>

        <a className="authButton" onClick={login}>
            <div>Login</div>
        </a>
    </div>);
}

function RegisterComponent({ formState, setFormState, register } : { formState: FormState, setFormState: (arg0: FormState) => void, register: () => void }) {
    return (<div className="authFields">
        <label className="authLabel">
            Username
        </label>
        <input className="authInput" value={formState.register.username} onChange={(e) => setFormState({ 
            register: { 
                username: e.target.value,
                password: formState.register.password,
            },
            login: formState.login
        })}/>

        <label className="authLabel">
            Password
        </label>
        <input type="password" className="authInput" value={formState.register.password} onChange={(e) => setFormState({ 
            register: { 
                username: formState.register.username,
                password: e.target.value,
            },
            login: formState.login
        })}/>

        <a className="authButton" onClick={register}>
            <div>Register</div>
        </a>
    </div>);
}

enum AuthState {
    LOGIN,
    REGISTER,
}

export default function AuthenticationScreen({ tryAuthenticate }: { tryAuthenticate: () => void }) {
    const [state, setState] = useState<AuthState>(AuthState.LOGIN);

    const [formState, setFormState] = useState<FormState>({
        login: {
            username: "",
            password: "",
        },
        register: {
            username: "",
            password: ""
        },
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => setError(""), [ state ]);

    const login = () => {
        api.login(formState.login.username, formState.login.password)
            .then(res => {
                if (res.access_token !== null)
                    tryAuthenticate();
                else
                    setError(res.error);
            });
    };

    const register = () => {
        api.register(formState.register.username, formState.register.password)
            .then(res => {
                if (res.access_token !== null)
                    tryAuthenticate();
                else
                    setError(res.error);
            });
    };

    return (<div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        flex: 1,
    }}>
        <div style={{ 
            width: 'fit-content', 
            overflow: 'hidden', 
            borderRadius: '15px', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '1vh' 
        }}>
            <a onClick={() => setState(AuthState.LOGIN)} className={`authSwitch ${state == AuthState.LOGIN && 'activeSwitch'}`}>
                <div>
                    <p>Login</p>
                </div>
            </a>
            <a onClick={() => setState(AuthState.REGISTER)} className={`authSwitch ${state == AuthState.REGISTER && 'activeSwitch'}`}>
                <div>
                    <p>Register</p>
                </div>
            </a>
        </div>
        <div>
            {(state === AuthState.LOGIN) && <LoginComponent formState={formState} setFormState={setFormState} login={login}/>}
            {(state === AuthState.REGISTER) && <RegisterComponent formState={formState} setFormState={setFormState} register={register}/>}
            {error && <p style={{ color: "var(--txt-err)" }}>{error}</p>}
        </div>
    </div>)
}
