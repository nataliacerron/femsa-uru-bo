import { combineReducers } from "@reduxjs/toolkit";

import slidersConsumers from "./slidersConsumersSlice";
import sliderConsumer from "./sliderConsumerSlice";

const reducer = combineReducers({
  slidersConsumers,
  sliderConsumer,
});

export default reducer;
