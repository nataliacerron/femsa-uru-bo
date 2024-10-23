import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import SlidersConsumersHeader from "./SlidersConsumersHeader";
import SlidersConsumersTable from "./SlidersConsumersTable";

function SlidersConsumers() {

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<SlidersConsumersHeader />}
      content={<SlidersConsumersTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("slidersConsumersApp", reducer)(SlidersConsumers);
