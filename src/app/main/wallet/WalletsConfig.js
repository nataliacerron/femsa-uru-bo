import { lazy } from "react";

const Wallets = lazy(() => import("./Wallets"));
const Wallet = lazy(() => import("./wallet/Wallet"));

const WalletsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "Wallets",
      element: <Wallets />,

    },
    {
      path: "Wallets/:WalletId",
      element: <Wallet />,
    },
  ],
};

export default WalletsConfig;
