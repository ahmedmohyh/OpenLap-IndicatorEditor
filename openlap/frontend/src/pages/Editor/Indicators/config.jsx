import BasicIndicator from "../../../assets/img/vis_dashboard_cover/indicator-editor__img-new.png";
import CompositeIndicator from "../../../assets/img/vis_dashboard_cover/indicator-editor__img-composite.png";
import MultilevelIndicator from "../../../assets/img/vis_dashboard_cover/indicator-editor__img-multi.png";

const config = {
    0: {
        name: "Basic Indicator",
        info: "Create a simple basic indicator from scratch.",
        img: BasicIndicator,
        tooltip: "Click to start"
    },
    1: {
        name: "Composite Indicator",
        info: "Combine basic indicators with the same analytic method.",
        img: CompositeIndicator,
        tooltip: "Click to start"
    },
    3: {
        name: "Multi-level Indicator",
        info: "Combine basic indicators with at least one common attribute.",
        img: MultilevelIndicator,
        tooltip: "Click to start"
    }
};

export default config;