import { useContext } from 'react';
import { CategoriesContext } from "../Structure/CategoriesContext";

export const useCategoryContext: any = () => {
    const context = useContext(CategoriesContext);

    if (context === undefined) {
        throw new Error('useCategoryContext must be used within a CategroyProvider');
    }

    return context;
};