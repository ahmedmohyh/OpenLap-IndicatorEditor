import React from 'react';
import Grid from "@mui/material/Grid";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { selectDeselectAnalysisMethodParamsML } from "../../../../../../utils/redux/reducers/multiLevelEditor";
import { useDispatch } from "react-redux";
import HelpTooltip from '../../../../Common/HelpTooltip/HelpTooltip';
import { useSnackbar } from '../../../BasicIndicator/context/SnackbarContext';

export default function CheckBox(props) {
  // Props
  const { selectedAnalyticsMethodParams, paramData } = props;

  // Local Constants
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const [value, setValue] = React.useState('false');

  const handleChange = (event) => {
    showSnackbar(`Your selection for ${paramData.title} has been saved.`);
    setValue(event.target.value);
    let newSelectedAnalyticsMethodParams = selectedAnalyticsMethodParams;
    newSelectedAnalyticsMethodParams.forEach(param => {
      if (param.id === paramData.id) {
        param.value = event.target.value;
      }
    })
    dispatch(selectDeselectAnalysisMethodParamsML(newSelectedAnalyticsMethodParams));
  };

  return (
    <>
      <div>
        <Grid container xs={12} sx={{ margin: '16px 0' }}>
          <Grid item xs={12}>
            <div style={{ fontSize: '12px', color: '#5F6368', marginBottom: '12px' }}>
              (Optional) Select <strong>{paramData.title}</strong>:
            </div>
          </Grid>
          <Grid item container xs={12} spacing={3} direction="row" alignItems="center">
            <Grid item xs={10}>
              <FormControl component="fieldset">
                <RadioGroup value={value} onChange={handleChange}>
                  <FormControlLabel value="" control={<Radio color={"primary"} />} label="True" />
                  <FormControlLabel value="false" control={<Radio color={"primary"} />} label="False" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <HelpTooltip message={paramData.description}></HelpTooltip>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
