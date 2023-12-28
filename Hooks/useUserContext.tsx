import { useContext } from 'react';
import { UserContext } from "../Structure/UserContext";

export const useUserContext: any = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        console.error('useUserContext must be used within a UserProvider');
    }

    return context;
};