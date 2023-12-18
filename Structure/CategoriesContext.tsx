import { PropsWithChildren, createContext, useReducer } from 'react';
import { Endpoints } from '../utils/Endpoints';
import { Category } from '../utils/interfaces';
import { customFetch } from '../utils/utils';

const enum CATEGORIES_ACTIONS_ENUM {
  GET_CATEGORIES,

}

type CategoriesReducerActionType = {
  type: CATEGORIES_ACTIONS_ENUM;
  payload: Category[] | string;
};

export type CategoriesStateType = {
    categories: Category[];
  // homeScreenGroup: Group;
  // profileScreenGroup: Group;
};

const initialState: CategoriesStateType = {
    categories: [],
  // homeScreenGroup: FEATURED_GROUP,
  // profileScreenGroup: FEATURED_GROUP,
};

// type CategoriesContextType = {
//   state: CategoriesStateType;
//   dispatch: any;
// };

export const CategoriesContext = createContext({});

const categoriesReducer = (
  state: CategoriesStateType,
  action: CategoriesReducerActionType,
) => {
  let category: Category | undefined;
  switch (action.type) {
    case CATEGORIES_ACTIONS_ENUM.GET_CATEGORIES:
      //console.log('GET_GROUPS case in groupsReducer');
      return {
        ...state,
        categories: [...action.payload],
      };
    default:
      console.error('Default case in categoriesReducer');
  }
};

export const CategoriesProvider = ({children}: PropsWithChildren) => {
  const [categoriesState, categoriesDispatch] = useReducer<any>(
    categoriesReducer,
    initialState,
  );
  return (
    <CategoriesContext.Provider value={{categoriesState, categoriesDispatch}}>
      {children}
    </CategoriesContext.Provider>
  );
};

// takes in user id and returns array of groups
export const setCategories = async (dispatch: any) => {
  let result: Category[] = [];
  try {
    let res: Response = await customFetch(Endpoints.categories, {
      method: 'GET',
    });
    let resJson = await res.json();
    if (!res.ok) {
      throw new Error('Could not get categories from server' + resJson.error);
    }
    if (res.ok) {
      result = resJson;
      console.log("THIS IS THE RESULT", result)
    }
   
  } catch (e) {
    console.error(e);
    throw new Error('Could not get categories from server');
  }

  dispatch({type: CATEGORIES_ACTIONS_ENUM.GET_CATEGORIES, payload: result});
};




