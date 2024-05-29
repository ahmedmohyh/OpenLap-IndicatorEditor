import React, { useEffect, useState } from "react";
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
 * MenuSingleSelect component for rendering a single-selection menu using Material-UI Autocomplete.
 * If the datasource has only a single value -> this value is auto selected as default value and a
 * 'success' alert is shown in the helper text area with pre-selection information.
 *
 * @component
 * @param {Object} props - The properties of the component.
 * @param {string} props.name - The name of the menu for placeholder text.
 * @param {Array<Object>} props.dataSource - The array of data objects for menu options.
 * @param {string} props.itemName - The selected item's name.
 * @param {Function} props.handleChange - The callback function for handling selection changes.
 * @returns {JSX.Element} The rendered MenuSingleSelect component.
 *
 * @example
 * // Example usage of MenuSingleSelect component
 * <MenuSingleSelect
 *   name="Category"
 *   dataSource={[{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]}
 *   itemName="Option 1"
 *   handleChange={(event, newValue) => console.log(newValue)}
 * />
 *
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
export default function MenuSingleSelect({ name, dataSource, itemName, handleChange }) {
    const hasSingleOption = dataSource.length === 1;
    const defaultValue = hasSingleOption ? dataSource[0] : null;

    const [isDisabled, setIsDisabled] = useState(false); // Can be added, that when hasSingleOption then disable menu select.

    const getOptionLabel = (option) => {
        let optionLabel = option;
        if (option.hasOwnProperty('name')) {
            optionLabel = option.name;
        }

        if (option.hasOwnProperty('title')) {
            optionLabel = option.title;
        }

        if (optionLabel === 'item_count') {
            optionLabel = 'Counting Value';
        }

        return optionLabel;
    }

    /**
     * useEffect to handle automatic selection of the only available option.
     * @function
     * @inner
     * @param {void} effect
     * @returns {void}
     */
    useEffect(() => {
        if (hasSingleOption) {
            setIsDisabled(true);
            handleChange(null, defaultValue);
        }
    }, []);

    return (
        <Autocomplete
            options={dataSource}
            onChange={handleChange}
            disabled={false} // add isDisabled here to control the state.
            value={itemName || defaultValue}
            getOptionLabel={(option) => getOptionLabel(option)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder={`Select ${name}...`}
                    helperText={
                        (hasSingleOption && (itemName === defaultValue || itemName === defaultValue.title)) ?
                            (<HelperAlert severity="success">We've pre-selected the {name} with the only available option.</HelperAlert>)
                            : null
                    }
                />
            )}
        />
    );
}
