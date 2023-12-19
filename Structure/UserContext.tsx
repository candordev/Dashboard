import { createContext, useReducer } from 'react';

export const UserContext = createContext({});

let userReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...action.payload,
      };
    case 'REMOVE_USER':
      return {};
    case 'UPDATE_USER':
      return {
        ...state,
        ...action.payload,
      }
    default:
      //console.log("Default case in userReducer");
      return state;
  } 
};

let initialState = {
  user: null,
};

export const UserProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  //console.log('User State: ', state);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      {children}
    </UserContext.Provider>
  );
};