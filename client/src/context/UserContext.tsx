import { createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

interface UserValue {
    userId: string;
    userName: string;
    setUserName: (userName: string) => void;
}

export const UserContext = createContext<UserValue>({
    userId: "",
    userName: "",
    setUserName: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId] = useState(() => {
        return localStorage.getItem("userId") || uuidV4();
    });

    const [userName, setUserName] = useState(() => {
        return localStorage.getItem("userName") || "";
    });

    // Обновляем localStorage при изменении userName
    useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    // Следим за изменениями в localStorage и обновляем состояние
    useEffect(() => {
        const handleStorageChange = () => {
            const storedUserName = localStorage.getItem("userName") || "";
            setUserName(storedUserName);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{ userId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};
