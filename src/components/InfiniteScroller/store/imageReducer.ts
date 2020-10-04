import { useReducer } from "react";

interface IImageReducer {
  images: any[];
  fetching: boolean;
}

const initialState: IImageReducer = {
  images: [],
  fetching: false
};

const imageReducer = (state: any, action: any): IImageReducer => {
  switch (action.type) {
    case "STACK_IMAGES":
      return {
        ...state,
        images: state.images.concat(action.images)
      };
    case "FETCH_IMAGES":
      return {
        ...state,
        fetching: action.fetching
      };
    default:
      return state;
  }
};

const useImageReducer = () => {
  return useReducer(imageReducer, initialState);
};

export { useImageReducer };
