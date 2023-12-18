import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavigationContextType = {
  isCategoryOpen: boolean;
  setIsCategoryOpen: (isOpen: boolean) => void;
  updatedScreens: {
    all: boolean;
    your: boolean;
    suggested: boolean;
  };
  setUpdatedScreens: (updated: { all?: boolean; your?: boolean; suggested?: boolean }) => void;
};

// Update the default value in createContext
const NavigationContext = createContext<NavigationContextType>({
  isCategoryOpen: false,
  setIsCategoryOpen: () => {},
  updatedScreens: { all: false, your: false, suggested: false },
  setUpdatedScreens: () => {} // Placeholder function
});

export const useNavigationState = () => useContext(NavigationContext);

// Explicitly type the children prop
type NavigationProviderProps = {
  children: ReactNode;
};

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [updatedScreens, setUpdatedScreens] = useState({ all: false, your: false, suggested: false });

  const updateScreens = (updates: { all?: boolean; your?: boolean; suggested?: boolean }) => {
    setUpdatedScreens(prevState => ({ ...prevState, ...updates }));
  };

  return (
    <NavigationContext.Provider value={{ isCategoryOpen, setIsCategoryOpen, updatedScreens, setUpdatedScreens: updateScreens }}>
      {children}
    </NavigationContext.Provider>
  );
};

