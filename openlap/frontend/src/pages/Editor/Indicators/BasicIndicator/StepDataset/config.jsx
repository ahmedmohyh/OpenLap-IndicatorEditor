/**@author Louis Born <louis.born@stud.uni-due.de> */
const config = {
    id: 'Dataset',
    title: 'Select and define your data parameters',
    dataset: {
        name: 'Dataset',
        refresh_type: 'PLATFORM',
        mandatory: true,
        multiple_selections: true,
        helper: (<span>
            Choose the dataset from the desired <strong>Online Learning Platform</strong>. Online Learning Platforms are 
        used by students for accessing course contents, forum discussions, sending assessments and more
        </span>)
    },
    activity_types: {
        name: 'Activity Types',
        refresh_type: 'ACTIVITY_TYPE',
        mandatory: true,
        multiple_selections: true,
        helper: (<span>
            The Activity Type is used to categorise the Dataset into a pre-defined type such as a course, a material or a pdf
        </span>)
    },
    action_on_activities: {
        name: 'Action on activities',
        refresh_type: 'ACTION_ON_ACTIVITIES',
        mandatory: true,
        multiple_selections: true,
        helper: (<span>
            The Action on activities is used to define the user's action on a Activity Type
        </span>)
    }
};

export default config;