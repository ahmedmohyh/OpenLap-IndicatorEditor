import React from "react";
import { Grid, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { camelCase } from "../../../../utils/assets/functions/functions";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";

const menuStyle = {
  borderStyleMiddle: { "& fieldset": { borderRadius: 0 } },
  borderStylePrimary: { "& fieldset": { borderRadius: 0 } },
  customWidth: { maxWidth: "none" }
};

export default function MenuDropDown(props) {
  const {
    displayLabel,     // The label of the dropdown menu
    showType,         // Show the type of the label
    parameterName,    // The name of the state variable in strings
    source,           // List of menu items
    value,            // The value that will be shown in the TextBox after selecting from MenuList
    handleSelection,  // Function that selects a menu item and store in the state
    middle,           // If the dropdown is in the middle of two other dropdowns around in the container (Possible values: true/false)
    single,           // If its the only dropdown in the container (Possible values: true/false)
    selectOne,        // If the dropdown should lock the user to select more (Possible values: true/false)
    chips,            // (if selectOne is true) Helper object for locking down selection
    tooltipMessage,   // (if selectOne is true) If locked selected, show a tooltip message
    showRequired,     // shows the required indicator
    boxType
  } = props;

  function convert(name) {
    if (name === 'item_count'){
      return 'Counting Value'
    }
    return name
  }

  return (
    <>
      <Grid item xs>
        <Tooltip
          placement="bottom"
          classes={{ tooltip: menuStyle.customWidth }}
          title={selectOne ?
            (chips.length !== 0 ? (
              <Grid container direction="row" justify="center">
                <Grid item xs={1} style={{ marginRight: 8, marginTop: 8 }}>
                  <IconButton> <HelpIcon /> </IconButton>
                </Grid>
                <Grid item xs={10}>{tooltipMessage}</Grid>
              </Grid>
            ) : "") : source.length === 0 ? (
              <Grid container direction="row" alignItems="center" justify="center">
                <Grid item xs={1} style={{ marginRight: 8 }}>
                  <IconButton> <HelpIcon /> </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="body2" style={{ marginLeft: "8px" }}> No more options! </Typography>
                </Grid>
              </Grid>
            ) : ""}>
          <TextField
            select={selectOne ? (chips.length === 0) : source.length !== 0}
            fullWidth
            label={value === "" ? displayLabel : ""}
            value={value || ""}
            variant={boxType ? boxType : "outlined"}
            InputLabelProps={{ shrink: false }}
            style={middle ? menuStyle.borderStyleMiddle : !single ? menuStyle.borderStylePrimary : {}}
          >
            {source.map((item, index) => {
              let description = item.description ? item.description : "";
              return (
                <MenuItem key={index} value={item.displayName ? item.displayName : item.title ? item.title : item.name ? item.name : item}
                          onClick={() => handleSelection(camelCase(parameterName), item)}>
                  {description ? (
                    <Tooltip
                      placement="right-start"
                      title={<>
                        <Typography gutterBottom>{description}</Typography>
                        {showType ? <Typography >Type: <b>{item.type}</b></Typography> : <></>}
                      </>}>
                      <Box> {item.displayName ? item.displayName : item.title ? item.title : item.name ? convert(item.name) : item} {showRequired ? (item.required ? <></> : "(optional)") : <></>}</Box>
                    </Tooltip>
                  ) : (
                    <Box> {item.displayName ? item.displayName : item.title ? item.title : item.name ? convert(item.name) : item} </Box>
                  )}
                </MenuItem>
              );
            })}
          </TextField>
        </Tooltip>
      </Grid>
    </>
  );
}

