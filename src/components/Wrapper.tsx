import * as React from "react";
import {
  useFetch,
  useInfiniteScroll,
  useLazyLoading
} from "./InfiniteScroller/customHooks";

import "./wrapper.css";

interface IImgReducer {
  images: any[];
  fetching: boolean;
}

const Wrapper = () => {
  // Setup the image reducer and action dispatch
  const imgReducer = (state: any, action: any): IImgReducer => {
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
  // this sets up,
  //  - the imgData reducer store
  //  - the imgDispatch action thingy
  const [imgData, imgDispatch] = React.useReducer(imgReducer, {
    images: [],
    fetching: true
  });

  // Setup the page reducer and action dispatch
  const pageReducer = (state: any, action: any) => {
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
  // pager reducer store has a page property
  // pagerDispatch is called to incremenet page
  const [pager, pagerDispatch] = React.useReducer(pageReducer, { page: 0 });

  // infinite scrolling setup!
  let bottomBoundaryRef = React.useRef(null);

  useFetch(pager, imgDispatch);
  useLazyLoading(".card-img-top", imgData.images);
  useInfiniteScroll(bottomBoundaryRef, pagerDispatch);

  // render stuff
  return (
    <div className="">
      <nav className="navbar bg-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            <h2>Infinite scroll + image lazy loading</h2>
          </a>
        </div>
      </nav>
      <div id="images" className="container">
        <div className="row">
          {imgData.images.map((image, index) => {
            const { author, download_url } = image;
            return (
              <div key={index} className="card">
                <div className="card-body ">
                  <img
                    alt={author}
                    data-src={download_url}
                    className="card-img-top"
                    src={
                      "https://picsum.photos/id/870/300/300?grayscale&blur=2"
                    }
                  />
                </div>
                <div className="card-footer">
                  <p className="card-text text-center text-capitalize text-primary">
                    Shot by: {author}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {imgData.fetching && (
        <div className="text-center bg-secondary m-auto p-3">
          <p className="m-0 text-white">Getting images</p>
        </div>
      )}
      <div
        id="page-bottom-boundary"
        style={{ border: "1px solid red" }}
        ref={bottomBoundaryRef}
      ></div>
    </div>
  );
};

export default Wrapper;
