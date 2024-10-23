import { lazy } from "react";

const NotificationsConsumers = lazy(() => import("./NotificationsConsumers"));
const NotificationConsumer = lazy(() => import("./notificationConsumer/NotificationConsumer"));

const NotificationsConsumersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "consumer-notifications",
      element: <NotificationsConsumers />,
    },
    {
      path: "consumer-notifications/:notificationConsumerId",
      element: <NotificationConsumer />,
    },
  ],
};

export default NotificationsConsumersConfig;
