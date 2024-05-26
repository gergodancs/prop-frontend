import {createContext, ReactNode, useContext, useState} from 'react';

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
    const [auth, setAuth] = useState<AuthState>(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return token && user ? { user, token } : null;
    });

    const login = (user: string, token: string) => {
        setAuth({ user, token });
        localStorage.setItem('user', user);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
