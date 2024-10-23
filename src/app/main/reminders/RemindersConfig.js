import { lazy } from "react";

const Reminders = lazy(() => import("./Reminders"));
const Reminder = lazy(() => import("./reminder/Reminder"));

const RemindersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "reminders",
      element: <Reminders />,
    },
    {
      path: "reminders/:reminderId",
      element: <Reminder />,
    },
  ],
};

export default RemindersConfig;
