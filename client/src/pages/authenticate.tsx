import { useEffect, useState } from "react";
import "../App.css";
import "./authenticate.css";
import { api } from "../core/api";
import NavPage from "./navpage";

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

function LoginComponent({ formState, setFormState, login, error } : { formState: FormState, setFormState: (arg0: FormState) => void, login: () => void, error: string | null }) {
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

        {error && <p style={{ color: "var(--txt-err)" }}>{error}</p>}
    </div>);
}

function RegisterComponent({ formState, setFormState, register, error } : { formState: FormState, setFormState: (arg0: FormState) => void, register: () => void, error: string | null }) {
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

        {error && <p style={{ color: "var(--txt-err)" }}>{error}</p>}
    </div>);
}

export default function AuthenticationScreen({ tryAuthenticate }: { tryAuthenticate: () => void }) {
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

    return (<NavPage pages={[
        {
            label: 'Login',
            page: <LoginComponent 
                formState={formState}
                setFormState={setFormState}
                login={login}
                error={error}
            />
        },
        {
            label: 'Register',
            page: <RegisterComponent 
                formState={formState}
                setFormState={setFormState}
                register={register}
                error={error}
            />
        }
    ]} onChange={(_) => setError("")}/>);
}
