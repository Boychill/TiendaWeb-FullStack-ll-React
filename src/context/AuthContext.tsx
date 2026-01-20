import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<boolean>;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        // Simulación de login
        // En un caso real, esto verificaría contra un backend o una lista de usuarios en localStorage
        if (email === 'admin@admin.com' && pass === 'admin123') {
            const adminUser: User = {
                id: 'admin-1',
                name: 'Admin User',
                email: email,
                role: 'admin',
                addresses: []
            };
            saveUser(adminUser);
            return true;
        }

        // Login usuarios normales simulado
        const usersStr = localStorage.getItem('users_db');
        const users: any[] = usersStr ? JSON.parse(usersStr) : [];
        const foundUser = users.find(u => u.email === email && u.password === pass);

        if (foundUser) {
            const { password, ...safeUser } = foundUser;
            saveUser(safeUser);
            return true;
        }

        return false;
    };

    const register = async (name: string, email: string, pass: string): Promise<boolean> => {
        // Simulación registro
        const usersStr = localStorage.getItem('users_db');
        const users: any[] = usersStr ? JSON.parse(usersStr) : [];

        if (users.find(u => u.email === email)) return false;

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: pass, // Solo para simulación
            role: 'customer',
            addresses: []
        };

        users.push(newUser);
        localStorage.setItem('users_db', JSON.stringify(users));

        // Auto login on register
        const { password, ...safeUser } = newUser;
        saveUser(safeUser as User);

        return true;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const saveUser = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin'
        }}>
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
