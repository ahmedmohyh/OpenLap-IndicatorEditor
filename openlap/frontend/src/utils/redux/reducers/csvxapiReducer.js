
export const SET_DEFAULT = "Initialized";
export const EDIT_ISC_DATA = "Edit an indicator";
export const DATASET_ROW_DATA = "CreateData row data set";
export const DATASET_COLUMN_DEF = "CreateData column data set";
export const SET_XAPI_FINAL = "Set final xAPI data";
export const SET_CHECKER = "Set Checker data";
export const SET_FORM = "Set Form data";
export const SET_SELECTED_FILE = "Set File";

export const SET_ACTOR_NAME = "Set actor.name";

export const GET_STATEMENTS = "Fetch list of statements";
export const SET_STATEMENTS = "Store list of statements";

// ACTIONS

export const getStatements = () => ({
  type: GET_STATEMENTS,
});

export const setStatements = (statements) => ({
  type: SET_STATEMENTS,
  statements,
  //  rowData: statements
});

export const setDatasetRowData = (rowData) => ({
  type: DATASET_ROW_DATA,
  rowData,
});
export const setDatasetColumnDef = (columnDefs) => ({
  type: DATASET_COLUMN_DEF,
  columnDefs,
});
export const setXapiFinal = (xapiFinal) => ({
  type: SET_XAPI_FINAL,
  xapiFinal,
});
export const setChecker = (checker) => ({
  type: SET_CHECKER,
  checker,
});
export const setForm = (form) => ({
  type: SET_FORM,
  form,
});

export const setSelectedFile = (selectedFile) => ({
  type: SET_SELECTED_FILE,
  selectedFile,
});

export const setActorName = (actorName) => ({
  type: SET_ACTOR_NAME,
  actorName: actorName,
});

export const setDefault = () => ({
  type: SET_DEFAULT,
});
export const editISC = (iscData) => ({
  type: EDIT_ISC_DATA,
  iscData,
});

const initialState = {
  statements: [],
  data: {
    rowData: [],
    columnDefs: [],
  },
  selectedFile: {
    name: "",
  },
  xapiFinal: [],
  checker: [],
  form: {
    id: {
      selected: false,
      stringParts: [],
    },
    actor: {
      selected: true,
      ifi: "",
      mbox: {
        selected: false,
        stringParts: [],
      },
      mbox_sha1sum: {
        selected: false,
        generateSHA1: false,
        stringParts: [],
      },
      openid: {
        selected: false,
        stringParts: [],
      },
      accountHomepage: {
        selected: false,
        stringParts: [],
      },
      accountName: {
        selected: false,
        stringParts: [],
      },
      name: {
        selected: false,
        stringParts: [],
      },
      objecttype: {
        selected: false,
        value: "",
      },
      members: {
        selected: false,
        array: [],
      },
    },

    verb: {
      selected: true,
      id: {
        selected: false,
        stringParts: [],
      },
      display: {
        selected: false,
        languages: {},
      },
    },

    object: {
      selected: true,
      id: {
        selected: false,
        stringParts: [],
      },
      definitionName: {
        selected: false,
        languages: {},
      },
      definitionDescription: {
        selected: false,
        languages: {},
      },
      definitionType: {
        selected: false,
        stringParts: [],
      },
      definitionMoreinfo: {
        selected: false,
        stringParts: [],
      },
      definitionExtension: {
        selected: false,
        json: {},
      },
      definitionInteractiontype: {
        selected: false,
        value: "",
      },
      definitionCorrectresponses: {
        selected: false,
        array: [],
      },
      definitionChoices: {
        selected: false,
        array: [],
      },
      definitionScales: {
        selected: false,
        array: [],
      },
      definitionSources: {
        selected: false,
        array: [],
      },
      definitionTargets: {
        selected: false,
        array: [],
      },
      definitionSteps: {
        selected: false,
        array: [],
      },
    },

    context: {
      selected: true,

      registration: {
        selected: false,
        stringParts: [],
      },
      revision: {
        selected: false,
        stringParts: [],
      },
      platform: {
        selected: false,
        stringParts: [],
      },
      language: {
        selected: false,
        tag: "",
      },
      instructor: {
        selected: false,
        ifi: "",
        mbox: {
          selected: false,
          stringParts: [],
        },
        mbox_sha1sum: {
          selected: false,
          generateSHA1: false,
          stringParts: [],
        },
        openid: {
          selected: false,
          stringParts: [],
        },
        accountHomepage: {
          selected: false,
          stringParts: [],
        },
        accountName: {
          selected: false,
          stringParts: [],
        },
        name: {
          selected: false,
          stringParts: [],
        },
        objecttype: {
          selected: false,
          value: "",
        },
        members: {
          selected: false,
          array: [],
        },
      },
      members: {
        selected: false,
        array: [],
      },
      extension: {
        selected: false,
        json: {},
      },
      contextActivitiesParent: {
        selected: false,
        array: [],
      },
      contextActivitiesGrouping: {
        selected: false,
        array: [],
      },
      contextActivitiesCategory: {
        selected: false,
        array: [],
      },
      contextActivitiesOther: {
        selected: false,
        array: [],
      },
    },

    result: {
      selected: false,
      score: {
        selected: false,
        scaled: {
          selected: false,
          autogenerate: false,
          stringParts: [],
        },
        raw: {
          selected: false,
          stringParts: [],
        },
        min: {
          selected: false,
          stringParts: [],
        },
        max: {
          selected: false,
          stringParts: [],
        },
      },
      success: {
        selected: false,
        stringParts: [],
      },
      completion: {
        selected: false,
        stringParts: [],
      },
      response: {
        selected: false,
        stringParts: [],
      },
      duration: {
        selected: false,
        stringParts: [],
      },
      extension: {
        selected: false,
        json: {},
      },
    },

    timestamp: {
      selected: false,
      stringParts: [],
    },

    attachments: {
      selected: false,
      array: [],
    },
  },
  fetchedData: {
    platforms: [],
  },
};

export default function csvxapiReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEFAULT:
      return {
        ...state,
        data: {
          rowData: [], //action.payload.data.rowData,
          columnDefs: [],
        },
      };
    // case EDIT_ISC_DATA:
    //   return {
    //     ...state,
    //     indicatorName: action.iscData.indicatorName,
    //     visualization: action.iscData.visualization,
    //     data: action.iscData.data,
    //   };
    case SET_STATEMENTS:
      return {
        ...state,
        statements: action.statements,
      };
    case DATASET_ROW_DATA:
      return {
        ...state,
        data: { ...state.data, rowData: action.rowData },
      };
    case DATASET_COLUMN_DEF:
      return {
        ...state,
        data: { ...state.data, columnDefs: action.columnDefs },
      };
    case SET_XAPI_FINAL:
      return {
        ...state,
        xapiFinal: action.xapiFinal,
      };
    case SET_CHECKER:
      return {
        ...state,
        checker: action.checker,
      };
    case SET_FORM:
      return {
        ...state,
        form: action.form,
      };
    case SET_SELECTED_FILE:
      return {
        ...state,
        form: action.selectedFile,
      };
    case SET_ACTOR_NAME:
      return {
        ...state,
        form: { ...state.form, actorName: action.actorName },
      };

    default:
      return state;
  }
}
