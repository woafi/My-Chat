import { useState } from 'react';
import { Helmet } from "@dr.pogodin/react-helmet";

//Components
import Login from '../Login';
import Register from '../Register';
import Icon from '../Icon';

//Style
import '../../Styles/SignIn_SignUp.css';

export default function Home() {
    const [isRegisterActive, setIsRegisterActive] = useState(false);

    // Named functions to toggle the panel
    const showRegister = () => setIsRegisterActive(true);
    const showLogin = () => setIsRegisterActive(false);

    return (
        <>
            <Helmet>
                <title>Login - Sign in to MyChat</title>
            </Helmet>
            <div>
                <div className={`containerCss ${isRegisterActive ? 'active' : ''}`}>
                    <Login />
                    <Register />
                    {/* Toggle Panels */}
                    <div className="toggle-box">
                        <div className="toggle-panel toggle-left">
                            <Icon />
                            <h1 className='font-bold'>Hello, Welcome!</h1>
                            <p>Don't have an account?</p>
                            <button className="btn register-btn" style={{ color: '#ffffff' }} onClick={showRegister}>Register</button>
                        </div>

                        <div className="toggle-panel toggle-right">
                            <Icon />
                            <h1 className='font-bold'>Welcome Back!</h1>
                            <p>Already have an account?</p>
                            <button className="btn login-btn" style={{ color: '#ffffff' }} onClick={showLogin}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
