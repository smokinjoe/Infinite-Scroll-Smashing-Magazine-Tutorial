import { useReducer } from "react";

interface IPageReducer {
  page: number;
}

const initialState: IPageReducer = {
  page: 0
};

const pageReducer = (state: any, action: any): IPageReducer => {
  switch (action.type) {
    case "ADVANCE_PAGE":
      return {
        ...state,
        page: state.page + 1
      };
    default:
      return state;
  }
};

const usePageReducer = () => {
  return useReducer(pageReducer, initialState);
};

export { usePageReducer };
