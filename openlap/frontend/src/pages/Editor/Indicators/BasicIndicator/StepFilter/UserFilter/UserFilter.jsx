import React, { useEffect, useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';
import { users } from "../filterData";

/**
 * UserFilter Component for filtering users using radio buttons.
 * @param {Object} props - React props
 * @param {string} props.name - The name of the user filter.
 * @param {boolean} props.isMandatory - Whether the user filter is mandatory.
 * @param {boolean} props.allowsMultipleSelections - Whether multiple selections are allowed.
 * @param {string} props.helper - Helper text for the user filter.
 * @returns {JSX.Element} - React component
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
export default function UserFilter(props) {
  const { name, isMandatory, allowsMultipleSelections, helper, handleChange } = props;
  const defaultValue = 0;
  const [user, setUser] = useState([users[0]]);
  const [value, setValue] = useState(defaultValue);

  /**
   * Handler for radio button change.
   * @param {Object} event - The event object.
   */
  const handleRadioChange = (event) => {
    const value = event.target.value;
    setValue(value);
    setUser([users[value]]);
  };

  useEffect(() => {
    handleChange(user);
  }, user);

  return (
    <>
      <SelectContainer
        name={name}
        isMandatory={isMandatory}
        allowsMultipleSelections={allowsMultipleSelections}
        helper={helper}
      >
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={defaultValue}
            value={value}
            onChange={handleRadioChange}
          >
            {users.map(((u, index) => (
              <FormControlLabel key={u.name} value={index} control={<Radio />} label={u.name} />
            )))}
          </RadioGroup>
        </FormControl>
      </SelectContainer>
    </>
  )
}
