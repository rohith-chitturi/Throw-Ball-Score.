import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('user');
            const token = sessionStorage.getItem('token');
            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.role) {
                    setUser(parsedUser);
                } else {
                    // Invalid user data, clear it
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('token');
                }
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        // Intercept 401s to auto-logout
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
