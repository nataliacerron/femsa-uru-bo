import { combineReducers } from "@reduxjs/toolkit";

import notificationsConsumers from "./notificationsConsumersSlice";
import notificationConsumer from "./notificationConsumerSlice";

const reducer = combineReducers({
  notificationsConsumers,
  notificationConsumer,
});

export default reducer;
