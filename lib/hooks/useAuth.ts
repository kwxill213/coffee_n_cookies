import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'jsonwebtoken';

interface AuthData {
    phone: string | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    setUser: (user: string | null) => void;
}

export const useAuth = (): AuthData => {
    const [phone, setPhone] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload & { phone: string; isAdmin: boolean }>(token);
                setPhone(decodedToken.phone);
                setIsAdmin(decodedToken.isAdmin);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setPhone(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
        window.location.reload();
    };

    const setUser = (user: string | null) => {
        setPhone(user);
    };

    return {
        phone,
        isAdmin,
        isAuthenticated,
        logout,
        setUser,
    };
};
