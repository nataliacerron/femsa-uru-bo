import { combineReducers } from "@reduxjs/toolkit";

import reminders from "./remindersSlice";
import reminder from "./reminderSlice";

const reducer = combineReducers({
  reminders,
  reminder,
});

export default reducer;
