import React, { useState } from "react";
import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";
import { Box, Paper } from "@mui/material";
import { setselectedDesignId } from "../../redux/canvasData/canvasData";
import { setactiveproduct } from "../../redux/userData/userdataSlice";

const getTouches = (evt) => {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  );
};

const Carousel3d = ({ relatedProducts, setprouctChangeTimeStamp }) => {
  const [state, setState] = useState({
    goToSlide: 0,
    showNavigation: true,
    enableSwipe: true,
    xDown: null,
    yDown: null
  });

  const dispatch = useDispatch()

  const slides = relatedProducts.map((product, index) => {
    return {
      key: uuidv4(),
      content: (
        <div style={{ margin: '0 20px' }}>
          <Paper elevation={3} sx={{ width: '80%', margin: '0 auto', transition: 'background-color 0.3s ease', cursor: "pointer", '&:hover': { backgroundColor: '#8C9DD3' } }}>
            <Box width="100%" display="flex" justifyContent="center" alignItems="center" height={250}>
              <img onClick={() => {
                  dispatch(setselectedDesignId(""))
                  dispatch(setactiveproduct({ _id: product._id, linkfront: product.linkfront, linkback: product.linkback, name: product.name }));
                  setprouctChangeTimeStamp(true)
              }} style={{ maxWidth: "100%" }} src={product.productImage} alt={product.name} />
            </Box>
          </Paper>
        </div>
      ),
      onClick: () => setState(prevState => ({ ...prevState, goToSlide: index }))
    };
  });

  const handleTouchStart = (evt) => {
    if (!state.enableSwipe) {
      return;
    }

    const firstTouch = getTouches(evt)[0];
    setState(prevState => ({
      ...prevState,
      xDown: firstTouch.clientX,
      yDown: firstTouch.clientY
    }));
  };

  const handleTouchMove = (evt) => {
    if (!state.enableSwipe || (!state.xDown && !state.yDown)) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = state.xDown - xUp;
    let yDiff = state.yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        setState(prevState => ({
          ...prevState,
          goToSlide: prevState.goToSlide + 1,
          xDown: null,
          yDown: null
        }));
      } else {
        /* right swipe */
        setState(prevState => ({
          ...prevState,
          goToSlide: prevState.goToSlide - 1,
          xDown: null,
          yDown: null
        }));
      }
    }
  };

  return (
    <div
      style={{ width: "80%", height: "500px", margin: "0 auto" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <Carousel
        slides={slides}
        goToSlide={state.goToSlide}
        showNavigation={state.showNavigation}
      />
    </div>
  )
}

export default Carousel3d;
