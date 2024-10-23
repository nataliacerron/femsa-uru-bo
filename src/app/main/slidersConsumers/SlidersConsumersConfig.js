import { lazy } from "react";

const SlidersConsumers = lazy(() => import("./SlidersConsumers"));
const SliderConsumer = lazy(() => import("./sliderConsumer/SliderConsumer"));

const SlidersConsumersConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: "consumerslider",
            element: <SlidersConsumers />,
        },
        {
            path: "consumerslider/:sliderId",
            element: <SliderConsumer />,
        },
    ],
};

export default SlidersConsumersConfig;
