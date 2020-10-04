import * as React from "react";

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

  // setting up a "listener" to fetch more images when pager.page changes
  // NOTE: no freakin' clue what imgDispatch is there for
  React.useEffect(() => {
    imgDispatch({
      type: "FETCHING_IMAGES",
      fetching: true
    });
    fetch(`https://picsum.photos/v2/list?page=${pager.page}&limit=10`)
      .then((data) => data.json())
      .then((images) => {
        imgDispatch({ type: "STACK_IMAGES", images });
        imgDispatch({ type: "FETCHING_IMAGES", fetching: false });
      })
      .catch((e) => {
        // handle error
        imgDispatch({ type: "FETCHING_IMAGES", fetching: false });
        return e;
      });
  }, [imgDispatch, pager.page]); // JOE: why is imgDispatch here?

  // infinite scrolling setup!
  let bottomBoundaryRef = React.useRef(null);
  // using useCallback to ensure that since scrollObserver is called
  // within a useEffect, we aren't getting tons of executions every
  // time components are re-rendering
  const scrollObserver = React.useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            pagerDispatch({ type: "ADVANCE_PAGE" });
          }
        });
      }).observe(node);
    },
    [pagerDispatch]
  );
  // only when dependencies change do we want to use scrollObserver
  React.useEffect(() => {
    if (bottomBoundaryRef.current) {
      scrollObserver(bottomBoundaryRef.current);
    }
  }, [scrollObserver, bottomBoundaryRef]);

  // Implement lazy-loading
  const imagesRef = React.useRef(null);

  const imgObserver = React.useCallback((node) => {
    const intObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target;
          const newImgSrc = currentImg.dataset.src;

          // only swap out the image source if the new url exists
          if (!newImgSrc) {
            console.error("Image source is invalid!");
          } else {
            currentImg.src = newImgSrc;
          }
          intObs.unobserve(node);
        }
      });
    });
    intObs.observe(node);
  }, []);
  React.useEffect(() => {
    imagesRef.current = document.querySelectorAll(".card-img-top");

    if (imagesRef.current) {
      imagesRef.current.forEach((img) => imgObserver(img));
    }
  }, [imgObserver, imagesRef, imgData.images]);

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
