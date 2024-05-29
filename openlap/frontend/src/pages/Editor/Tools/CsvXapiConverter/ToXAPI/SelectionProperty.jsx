import React, { useState, useEffect } from "react";

import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Property from "./Property";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "../../../../../utils/redux/reducers/csvxapiReducer";

const SelectionProperty = (props, onSelected) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.csvxapiReducer.form);

  const [openMenu, setOpenMenu] = useState(null);
  const [stringParts, setStringParts] = useState(["CSV"]);

  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );
  const [openColumnDefs, setOpenColumnDefs] = useState(false);
  const [column, setColumn] = useState({
    columnName: "",
    selectedColumn: "",
    editColumn: false,
  });

  const { name, selections, index, type } = props;

  const [value, setValue] = useState("");

  useEffect(() => {
    if(value!==""){
      handleSetValue();
    }else{
      //alert("test");
      // handleSetFalse();
    }
  }, [value]);

  const handleSetValue = () => {
    let arr =[];
    switch (name) {
      case "actor.objectType":
          dispatch(setForm({
            ...form, actor: {...form.actor, objecttype: {selected: true, value: value}}
          }));
        break;
        case "instructor.objectType":
          dispatch(setForm({
            ...form, context: {...form.context, instructor: {...form.context.instructor, objecttype: {selected: true, value: value}}}
          }));
        break;
      case "object.definition.interactionType":
          dispatch(setForm({
            ...form,
            object: {...form.object, definitionInteractiontype: { selected: true, value: value }},
          }));
          dispatch(setForm({
            ...form,
            object: {...form.object, definitionCorrectresponses: { selected: false, array: [] }},
          }));
        break;        
      case "context.activities.object.definition.interactionType":
        switch(type){
          case "parent":
            arr = form.context.contextActivitiesParent.array;
            arr[index].definitionInteractiontype = { selected: true, value: value }
            arr[index].definitionCorrectresponses = {selected: false, array: []};
            dispatch(setForm({
                ...form,
                context: {...form.context, contextActivitiesParent: { selected: true, array: arr }},
              }));
            break;
          case "grouping":
            arr = form.context.contextActivitiesGrouping.array;
            arr[index].definitionInteractiontype = { selected: true, value: value }
            arr[index].definitionCorrectresponses = {selected: false, array: []};
              dispatch(setForm({
                ...form,
                context: {...form.context, contextActivitiesGrouping: { selected: true, array: arr }},
              }));
            break;
          case "category":
            arr = form.context.contextActivitiesCategory.array;
            arr[index].definitionInteractiontype = { selected: true, value: value }
            arr[index].definitionCorrectresponses = {selected: false, array: []};
              dispatch(setForm({
                ...form,
                context: {...form.context, contextActivitiesCategory: { selected: true, array: arr }},
              }));
            break;
          case "other":
            arr = form.context.contextActivitiesOther.array;
            arr[index].definitionInteractiontype = { selected: true, value: value }
            arr[index].definitionCorrectresponses = {selected: false, array: []};
              dispatch(setForm({
                ...form,
                context: {...form.context, contextActivitiesOther: { selected: true, array: arr }},
              }));
            break;
          default:
        }
        break;
      default:
      // code block
    }
  };

  // const handleSetFalse = () => {
  //   let arr = [];
  //   switch (name) {
  //     case "actor.objectType":
  //         dispatch(setForm({
  //           ...form, actor: {...form.actor, objecttype: { selected: false, value: "" }}
  //         }));
  //       break;
  //       case "instructor.objectType":
  //         dispatch(setForm({
  //           ...form, 
  //           context: {...form.context, 
  //               instructor: {...form.context.instructor, objecttype: { selected: false, value: "" }}}
  //         }));
  //       break;
  //     case "object.definition.interactionType":
  //         dispatch(setForm({
  //           ...form, object: {...form.object, definitionInteractiontype: { selected: false, value: "" }}
  //         }));
  //         dispatch(setForm({
  //           ...form, object: {...form.object, definitionCorrectresponses: { selected: false, array: [] }}
  //         }));
  //       break;
  //       case "context.activities.object.definition.interactionType":
  //         switch(type){
  //           case "parent":
  //             arr = form.context.contextActivitiesParent.array;
  //             arr[index].definitionInteractiontype = { selected: false, value: "" };
  //             arr[index].definitionCorrectresponses = {selected: false, array: []};
  //             dispatch(setForm({
  //                 ...form,
  //                 context: {...form.context, contextActivitiesParent: { selected: true, array: arr }},
  //               }));
  //             break;
  //           case "grouping":
  //             arr = form.context.contextActivitiesGrouping.array;
  //             arr[index].definitionInteractiontype = { selected: false, value: "" }
  //             arr[index].definitionCorrectresponses = {selected: false, array: []};
  //             dispatch(setForm({
  //                 ...form,
  //                 context: {...form.context, contextActivitiesGrouping: { selected: true, array: arr }},
  //               }));
  //             break;
  //           case "category":
  //             arr = form.context.contextActivitiesCategory.array;
  //             arr[index].definitionInteractiontype = { selected: false, value: "" }
  //             arr[index].definitionCorrectresponses = {selected: false, array: []};
  //             dispatch(setForm({
  //                 ...form,
  //                 context: {...form.context, contextActivitiesCategory: { selected: true, array: arr }},
  //               }));
  //             break;
  //           case "other":
  //             arr = form.context.contextActivitiesOther.array;
  //             arr[index].definitionInteractiontype = { selected: false, value: "" }
  //             arr[index].definitionCorrectresponses = {selected: false, array: []};
  //             dispatch(setForm({
  //                 ...form,
  //                 context: {...form.context, contextActivitiesOther: { selected: true, array: arr }},
  //               }));
  //             break;
  //           default:
  //         }
  //     default:
  //   }
  // };


  const handleChange = (val) => {
      setValue(val);
      //handleSetValue();
  };

  return (
    <>
      <Paper sx={{ overflowX: "auto" }}>
        <Grid>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>{name} </Typography>
        </Grid>
        <Grid sx={{ pb: 2 }}>
          <FormControl sx={{ width: 200, pl: 3 }} size="small">
            <InputLabel sx={{ pl: 3 }}>Select Type</InputLabel>
            <Select
              label="Select Type"
              value={value}
              onChange={(event) => handleChange(event.target.value)}
            >
              {selections.map(([option, index]) => {
                return (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Paper>
    </>
  );
};

export default SelectionProperty;
