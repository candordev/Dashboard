import { useContext } from 'react';
import { PostContext } from "../Structure/PostContext";

export const usePostContext: any = () => {
    const context = useContext(PostContext);
    if (context === undefined) {
        console.error('usePostContext must be used within a PostProvider');
    }
    return context;
}; 