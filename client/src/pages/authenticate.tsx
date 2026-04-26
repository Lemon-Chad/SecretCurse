import { useState } from "react";
import "../App.css";
import "./authenticate.css";

function LoginComponent() {
    return (<div>
        OOOO you logging in aint you?
    </div>);
}

function RegisterComponent() {
    return (<div>
        OOOO you registering aint you?
    </div>);
}

enum AuthState {
    LOGIN,
    REGISTER,
}

export default function AuthenticationScreen() {
    const [state, setState] = useState<AuthState>(AuthState.LOGIN);

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
            {(state === AuthState.LOGIN) && <LoginComponent/>}
            {(state === AuthState.REGISTER) && <RegisterComponent/>}
        </div>
    </div>)
}
