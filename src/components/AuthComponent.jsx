
(function() {
    const { useState } = React;
    const { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } = window.FB;

    const AuthScreen = () => {
        const [isLogin, setIsLogin] = useState(true);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [name, setName] = useState('');
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    if (name) {
                        await updateProfile(userCredential.user, { displayName: name });
                    }
                }
                window.location.href = '/index.html';
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        const handleGoogleSignIn = async () => {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                window.location.href = '/index.html';
            } catch (error) {
                alert(error.message);
            }
        };

        return (
            <div className="auth-container">
                <div className="auth-grid">
                    <div className="auth-branding">
                        <div className="auth-logo">
                            <svg className="auth-logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                                <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
                                <path d="M3 12A9 3 0 0 0 21 12"/>
                            </svg>
                            <h1 className="auth-logo-text">DBQuest</h1>
                        </div>
                        <h2 className="auth-title">
                            Aprenda <span className="auth-title-highlight">Banco de Dados</span> como nunca antes
                        </h2>
                        <p className="auth-description">
                            Domine SQL, NoSQL e conceitos de banco de dados através de exercícios interativos e gamificação.
                        </p>
                    </div>

                    <div className="auth-form-container">
                        <div className="auth-form-card">
                            <h3 className="auth-form-title">{isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}</h3>
                            <p className="auth-form-subtitle">{isLogin ? 'Faça login para continuar' : 'Comece sua jornada'}</p>
                            
                            <form onSubmit={handleSubmit} className="auth-form">
                                {!isLogin && (
                                    <div className="auth-form-group">
                                        <label className="auth-form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="auth-form-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                )}
                                
                                <div className="auth-form-group">
                                    <label className="auth-form-label">Email</label>
                                    <input
                                        type="email"
                                        className="auth-form-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="auth-form-group">
                                    <label className="auth-form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="auth-form-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <button type="submit" className="auth-submit-btn" disabled={loading}>
                                    {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
                                </button>
                            </form>

                            <div className="auth-divider">
                                <div className="auth-divider-line"></div>
                                <div className="auth-divider-text"><span>ou</span></div>
                            </div>

                            <button onClick={handleGoogleSignIn} className="auth-google-btn">
                                <svg className="auth-google-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Entrar com Google
                            </button>

                            <div className="auth-toggle">
                                {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
                                <button onClick={() => setIsLogin(!isLogin)} className="auth-toggle-btn">
                                    {isLogin ? 'Registre-se' : 'Faça login'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Renderiza o componente
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<AuthScreen />);
})();

