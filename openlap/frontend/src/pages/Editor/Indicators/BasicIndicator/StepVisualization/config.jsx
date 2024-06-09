const config = {
    id: 'Visualization',
    title: 'Select visualization settings',
    vis_library: {
        name: 'Visualization Library',
        mandatory: true,
        multiple_selections: false,
        helper: (<span>
            Please choose the Visualization Library for rendering your data
        </span>)
    },
    vis_type: {
        name: 'Visualization Type',
        mandatory: true,
        multiple_selections: false,
        helper: (<span>
            Please choose the type of chart or graph to visualize your data
        </span>)
    }
}

export default config;