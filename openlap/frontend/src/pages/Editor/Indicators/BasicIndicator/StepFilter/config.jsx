const config = {
    id: 'Filter',
    title: 'Select filters to refine your dataset',
    list_of_activities: {
        name: 'Activities',
        mandatory: true,
        multiple_selections: true,
        helper: (<span>
           Select the <strong>Activities</strong> you want to analyse
        </span>)
    },
    users: {
        name: 'Users',
        mandatory: false,
        multiple_selections: false,
        helper: (<span>
            Analyse all data or exclude your own
        </span>)
    },
    time: {
        name: 'Time',
        mandatory: false,
        multiple_selections: false,
        helper: (<span>
            Choose the dataset from the desired <strong>Online Learning Platform</strong>. Online Learning Platforms are 
        used by students for accessing course contents, forum discussions, sending assessments and more
        </span>)
    }
};

export default config;