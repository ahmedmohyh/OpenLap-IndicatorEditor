import React, { useEffect, useState } from 'react';
import { Grid } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function TimeFilter(props) {
  const { name, isMandatory, allowsMultipleSelections, helper, timeDurationData, handleChange } = props;
  //const today = new Date();
  const [endDate, setEndDate] = useState(timeDurationData.endDate);
  const [startDate, setStartDate] = useState(timeDurationData.startDate);

  const handleStartDate = (date) => {
    setStartDate(date.$d);
  };

  const handleEndDate = (date) => {
    setEndDate(date.$d);
  };

  useEffect(() => {
    handleChange(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <SelectContainer
      name={name}
      isMandatory={isMandatory}
      allowsMultipleSelections={allowsMultipleSelections}
      helper={helper}
    >
      <Grid container alignItems="center" sx={{ mb: 2 }}  >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs>
            <DatePicker
              value={startDate}
              onChange={handleStartDate}
              format="DD/MM/YYYY"  
            />
            <span style={{ fontSize: '12px', padding: '0 16px'}}>Start Date</span>
          </Grid>
          <span style={{ margin: '0 8px' }}>-</span>
          <Grid item xs>
            <DatePicker
              value={endDate}
              onChange={handleEndDate}
              format="DD/MM/YYYY"
            />
            <span style={{ fontSize: '12px', padding: '0 16px'}}>End Date</span>
          </Grid>
        </LocalizationProvider>
      </Grid>
    </SelectContainer>
  )
}
