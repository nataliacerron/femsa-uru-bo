import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import ExampleConfig from "../main/example/ExampleConfig";
import UsersConfig from "../main/users/UsersConfig";
import appsConfigs from "../main/appsConfigs";
import ResetConfig from "../main/rest-pass/ResetConfig";
import RolesConfig from "../main/roles/RolesConfig";

const routeConfigs = [
  //ExampleConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  UsersConfig,
  ResetConfig,
  RolesConfig,
  ...appsConfigs,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="dashboards" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
