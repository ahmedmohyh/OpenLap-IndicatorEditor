const config = {
    id: 'Analysis',
    title: 'Select and define analysis methods',
    analysis_method: {
        name: 'Analysis Method',
        refresh_type: 'ANALYSIS_METHOD',
        mandatory: true,
        multiple_selections: false,
        helper: (<span>
            Choose the dataset from the desired <strong>Online Learning Platform</strong>. Online Learning Platforms are 
        used by students for accessing course contents, forum discussions, sending assessments and more
        </span>)
    },
    input_params: {
        name: 'Analysis Input Parameters',
        refresh_type: 'INPUT_PARAMS',
        mandatory: true,
        multiple_selections: false,
        helper: (<span>
            Analysis inputs accepts data from filters and dataset section <br></br>
            e.g. <b><i>"Activities"</i></b> option consists of a list of all the activities such as a
                        list of course names, a list of resources
        </span>)
    }
}

export default config;