import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isSignupComplete, setIsSignupComplete] = useState(false);

    return (
        <AuthContext.Provider value={{ isSignupComplete, setIsSignupComplete }}>
            {children}
        </AuthContext.Provider>
    );
};