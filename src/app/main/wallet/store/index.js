import { combineReducers } from "@reduxjs/toolkit";

import Wallets from "./walletsSlice";
import Wallet from "./walletSlice";

const reducer = combineReducers({
  Wallets,
  Wallet,
});

export default reducer;
