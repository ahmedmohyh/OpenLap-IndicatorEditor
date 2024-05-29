import React, { useState, useEffect, ChangeEvent } from "react";

import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import HelpIcon from "@mui/icons-material/Help";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "../../../../../utils/redux/reducers/csvxapiReducer";
//import{ handleSetProperty } from "./ToXAPI";

const Property = (props) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.csvxapiReducer.form);

  const [openMenu, setOpenMenu] = useState(null);
  const [stringParts, setStringParts] = useState([{ type: "CSV", str: "" }]);

  const { columnDefs, name, desc, index, idx, langIndex, abbr, type } = props;

  // const columnDefs = useSelector(
  //   (state) => state.csvxapiReducer.data.columnDefs
  // );
  const [openColumnDefs, setOpenColumnDefs] = useState(false);
  const [column, setColumn] = useState("");

  const handleCSVColumn = () => {
    setStringParts([...stringParts, { type: "CSV", str: "" }]);
    if (openMenu) setOpenMenu(null);
  };

  const handleTXTField = () => {
    setStringParts([...stringParts, { type: "TXT", str: "" }]);
    if (openMenu) setOpenMenu(null);
  };

  const handleDeletePart = (index) => {
    setStringParts((parts) => {
      return parts.filter((_, i) => i !== index);
    });
  };


//   useEffect(() => {
//     handleSetValue();    
//     // if(value!==""){
//     //   handleSetValue();
//     // }else{
//     //   //alert("test");
//     //   // handleSetFalse();
//     // }
//   }, [stringParts]);

//   const handleChange = (val, index) => {
//     let sp = stringParts;
//     sp[index].str = val;
//     setStringParts(sp);
//     //stringParts[index].str = val;
//     //setValue(val);
//     //handleSetValue();
// };

  const handleSetValue = (val, index) => {
    stringParts[index].str = val;
    //console.log(stringParts);
    let arr = [];
    let arr2 = [];
    let arr3 = [];

    switch (name) {
      ////ID////////////////////////////////////////////////////////////////////////
      case "id":
        dispatch(
          setForm({ ...form, id: { selected: true, stringParts: stringParts } })
        );
        break;

      ////ACTOR////////////////////////////////////////////////////////////////////
      case "actor.name":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              name: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "actor.account.homepage":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              accountHomepage: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "actor.account.name":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              accountName: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "actor.mbox":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              mbox: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "actor.mbox_sha1sum":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              mbox_sha1sum: { ...form.actor.mbox_sha1sum, selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "actor.openid":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              openid: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;

      case "actor.members.name":
        let arrName = form.actor.members.array;
        arrName[props.index].name = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              members: { selected: true, array: arrName },
            },
          })
        );
        break;
      case "actor.members.account.homepage":
        let arrAccountHomepage = form.actor.members.array;
        arrAccountHomepage[props.index].accountHomepage = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              members: { selected: true, array: arrAccountHomepage },
            },
          })
        );
        break;
      case "actor.members.account.name":
        let arrAccountName = form.actor.members.array;
        arrAccountName[props.index].accountName = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              members: { selected: true, array: arrAccountName },
            },
          })
        );
        break;
      case "actor.members.mbox":
        arr = form.actor.members.array;
        arr[props.index].mbox = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            actor: { ...form.actor, members: { selected: true, array: arr } },
          })
        );
        break;
      case "actor.members.mbox_sha1sum":
        arr = form.actor.members.array;
        arr[props.index].mbox_sha1sum = {
          ...arr[props.index].mbox_sha1sum,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            actor: { ...form.actor, members: { selected: true, array: arr } },
          })
        );
        break;
      case "actor.members.openid":
        arr = form.actor.members.array;
        arr[props.index].openid = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            actor: { ...form.actor, members: { selected: true, array: arr } },
          })
        );
        break;

      ////VERB/////////////////////////////////////////////////////////////////
      case "verb.id":
        dispatch(
          setForm({
            ...form,
            verb: {
              ...form.verb,
              id: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "verb.display":
        dispatch(
          setForm({
            ...form,
            verb: {
              ...form.verb,
              display: {selected: true, languages: { ...form.verb.display.languages, [abbr]: stringParts }},
            },
          })
        );
        break;

      ////OBJECT/////////////////////////////////////////////////////////////////
      case "object.id":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              id: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "object.definition.name":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionName: {
                selected: true,
                languages: {
                  ...form.object.definitionName.languages,
                  [abbr]: stringParts,
                },
              },
            },
          })
        );
        break;
      case "object.definition.description":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionDescription: {
                selected: true,
                languages: {
                  ...form.object.definitionDescription.languages,
                  [abbr]: stringParts,
                },
              },
            },
          })
        );
        break;
      case "object.definition.type":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionType: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "object.definition.moreInfo":
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionMoreinfo: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "object.definition.correctResponses":
        arr = form.object.definitionCorrectresponses.array;
        arr[props.idx] = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            object: {
              ...form.object,
              definitionCorrectresponses: { selected: true, array: arr },
            },
          })
        );
        break;
      
      case "correctresponses.response":
        switch(type){
          case "object":
            arr = form.object.definitionCorrectresponses.array;
            arr2 = arr[idx].components;
            arr2[langIndex] = { ...arr2[langIndex], stringParts: stringParts };

            arr[idx] = {
              selected: true,
              stringParts: [],
              components: arr2,
            };
            dispatch(
              setForm({
                ...form,
                object: {
                  ...form.object,
                  definitionCorrectresponses: { selected: true, array: arr },
                },
              })
            );
            break;
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            arr2 = arr[index].definitionCorrectresponses.array[idx].components;
            arr2[langIndex] = { ...arr2[langIndex], stringParts: stringParts };
            arr[index].definitionCorrectresponses.array[idx].components = arr2;
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: {
                    selected: true,
                    array: arr,
                  },
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            arr2 = arr[index].definitionCorrectresponses.array[idx].components;
            arr2[langIndex] = { ...arr2[langIndex], stringParts: stringParts };
            arr[index].definitionCorrectresponses.array[idx].components = arr2;
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: {
                    selected: true,
                    array: arr,
                  },
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            arr2 = arr[index].definitionCorrectresponses.array[idx].components;
            arr2[langIndex] = { ...arr2[langIndex], stringParts: stringParts };
            arr[index].definitionCorrectresponses.array[idx].components = arr2;
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: {
                    selected: true,
                    array: arr,
                  },
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            arr2 = arr[index].definitionCorrectresponses.array[idx].components;
            arr2[langIndex] = { ...arr2[langIndex], stringParts: stringParts };
            arr[index].definitionCorrectresponses.array[idx].components = arr2;
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: {
                    selected: true,
                    array: arr,
                  },
                },
              })
            );
            break;
          default:
        }
        break;
      
      case "choices.id":
        arr = form.object.definitionChoices.array;
        arr[idx].id = stringParts;
        dispatch(
          setForm({
            ...form,
            object: { ...form.object, definitionChoices: { selected: true, array: arr } },
          })
        );
        break;
      case "choices.description":
        arr = form.object.definitionChoices.array;
        let descChoice = arr[idx].description;
        arr[idx].description = {
          ...descChoice,
          [abbr]: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            object: { ...form.object, definitionChoices: { selected: true, array: arr } },
          })
        );
        break;
        case "scales.id":
          arr = form.object.definitionScales.array;
          arr[idx].id = stringParts;
          dispatch(
            setForm({
              ...form,
              object: { ...form.object, definitionScales: { selected: true, array: arr } },
            })
          );
          break;
        case "scales.description":
          arr = form.object.definitionScales.array;
          let descScale = arr[idx].description;
          arr[idx].description = {
            ...descScale,
            [abbr]: stringParts,
          };
          dispatch(
            setForm({
              ...form,
              object: { ...form.object, definitionScales: { selected: true, array: arr } },
            })
          );
          break;        
          case "sources.id":
            arr = form.object.definitionSources.array;
            arr[idx].id = stringParts;
            dispatch(
              setForm({
                ...form,
                object: { ...form.object, definitionSources: { selected: true, array: arr } },
              })
            );
            break;
          case "sources.description":
            arr = form.object.definitionSources.array;
            let descSource = arr[idx].description;
            arr[idx].description = {
              ...descSource,
              [abbr]: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                object: { ...form.object, definitionSources: { selected: true, array: arr } },
              })
            );
            break;
            case "targets.id":
              arr = form.object.definitionTargets.array;
              arr[idx].id = stringParts;
              dispatch(
                setForm({
                  ...form,
                  object: { ...form.object, definitionTargets: { selected: true, array: arr } },
                })
              );
              break;
            case "targets.description":
              arr = form.object.definitionTargets.array;
              let descTarget = arr[idx].description;
              arr[idx].description = {
                ...descTarget,
                [abbr]: stringParts,
              };
              dispatch(
                setForm({
                  ...form,
                  object: { ...form.object, definitionTargets: { selected: true, array: arr } },
                })
              );
              break;
              case "steps.id":
                arr = form.object.definitionSteps.array;
                arr[idx].id = stringParts;
                dispatch(
                  setForm({
                    ...form,
                    object: { ...form.object, definitionSteps: { selected: true, array: arr } },
                  })
                );
                break;
              case "steps.description":
                arr = form.object.definitionSteps.array;
                let descStep = arr[idx].description;
                arr[idx].description = {
                  ...descStep,
                  [abbr]: stringParts,
                };
                dispatch(
                  setForm({
                    ...form,
                    object: { ...form.object, definitionSteps: { selected: true, array: arr } },
                  })
                );
                break;

      ////CONTEXT///////////////////////////////////////////////////////////////
      case "context.registration":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              registration: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "context.revision":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              revision: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "context.platform":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              platform: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "context.language":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              language: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;

      case "instructor.name":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                name: { selected: true, stringParts: stringParts },
              },
            },
          })
        );
        break;
      case "instructor.account.homepage":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                accountHomepage: { selected: true, stringParts: stringParts },
              },
            },
          })
        );
        break;
      case "instructor.account.name":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                accountName: { selected: true, stringParts: stringParts },
              },
            },
          })
        );
        break;
      case "instructor.mbox":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                mbox: { selected: true, stringParts: stringParts },
              },
            },
          })
        );
        break;
      case "instructor.mbox_sha1sum":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                mbox_sha1sum: { ...form.context.instructor.mbox_sha1sum, selected: true, stringParts: stringParts },
              },
            },
          })
        );
        break;
      case "instructor.openid":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                openid: { selected: true, stringParts: stringParts },
              },
            },
          })
        );
        break;

      case "instructor.members.name":
        arr = form.context.instructor.members.array;
        arr[props.index].name = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { selected: true, array: arr },
              },
            },
          })
        );
        break;
      case "instructor.members.account.homepage":
        arr = form.context.instructor.members.array;
        arr[props.index].accountHomepage = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { selected: true, array: arr },
              },
            },
          })
        );
        break;
      case "instructor.members.account.name":
        arr = form.context.instructor.members.array;
        arr[props.index].accountName = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { selected: true, array: arr },
              },
            },
          })
        );
        break;
      case "instructor.members.mbox":
        arr = form.context.instructor.members.array;
        arr[props.index].mbox = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { selected: true, array: arr },
              },
            },
          })
        );
        break;
      case "instructor.members.mbox_sha1sum":
        arr = form.context.instructor.members.array;
        arr[props.index].mbox_sha1sum = {
          ... arr[props.index].mbox_sha1sum,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { selected: true, array: arr },
              },
            },
          })
        );
        break;
      case "instructor.members.openid":
        arr = form.context.instructor.members.array;
        arr[props.index].openid = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { selected: true, array: arr },
              },
            },
          })
        );
        break;

      case "team.members.name":
        let arrMemberName = form.context.members.array;
        arrMemberName[props.index].name = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { selected: true, array: arrMemberName },
            },
          })
        );
        break;
      case "team.members.account.homepage":
        let arrMemberAccountHomepage = form.context.members.array;
        arrMemberAccountHomepage[props.index].accountHomepage = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { selected: true, array: arrMemberAccountHomepage },
            },
          })
        );
        break;
      case "team.members.account.name":
        let arrMemberAccountName = form.context.members.array;
        arrMemberAccountName[props.index].accountName = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { selected: true, array: arrMemberAccountName },
            },
          })
        );
        break;
      case "team.members.mbox":
        arr = form.context.members.array;
        arr[props.index].mbox = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { selected: true, array: arr },
            },
          })
        );
        break;
      case "team.members.mbox_sha1sum":
        arr = form.context.members.array;
        arr[props.index].mbox_sha1sum = {
          ...arr[props.index].mbox_sha1sum,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { selected: true, array: arr },
            },
          })
        );
        break;
      case "team.members.openid":
        arr = form.context.members.array;
        arr[props.index].openid = {
          selected: true,
          stringParts: stringParts,
        };
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { selected: true, array: arr },
            },
          })
        );
        break;

      case "context.activities.object.id":
        switch (type) {
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            arr[index].id = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: { selected: true, array: arr },
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            arr[index].id = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: { selected: true, array: arr },
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            arr[index].id = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: { selected: true, array: arr },
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            arr[index].id = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: { selected: true, array: arr },
                },
              })
            );
            break;
          default:
        }
        break;

      case "context.activities.object.definition.name":

        switch (type) {
          case "parent":
            let arrParent = form.context.contextActivitiesParent.array;
            arrParent[index].definitionName = {
              selected: true,
              languages: {
                ...arrParent[index].definitionName.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: {
                    selected: true,
                    array: arrParent,
                  },
                },
              })
            );
            break;
          case "grouping":
            let arrGrouping = form.context.contextActivitiesGrouping.array;
            arrGrouping[index].definitionName = {
              selected: true,
              languages: {
                ...arrGrouping[index].definitionName.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: {
                    selected: true,
                    array: arrGrouping,
                  },
                },
              })
            );
            break;
          case "category":
            let arrCategory = form.context.contextActivitiesCategory.array;
            arrCategory[index].definitionName = {
              selected: true,
              languages: {
                ...arrCategory[index].definitionName.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: {
                    selected: true,
                    array: arrCategory,
                  },
                },
              })
            );
            break;
          case "other":
            let arrOther = form.context.contextActivitiesOther.array;
            arrOther[index].definitionName = {
              selected: true,
              languages: {
                ...arrOther[index].definitionName.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: {
                    selected: true,
                    array: arrOther,
                  },
                },
              })
            );
            break;
          default:
        }
        break;

      case "context.activities.object.definition.description":
        switch (type) {
          case "parent":
            let arrParent = form.context.contextActivitiesParent.array;
            arrParent[index].definitionDescription = {
              selected: true,
              languages: {
                ...arrParent[index].definitionDescription.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: {
                    selected: true,
                    array: arrParent,
                  },
                },
              })
            );
            break;
          case "grouping":
            let arrGrouping = form.context.contextActivitiesGrouping.array;
            arrGrouping[index].definitionDescription = {
              selected: true,
              languages: {
                ...arrGrouping[index].definitionDescription.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: {
                    selected: true,
                    array: arrGrouping,
                  },
                },
              })
            );
            break;
          case "category":
            let arrCategory = form.context.contextActivitiesCategory.array;
            arrCategory[index].definitionDescription = {
              selected: true,
              languages: {
                ...arrCategory[index].definitionDescription.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: {
                    selected: true,
                    array: arrCategory,
                  },
                },
              })
            );
            break;
          case "other":
            let arrOther = form.context.contextActivitiesOther.array;
            arrOther[index].definitionDescription = {
              selected: true,
              languages: {
                ...arrOther[index].definitionDescription.languages,
                [abbr]: stringParts,
              },
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: {
                    selected: true,
                    array: arrOther,
                  },
                },
              })
            );
            break;
          default:
        }
        break;

      case "context.activities.object.definition.type":
        switch (type) {
          case "parent":
            let arrParent = form.context.contextActivitiesParent.array;
            arrParent[index].definitionType = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: {
                    selected: true,
                    array: arrParent,
                  },
                },
              })
            );
            break;
          case "grouping":
            let arrGrouping = form.context.contextActivitiesGrouping.array;
            arrGrouping[index].definitionType = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: {
                    selected: true,
                    array: arrGrouping,
                  },
                },
              })
            );
            break;
          case "category":
            let arrCategory = form.context.contextActivitiesCategory.array;
            arrCategory[index].definitionType = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: {
                    selected: true,
                    array: arrCategory,
                  },
                },
              })
            );
            break;
          case "other":
            let arrOther = form.context.contextActivitiesOther.array;
            arrOther[index].definitionType = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: {
                    selected: true,
                    array: arrOther,
                  },
                },
              })
            );
            break;
          default:
        }
        break;

      case "context.activities.object.definition.moreInfo":
        switch (type) {
          case "parent":
            let arrParent = form.context.contextActivitiesParent.array;
            arrParent[index].definitionMoreInfo = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesParent: {
                    selected: true,
                    array: arrParent,
                  },
                },
              })
            );
            break;
          case "grouping":
            let arrGrouping = form.context.contextActivitiesGrouping.array;
            arrGrouping[index].definitionMoreInfo = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesGrouping: {
                    selected: true,
                    array: arrGrouping,
                  },
                },
              })
            );
            break;
          case "category":
            let arrCategory = form.context.contextActivitiesCategory.array;
            arrCategory[index].definitionMoreInfo = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesCategory: {
                    selected: true,
                    array: arrCategory,
                  },
                },
              })
            );
            break;
          case "other":
            let arrOther = form.context.contextActivitiesOther.array;
            arrOther[index].definitionMoreInfo = {
              selected: true,
              stringParts: stringParts,
            };
            dispatch(
              setForm({
                ...form,
                context: {
                  ...form.context,
                  contextActivitiesOther: {
                    selected: true,
                    array: arrOther,
                  },
                },
              })
            );
            break;
          default:
        }
        break;

      case "context.activities.object.definition.correctResponses":
        switch (type) {
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            arr[index].definitionCorrectresponses.array[idx].stringParts =
              stringParts;
            dispatch(
              setForm({
                ...form,
                contextActivitiesParent: {
                  selected: true,
                  array: arr,
                },
              })
            );
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            arr[index].definitionCorrectresponses.array[idx].stringParts =
              stringParts;
            dispatch(
              setForm({
                ...form,
                contextActivitiesGrouping: {
                  selected: true,
                  array: arr,
                },
              })
            );
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            arr[index].definitionCorrectresponses.array[idx].stringParts =
              stringParts;
            dispatch(
              setForm({
                ...form,
                contextActivitiesCategory: {
                  selected: true,
                  array: arr,
                },
              })
            );
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            arr[index].definitionCorrectresponses.array[idx].stringParts =
              stringParts;
            dispatch(
              setForm({
                ...form,
                contextActivitiesOther: {
                  selected: true,
                  array: arr,
                },
              })
            );
            break;
          default:
        }
        break;

          case "context.activities.choices.id":

          switch(type){
            case "parent":
              arr = form.context.contextActivitiesParent.array;
              arr2 = arr[index].definitionChoices.array;
              arr2[idx].id = stringParts;
              arr[index].definitionChoices.array = arr2;
              dispatch(
                setForm({
                  ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                })
              );
              break;
            case "grouping":
              arr = form.context.contextActivitiesGrouping.array;
              arr2 = arr[index].definitionChoices.array;
              arr2[idx].id = stringParts;
              arr[index].definitionChoices.array = arr2;
              dispatch(
                setForm({
                  ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesParent, array: arr}}
                })
              );
              break;
            case "category":
              arr = form.context.contextActivitiesCategory.array;
              arr2 = arr[index].definitionChoices.array;
              arr2[idx].id = stringParts;
              arr[index].definitionChoices.array = arr2;
              dispatch(
                setForm({
                  ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesParent, array: arr}}
                })
              );
              break;
            case "other":
              arr = form.context.contextActivitiesOther.array;
              arr2 = arr[index].definitionChoices.array;
              arr2[idx].id = stringParts;
              arr[index].definitionChoices.array = arr2;
              dispatch(
                setForm({
                  ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesParent, array: arr}}
                })
              );
              break;
            default:
          }
          break;

          case "context.activities.choices.description":
            let choicedesc = {};
            switch(type){
              case "parent":
                arr = form.context.contextActivitiesParent.array;
                arr2 = arr[index].definitionChoices.array;
                choicedesc = arr2[idx].description;
                choicedesc = {...choicedesc, [abbr]: stringParts};
                arr2[idx].description = choicedesc;
                arr[index].definitionChoices.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                  })
                );
                break;
              case "grouping":
                arr = form.context.contextActivitiesGrouping.array;
                arr2 = arr[index].definitionChoices.array;
                choicedesc = arr2[idx].description;
                choicedesc = {...choicedesc, [abbr]: stringParts};
                arr2[idx].description = choicedesc;
                arr[index].definitionChoices.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesParent, array: arr}}
                  })
                );
                break;
              case "category":
                arr = form.context.contextActivitiesCategory.array;
                arr2 = arr[index].definitionChoices.array;
                choicedesc = arr2[idx].description;
                choicedesc = {...choicedesc, [abbr]: stringParts};
                arr2[idx].description = choicedesc;
                arr[index].definitionChoices.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesParent, array: arr}}
                  })
                );
                break;
              case "other":
                arr = form.context.contextActivitiesOther.array;
                arr2 = arr[index].definitionChoices.array;
                choicedesc = arr2[idx].description;
                choicedesc = {...choicedesc, [abbr]: stringParts};
                arr2[idx].description = choicedesc;
                arr[index].definitionChoices.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesParent, array: arr}}
                  })
                );
                break;
              default:
            }
            break;

            case "context.activities.scales.id":

            switch(type){
              case "parent":
                arr = form.context.contextActivitiesParent.array;
                arr2 = arr[index].definitionScales.array;
                arr2[idx].id = stringParts;
                arr[index].definitionScales.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                  })
                );
                break;
              case "grouping":
                arr = form.context.contextActivitiesGrouping.array;
                arr2 = arr[index].definitionScales.array;
                arr2[idx].id = stringParts;
                arr[index].definitionScales.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                  })
                );
                break;
              case "category":
                arr = form.context.contextActivitiesCategory.array;
                arr2 = arr[index].definitionScales.array;
                arr2[idx].id = stringParts;
                arr[index].definitionScales.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                  })
                );
                break;
              case "other":
                arr = form.context.contextActivitiesOther.array;
                arr2 = arr[index].definitionScales.array;
                arr2[idx].id = stringParts;
                arr[index].definitionScales.array = arr2;
                dispatch(
                  setForm({
                    ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                  })
                );
                break;
              default:
            }

            break;
            case "context.activities.scales.description":
              let scaledesc = {};
              switch(type){
                case "parent":
                  arr = form.context.contextActivitiesParent.array;
                  arr2 = arr[index].definitionScales.array;
                  scaledesc = arr2[idx].description;
                  scaledesc = {...scaledesc, [abbr]: stringParts};
                  arr2[idx].description = scaledesc;
                  arr[index].definitionScales.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                    })
                  );
                  break;
                case "grouping":
                  arr = form.context.contextActivitiesGrouping.array;
                  arr2 = arr[index].definitionScales.array;
                  scaledesc = arr2[idx].description;
                  scaledesc = {...scaledesc, [abbr]: stringParts};
                  arr2[idx].description = scaledesc;
                  arr[index].definitionScales.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                    })
                  );
                  break;
                case "category":
                  arr = form.context.contextActivitiesCategory.array;
                  arr2 = arr[index].definitionScales.array;
                  scaledesc = arr2[idx].description;
                  scaledesc = {...scaledesc, [abbr]: stringParts};
                  arr2[idx].description = scaledesc;
                  arr[index].definitionScales.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                    })
                  );
                  break;
                case "other":
                  arr = form.context.contextActivitiesOther.array;
                  arr2 = arr[index].definitionScales.array;
                  scaledesc = arr2[idx].description;
                  scaledesc = {...scaledesc, [abbr]: stringParts};
                  arr2[idx].description = scaledesc;
                  arr[index].definitionScales.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                    })
                  );
                  break;
                default:
              }
              break;

              case "context.activities.sources.id":

              switch(type){
                case "parent":
                  arr = form.context.contextActivitiesParent.array;
                  arr2 = arr[index].definitionSources.array;
                  arr2[idx].id = stringParts;
                  arr[index].definitionSources.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                    })
                  );
                  break;
                case "grouping":
                  arr = form.context.contextActivitiesGrouping.array;
                  arr2 = arr[index].definitionSources.array;
                  arr2[idx].id = stringParts;
                  arr[index].definitionSources.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                    })
                  );
                  break;
                case "category":
                  arr = form.context.contextActivitiesCategory.array;
                  arr2 = arr[index].definitionSources.array;
                  arr2[idx].id = stringParts;
                  arr[index].definitionSources.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                    })
                  );
                  break;
                case "other":
                  arr = form.context.contextActivitiesOther.array;
                  arr2 = arr[index].definitionSources.array;
                  arr2[idx].id = stringParts;
                  arr[index].definitionSources.array = arr2;
                  dispatch(
                    setForm({
                      ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                    })
                  );
                  break;
                default:
              }
              break;

              case "context.activities.sources.description":
                let sourcedesc = {};
                switch(type){
                  case "parent":
                    arr = form.context.contextActivitiesParent.array;
                    arr2 = arr[index].definitionSources.array;
                    sourcedesc = arr2[idx].description;
                    sourcedesc = {...sourcedesc, [abbr]: stringParts};
                    arr2[idx].description = sourcedesc;
                    arr[index].definitionSources.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                      })
                    );
                    break;
                  case "grouping":
                    arr = form.context.contextActivitiesGrouping.array;
                    arr2 = arr[index].definitionSources.array;
                    sourcedesc = arr2[idx].description;
                    sourcedesc = {...sourcedesc, [abbr]: stringParts};
                    arr2[idx].description = sourcedesc;
                    arr[index].definitionSources.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                      })
                    );
                    break;
                  case "category":
                    arr = form.context.contextActivitiesCategory.array;
                    arr2 = arr[index].definitionSources.array;
                    sourcedesc = arr2[idx].description;
                    sourcedesc = {...sourcedesc, [abbr]: stringParts};
                    arr2[idx].description = sourcedesc;
                    arr[index].definitionSources.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                      })
                    );
                    break;
                  case "other":
                    arr = form.context.contextActivitiesOther.array;
                    arr2 = arr[index].definitionSources.array;
                    sourcedesc = arr2[idx].description;
                    sourcedesc = {...sourcedesc, [abbr]: stringParts};
                    arr2[idx].description = sourcedesc;
                    arr[index].definitionSources.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                      })
                    );
                    break;
                  default:
                }              
                break;

                case "context.activities.targets.id":

                switch(type){
                  case "parent":
                    arr = form.context.contextActivitiesParent.array;
                    arr2 = arr[index].definitionTargets.array;
                    arr2[idx].id = stringParts;
                    arr[index].definitionTargets.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                      })
                    );
                    break;
                  case "grouping":
                    arr = form.context.contextActivitiesGrouping.array;
                    arr2 = arr[index].definitionTargets.array;
                    arr2[idx].id = stringParts;
                    arr[index].definitionTargets.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                      })
                    );
                    break;
                  case "category":
                    arr = form.context.contextActivitiesCategory.array;
                    arr2 = arr[index].definitionTargets.array;
                    arr2[idx].id = stringParts;
                    arr[index].definitionTargets.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                      })
                    );
                    break;
                  case "other":
                    arr = form.context.contextActivitiesOther.array;
                    arr2 = arr[index].definitionTargets.array;
                    arr2[idx].id = stringParts;
                    arr[index].definitionTargets.array = arr2;
                    dispatch(
                      setForm({
                        ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                      })
                    );
                    break;
                  default:
                }
                break;

                case "context.activities.targets.description":
                  let targetdesc = {};
                  switch(type){
                    case "parent":
                      arr = form.context.contextActivitiesParent.array;
                      arr2 = arr[index].definitionTargets.array;
                      targetdesc = arr2[idx].description;
                      targetdesc = {...targetdesc, [abbr]: stringParts};
                      arr2[idx].description = targetdesc;
                      arr[index].definitionTargets.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                        })
                      );
                      break;
                    case "grouping":
                      arr = form.context.contextActivitiesGrouping.array;
                      arr2 = arr[index].definitionTargets.array;
                      targetdesc = arr2[idx].description;
                      targetdesc = {...targetdesc, [abbr]: stringParts};
                      arr2[idx].description = targetdesc;
                      arr[index].definitionTargets.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                        })
                      );
                      break;
                    case "category":
                      arr = form.context.contextActivitiesCategory.array;
                      arr2 = arr[index].definitionTargets.array;
                      targetdesc = arr2[idx].description;
                      targetdesc = {...targetdesc, [abbr]: stringParts};
                      arr2[idx].description = targetdesc;
                      arr[index].definitionTargets.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                        })
                      );
                      break;
                    case "other":
                      arr = form.context.contextActivitiesOther.array;
                      arr2 = arr[index].definitionTargets.array;
                      targetdesc = arr2[idx].description;
                      targetdesc = {...targetdesc, [abbr]: stringParts};
                      arr2[idx].description = targetdesc;
                      arr[index].definitionTargets.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                        })
                      );
                      break;
                    default:
                  }                
                  break;

                  case "context.activities.steps.id":
                  switch(type){
                    case "parent":
                      arr = form.context.contextActivitiesParent.array;
                      arr2 = arr[index].definitionSteps.array;
                      arr2[idx].id = stringParts;
                      arr[index].definitionSteps.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                        })
                      );
                      break;
                    case "grouping":
                      arr = form.context.contextActivitiesGrouping.array;
                      arr2 = arr[index].definitionSteps.array;
                      arr2[idx].id = stringParts;
                      arr[index].definitionSteps.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                        })
                      );
                      break;
                    case "category":
                      arr = form.context.contextActivitiesCategory.array;
                      arr2 = arr[index].definitionSteps.array;
                      arr2[idx].id = stringParts;
                      arr[index].definitionSteps.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                        })
                      );
                      break;
                    case "other":
                      arr = form.context.contextActivitiesOther.array;
                      arr2 = arr[index].definitionSteps.array;
                      arr2[idx].id = stringParts;
                      arr[index].definitionSteps.array = arr2;
                      dispatch(
                        setForm({
                          ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                        })
                      );
                      break;
                    default:
                  }
                  break;
                  case "context.activities.steps.description":
                    let stepdesc = {};
                    switch(type){
                      case "parent":
                        arr = form.context.contextActivitiesParent.array;
                        arr2 = arr[index].definitionSteps.array;
                        stepdesc = arr2[idx].description;
                        stepdesc = {...stepdesc, [abbr]: stringParts};
                        arr2[idx].description = stepdesc;
                        arr[index].definitionSteps.array = arr2;
                        dispatch(
                          setForm({
                            ...form, context:{...form.context, contextActivitiesParent: {...form.context.contextActivitiesParent, array: arr}}
                          })
                        );
                        break;
                      case "grouping":
                        arr = form.context.contextActivitiesGrouping.array;
                        arr2 = arr[index].definitionSteps.array;
                        stepdesc = arr2[idx].description;
                        stepdesc = {...stepdesc, [abbr]: stringParts};
                        arr2[idx].description = stepdesc;
                        arr[index].definitionSteps.array = arr2;
                        dispatch(
                          setForm({
                            ...form, context:{...form.context, contextActivitiesGrouping: {...form.context.contextActivitiesGrouping, array: arr}}
                          })
                        );
                        break;
                      case "category":
                        arr = form.context.contextActivitiesCategory.array;
                        arr2 = arr[index].definitionSteps.array;
                        stepdesc = arr2[idx].description;
                        stepdesc = {...stepdesc, [abbr]: stringParts};
                        arr2[idx].description = stepdesc;
                        arr[index].definitionSteps.array = arr2;
                        dispatch(
                          setForm({
                            ...form, context:{...form.context, contextActivitiesCategory: {...form.context.contextActivitiesCategory, array: arr}}
                          })
                        );
                        break;
                      case "other":
                        arr = form.context.contextActivitiesOther.array;
                        arr2 = arr[index].definitionSteps.array;
                        stepdesc = arr2[idx].description;
                        stepdesc = {...stepdesc, [abbr]: stringParts};
                        arr2[idx].description = stepdesc;
                        arr[index].definitionSteps.array = arr2;
                        dispatch(
                          setForm({
                            ...form, context:{...form.context, contextActivitiesOther: {...form.context.contextActivitiesOther, array: arr}}
                          })
                        );
                        break;
                      default:
                    }     
                    break;
      case "result.score":
        switch (abbr) {
          case "scaled":
            dispatch(
              setForm({
                ...form,
                result: {
                  ...form.result,
                  score: {
                    ...form.result.score,
                    scaled: { selected: true, stringParts: stringParts },
                  },
                },
              })
            );
            break;
          case "raw":
            dispatch(
              setForm({
                ...form,
                result: {
                  ...form.result,
                  score: {
                    ...form.result.score,
                    raw: { selected: true, stringParts: stringParts },
                  },
                },
              })
            );
            break;
          case "min":
            dispatch(
              setForm({
                ...form,
                result: {
                  ...form.result,
                  score: {
                    ...form.result.score,
                    min: { selected: true, stringParts: stringParts },
                  },
                },
              })
            );
            break;
          case "max":
            dispatch(
              setForm({
                ...form,
                result: {
                  ...form.result,
                  score: {
                    ...form.result.score,
                    max: { selected: true, stringParts: stringParts },
                  },
                },
              })
            );
            break;
          default:
        }
        break;
      case "result.success":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              success: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "result.completion":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              completion: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "result.response":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              response: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "result.duration":
        dispatch(
          setForm({
            ...form,
            result: {
              ...form.result,
              duration: { selected: true, stringParts: stringParts },
            },
          })
        );
        break;
      case "timestamp":
        dispatch(
          setForm({
            ...form,
            timestamp: { selected: true, stringParts: stringParts },
          })
        );
        break;

////ATTACHMENTS//////////////////////////////////////////////////////////////////////
case "attachments.usageType":
  arr = form.attachments.array;
  arr[index].usageType = { selected: true, stringParts: stringParts };
  dispatch(
    setForm({
      ...form,
      attachments: {
        selected: true, array: arr
      },
    })
  );
  break;
  case "attachments.display":

  arr = form.attachments.array;
  arr[index].display = {
    selected: true,
    languages: {
      ...form.attachments.array[index].display.languages,
      [abbr]: stringParts,
    },
  };
  dispatch(
    setForm({
      ...form,
      attachments: {
        selected: true, array: arr
      },
    })
  );
    break;
    case "attachments.description":
      arr = form.attachments.array;
      arr[index].display = {
        selected: true,
        languages: {
          ...form.attachments.array[index].description.languages,
          [abbr]: stringParts,
        },
      };
      dispatch(
        setForm({
          ...form,
          attachments: {
            selected: true, array: arr
          },
        })
      );
      break;
    case "attachments.contentType":
      arr = form.attachments.array;
      arr[index].contentType = { selected: true, stringParts: stringParts };
      dispatch(
        setForm({
          ...form,
          attachments: {
            selected: true, array: arr
          },
        })
      );
      break;
      case "attachments.length":
        arr = form.attachments.array;
        arr[index].length = { selected: true, stringParts: stringParts };
        dispatch(
          setForm({
            ...form,
            attachments: {
              selected: true, array: arr
            },
          })
        );
  break;
  case "attachments.sha2":
    arr = form.attachments.array;
    arr[index].sha2 = { selected: true, stringParts: stringParts };
    dispatch(
      setForm({
        ...form,
        attachments: {
          selected: true, array: arr
        },
      })
    );
  break;
  case "attachments.fileUrl":
    arr = form.attachments.array;
    arr[index].fileUrl = { selected: true, stringParts: stringParts };
    dispatch(
      setForm({
        ...form,
        attachments: {
          selected: true, array: arr
        },
      })
    );
  break;
      default: //should be used for extension data...?

    }

  };

  return (
    <>
      <Paper sx={{ overflowX: "auto", height: 150 }}>
        <Grid>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
            {props.abbr ? props.name + "." + props.abbr : (props.idx==undefined ? "" : props.idx) + " " + props.name }{" "}
            <Tooltip
                    title={desc}
                    arrow
                    placement="right-start"
                  >
                    <IconButton size="small">
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
          </Typography>
         
        </Grid>
        <Grid sx={{ pb: 2 }}>
          {stringParts.map((part, index) => {
            const { type, str } = part;
            console.log(str);
            if (type == "CSV") {
              return (
                <>
                  {/* <CSVDropdown onChange={(event) => {handleSetValue(event.target.value, index);}}/> */}

                  <FormControl sx={{ width: 200, pl: 3, pt: 1 }} size="small">
                    <InputLabel sx={{ width: 200, pl: 4, pt: 1 }} size="small">
                      Select Column
                    </InputLabel>
                    <Select
                      open={openColumnDefs}
                      label="Select Column"
                      value={str} //column.selectedColumn
                      //display={value}
                      onClose={() =>
                        setOpenColumnDefs((prevState) => !prevState)
                      }
                      onOpen={() =>
                        setOpenColumnDefs((prevState) => !prevState)
                      }
                      onChange={(event) => {
                        handleSetValue(event.target.value, index);
                        //handleSetValue(event.target.value, index);
                        //setColumn(event.target.value);
                      }}
                    >
                      {columnDefs.map((col, index) => {
                        if (
                          col.headerName !== "id" &&
                          col.headerName !== "JSON" &&
                          col.headerName !== ""
                        ) {
                          return (
                            <MenuItem key={index} value={col.headerName}>
                              {col.headerName}
                            </MenuItem>
                          );
                        }
                      })}
                    </Select>
                  </FormControl>

                  <ClearIcon
                    fontSize="small"
                    onClick={() => handleDeletePart(index)}
                  />
                </>
              );
            } else if (type == "TXT") {
              return (
                <>
                  <FormControl sx={{ width: 200, pl: 3, pt: 1 }} size="small">
                    <>
                      <TextField
                        sx={{ height: 2 }}
                        onChange={(event) => {
                          handleSetValue(event.target.value, index);
                          //handleSetValue(event.target.value, index);
                        }}
                      />
                    </>
                  </FormControl>
                  <ClearIcon
                    fontSize="small"
                    onClick={() => handleDeletePart(index)}
                  />
                </>
              );
            }
          })}

          <Button
            id="add"
            startIcon={<AddIcon />}
            onClick={(event) => setOpenMenu(event.currentTarget)}
          />
          <Menu
            open={Boolean(openMenu)}
            anchorEl={openMenu}
            onClose={() => setOpenMenu(null)}
          >
            <MenuItem onClick={handleCSVColumn} component="div">
              <Typography>CSV Column</Typography>
            </MenuItem>

            <MenuItem onClick={handleTXTField}>
              <Typography>Free Text</Typography>
            </MenuItem>
          </Menu>
        </Grid>
      </Paper>
    </>
  );
};

export default Property;
