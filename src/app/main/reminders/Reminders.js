import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import RemindersHeader from "./RemindersHeader";
import RemindersTable from "./RemindersTable";

function Reminders() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<RemindersHeader />}
      content={<RemindersTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("remindersApp", reducer)(Reminders);
