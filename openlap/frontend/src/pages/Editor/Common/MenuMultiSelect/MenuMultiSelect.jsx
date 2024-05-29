import React, { useEffect, useRef, useState } from "react";
import { Alert, TextField, styled } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';

const HelperAlert = styled(Alert)(({ }) => ({
  margin: '0 -14px',
  padding: '0 12px',
  fontSize: '12px',
  "& .MuiAlert-icon": {
    fontSize: 16,
  },
  "& .MuiAlert-message": {
    whiteSpace: 'normal'
  }
}));

/**
 * MenuMultiSelect component for rendering a multi-selection menu using Material-UI Autocomplete.
 * If the datasource has only a single value -> this value is auto selected as default value and a
 * 'success' alert is shown in the helper text area with pre-selection information.
 *
 * @component
 * @param {Object} props - The properties of the component.
 * @param {string} props.name - The name of the menu for placeholder text.
 * @param {Array<Object>} props.dataSource - The array of data objects for menu options.
 * @param {Array<Object>} props.itemName - The selected items' names.
 * @param {Function} props.handleChange - The callback function for handling selection changes.
 * @param {Function} props.selectAll - The callback function for selecting all options.
 * @param {JSX.Element} props.customHelper - Custom helper text to be displayed.
 * @returns {JSX.Element} The rendered MenuMultiSelect component.
 *
 * @example
 * // Example usage of MenuMultiSelect component
 * <MenuMultiSelect
 *   name="Categories"
 *   dataSource={[{ name: 'Category 1' }, { name: 'Category 2' }, { name: 'Category 3' }]}
 *   itemName={['Category 1']}
 *   handleChange={(event, newValue) => console.log(newValue)}
 *   selectAll={() => console.log('Select All clicked')}
 *   customHelper={<span>Custom helper text</span>}
 * />
 *
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
export default function MenuMultiSelect({ name, dataSource, itemName, handleChange, selectAll, customHelper }) {
  const hasSingleOption = dataSource.length === 1;
  const defaultValue = hasSingleOption ? dataSource : null;
  const selectAllItem = { name: "Select all" };

  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [disableSelectAll, setDisableSelectAll] = useState(false);
  // The "Select All" item is added to the select options.
  const [source, setSource] = useState((dataSource.length > 0 ? [selectAllItem, ...dataSource] : dataSource));
  const timer = useRef(-1);

  const handleOpenClose = (isOpen) => {
    setOpen(isOpen);
  };

  /**
   * Function to handle the "Select All" click event.
   * @function
   * @inner
   * @returns {void}
   */
  const addAllClick = () => {
    clearTimeout(timer.current);
    selectAll();
    handleOpenClose(!open);
  };

  const handleSelectChange = (e, v) => {
    // Check if user made "Select All" selection
    if (v[0]?.name === selectAllItem.name) {
      addAllClick();
    } else {
      handleChange(e, v);
    }
  }

  useEffect(() => {
    // Disable "Select All" option if is selected
    const allSelected = itemName.length >= 1;
    setDisableSelectAll(allSelected);
  }, [itemName, dataSource]);

  useEffect(() => {
    if (hasSingleOption && defaultValue) {
      setIsDisabled(true);
      handleChange(null, defaultValue);
    }
  }, []);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={source}
      onChange={handleSelectChange}
      disabled={isDisabled}
      defaultValue={itemName}
      value={itemName}
      getOptionDisabled={(option) =>
        disableSelectAll ? option.name === selectAllItem.name : null
      }
      getOptionLabel={(option) => option.name}
      onOpen={() => handleOpenClose(!open)}
      onClose={() => handleOpenClose(!open)}
      open={open}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={`Select ${name}...`}
          helperText={
            customHelper ? customHelper : (hasSingleOption && itemName === defaultValue) ?
              (<HelperAlert severity="success">We've pre-selected the {name} with the only available option.</HelperAlert>)
              : null
          }
        />
      )}
    />
  );
}
