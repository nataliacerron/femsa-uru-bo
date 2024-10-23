import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import NotificationsConsumersHeader from "./NotificationsConsumersHeader";
import NotificationsConsumersTable from "./NotificationsConsumersTable";

function NotificationsConsumers() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<NotificationsConsumersHeader />}
      content={<NotificationsConsumersTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("notificationsConsumersApp", reducer)(NotificationsConsumers);
