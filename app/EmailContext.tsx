import React, { createContext, useContext, useState } from 'react';

export const EmailContext = createContext<{ email: string; setEmail: React.Dispatch<React.SetStateAction<string>> } | null>(null);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [email, setEmail] = useState("");

    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = () => {
    return useContext(EmailContext);
};

export default EmailProvider;