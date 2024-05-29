import React, { useState } from "react";
import Property from "./Property";
import FormInteractionType from "./FormInteractionType";
import SelectionProperty from "./SelectionProperty";
import {
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import {
  setForm
} from "../../../../../utils/redux/reducers/csvxapiReducer";
import FormLanguageMap from "./FormLanguageMap";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const FormObject = (props) => {
  const { prefix, type, index } = props;

  const dispatch = useDispatch();
  const form = useSelector((state) => state.csvxapiReducer.form);
  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );

  const [moreInfo, setMoreInfo] = useState(false);
  const [interactionTypeAdd, setInteractionTypeAdd] = useState(false);



  const handleSetObjectInteractiontype = () => {
    setInteractionTypeAdd((prevState) => !prevState)
    let arr = [];
    switch (type) {
      case "object":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionInteractiontype: {
                ...form.object.definitionInteractiontype,
                selected: true,
              },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr[index].definitionInteractiontype = {
          ...arr[index].definitionInteractiontype,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr[index].definitionInteractiontype = {
          ...arr[index].definitionInteractiontype,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr[index].definitionInteractiontype = {
          ...arr[index].definitionInteractiontype,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr[index].definitionInteractiontype = {
          ...arr[index].definitionInteractiontype,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };



  const [objectExtension, setObjectExtension] = useState(false);

  const handleSetObjectExtension = () => {
    setObjectExtension((prevState) => !prevState);
    let arr = [];
    switch (type) {
      case "object":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionExtension: {
                ...form.object.definitionExtension,
                selected: true,
              },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: true,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };
  const handleRemoveObjectExtension = () => {
    setObjectExtension((prevState) => !prevState);
    let arr = [];
    switch (type) {
      case "object":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionExtension: {
                ...form.object.definitionExtension,
                selected: false,
              },
            },
          })
        );
        break;
      case "parent":
        arr = form.context.contextActivitiesParent.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: false,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesParent: {
                ...form.context.contextActivitiesParent,
                array: arr,
              },
            },
          })
        );
        break;
      case "grouping":
        arr = form.context.contextActivitiesGrouping.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: false,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesGrouping: {
                ...form.context.contextActivitiesGrouping,
                array: arr,
              },
            },
          })
        );
        break;
      case "category":
        arr = form.context.contextActivitiesCategory.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: false,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesCategory: {
                ...form.context.contextActivitiesCategory,
                array: arr,
              },
            },
          })
        );
        break;
      case "other":
        arr = form.context.contextActivitiesOther.array;
        arr[index].definitionExtension = {
          ...arr[index].definitionExtension,
          selected: false,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              contextActivitiesOther: {
                ...form.context.contextActivitiesOther,
                array: arr,
              },
            },
          })
        );
        break;
      default:
    }
  };

  const handleJsonInputObjectExtension = (event) => {
    if (event.error === false) {
      let arr = [];
      switch (type) {
        case "object":
          dispatch(
            setForm({
              ...form,
              object: {
                ...form.object,
                definitionExtension: {
                  ...form.object.definitionExtension,
                  json: event.jsObject,
                },
              },
            })
          );
          break;
        case "parent":
          arr = form.context.contextActivitiesParent.array;
          arr[index].definitionExtension = {
            ...arr[index].definitionExtension,
            json: event.jsObject,
          };
          dispatch(
            setForm({
              ...form,
              context: {
                ...form.context,
                contextActivitiesParent: {
                  ...form.context.contextActivitiesParent,
                  array: arr,
                },
              },
            })
          );
          break;
        case "grouping":
          arr = form.context.contextActivitiesGrouping.array;
          arr[index].definitionExtension = {
            ...arr[index].definitionExtension,
            json: event.jsObject,
          };
          dispatch(
            setForm({
              ...form,
              context: {
                ...form.context,
                contextActivitiesGrouping: {
                  ...form.context.contextActivitiesGrouping,
                  array: arr,
                },
              },
            })
          );
          break;
        case "category":
          arr = form.context.contextActivitiesCategory.array;
          arr[index].definitionExtension = {
            ...arr[index].definitionExtension,
            json: event.jsObject,
          };
          dispatch(
            setForm({
              ...form,
              context: {
                ...form.context,
                contextActivitiesCategory: {
                  ...form.context.contextActivitiesCategory,
                  array: arr,
                },
              },
            })
          );
          break;
        case "other":
          arr = form.context.contextActivitiesOther.array;
          arr[index].definitionExtension = {
            ...arr[index].definitionExtension,
            json: event.jsObject,
          };
          dispatch(
            setForm({
              ...form,
              context: {
                ...form.context,
                contextActivitiesOther: {
                  ...form.context.contextActivitiesOther,
                  array: arr,
                },
              },
            })
          );
          break;
        default:
      }
    }
  };

  return (
    <>
      {/* <SelectionProperty
            name="object.objectType"
            selections={[
              ["Activity", 1],
              ["Agent", 2],
              ["Group", 3],
              ["SubStatement", 4],
              ["StatementRef", 5],
            ]}
          ></SelectionProperty> */}
      <Property
        columnDefs={columnDefs}
        name={prefix + "object.id"}
        desc="IRI, e.g. http://example.adlnet.gov/xapi/example/activity"
        type={type}
        index={index}
      />
      <Paper sx={{ overflowX: "auto" }}>
        <Grid>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
            definition
          </Typography>
        </Grid>
        <Grid sx={{ pb: 2, pl: 3, pr: 3 }}>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>object.definition.name</Typography>
          <FormLanguageMap
            columnDefs={columnDefs} 
            name={prefix + "object.definition.name"}
            type={type}
            index={index}
          />
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
            object.definition.description
          </Typography>
          <FormLanguageMap
            columnDefs={columnDefs} 
            name={prefix + "object.definition.description"}
            type={type}
            index={index}
          />
          <Property
            columnDefs={columnDefs}
            name={prefix + "object.definition.type"}
            desc="IRI, e.g. http://adlnet.gov/expapi/activities/meeting"
            type={type}
            index={index}
          />
          {moreInfo ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) => setMoreInfo((prevState) => !prevState)}
              />
              <Property
                columnDefs={columnDefs}
                name={prefix + "object.definition.moreInfo"}
                desc="IRL, e.g. http://virtualmeeting.example.com/345256"
                type={type}
                index={index}
              />
            </>
          ) : (
            <></>
          )}
          {objectExtension ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) =>
                  handleRemoveObjectExtension((prevState) => !prevState)
                }
              />
              <JSONInput
                id="a_unique_id"
                placeholder={{}}
                // colors      = { darktheme }
                locale={locale}
                height="100px"
                onChange={(event) => handleJsonInputObjectExtension(event)}
              />
            </>
          ) : (
            <></>
          )}
          {interactionTypeAdd ? (
            <>
              <ClearIcon
                fontSize="medium"
                onClick={(event) =>
                  setInteractionTypeAdd((prevState) => !prevState)
                }
              />

              <SelectionProperty
                columnDefs={columnDefs}
                name={prefix + "object.definition.interactionType"}
                index={index}
                type={type}
                selections={[
                  ["true-false", 1],
                  ["choice", 2],
                  ["fill-in", 3],
                  ["long-fill-in", 4],
                  ["matching", 5],
                  ["performance", 6],
                  ["sequencing", 7],
                  ["likert", 8],
                  ["numeric", 9],
                  ["other", 10],
                ]}
              />
            </>
          ) : (
            <></>
          )}

          <Button
            startIcon={<AddIcon />}
            onClick={(event) => setMoreInfo((prevState) => !prevState)}
            disabled={moreInfo}
          >
            More Info
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => handleSetObjectExtension()}
            disabled={objectExtension}
          >
            Extension
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={(event) => handleSetObjectInteractiontype()
            }
            disabled={interactionTypeAdd}
          >
            Interaction Type
          </Button>
          {type == "object" &&
          form.object.definitionInteractiontype.selected ? (
            <>
            <Typography>test</Typography>
              <FormInteractionType
                interactionType={form.object.definitionInteractiontype}
                type={type}
                index={index}
                prefix={prefix}
              />
            </>
          ) : type == "parent" &&
            form.context.contextActivitiesParent.array[index]
              .definitionInteractiontype.selected ? (
            <>
              <FormInteractionType
                interactionType={
                  form.context.contextActivitiesParent.array[index]
                    .definitionInteractiontype
                }
                type={type}
                index={index}
                prefix={prefix}
              />
            </>
          ) : type == "grouping" &&
            form.context.contextActivitiesGrouping.array[index]
              .definitionInteractiontype.selected ? (
            <>
              <FormInteractionType
                interactionType={
                  form.context.contextActivitiesGrouping.array[index]
                    .definitionInteractiontype
                }
                type={type}
                index={index}
                prefix={prefix}
              />
            </>
          ) : type == "category" &&
            form.context.contextActivitiesCategory.array[index]
              .definitionInteractiontype.selected ? (
            <>
              <FormInteractionType
                interactionType={
                  form.context.contextActivitiesCategory.array[index]
                    .definitionInteractiontype
                }
                type={type}
                index={index}
                prefix={prefix}
              />
            </>
          ) : type == "other" &&
            form.context.contextActivitiesOther.array[index]
              .definitionInteractiontype.selected ? (
            <>
              <FormInteractionType
                interactionType={
                  form.context.contextActivitiesOther.array[index]
                    .definitionInteractiontype
                }
                type={type}
                index={index}
                prefix={prefix}
              />
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default FormObject;
