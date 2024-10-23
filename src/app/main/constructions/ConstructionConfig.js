import { lazy } from "react";

const Construction = lazy(() => import("./Construction"));

const ConstructionConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: "constructions",
            element: <Construction />,
        },
    ],
};

export default ConstructionConfig;
