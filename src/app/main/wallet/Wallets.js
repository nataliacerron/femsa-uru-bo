
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import WalletsHeader from "./WalletsHeader";
import WalletsTable from "./WalletsTable";

function Wallets() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<WalletsHeader />}
            content={<WalletsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("WalletsApp", reducer)(Wallets);
