import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type AuthState = {
    user: string;
    token: string;
} | null;

type AuthContextType = {
    auth: AuthState;
    login: (user: string, token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            setAuth(token && user ? { user, token } : null);
        }
    }, []);

    const login = (user: string, token: string) => {
        setAuth({ user, token });
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', user);
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setAuth(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
