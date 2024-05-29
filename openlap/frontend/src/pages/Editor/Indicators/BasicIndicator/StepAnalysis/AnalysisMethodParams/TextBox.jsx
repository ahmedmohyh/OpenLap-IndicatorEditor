import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import { selectDeselectAnalysisMethodParams } from "../../../../../../utils/redux/reducers/indicatorEditor";
import { useDispatch } from "react-redux";
import HelpTooltip from '../../../../Common/HelpTooltip/HelpTooltip';
import { useSnackbar } from '../../context/SnackbarContext';

export default function TextBox(props) {
  const { selectedAnalyticsMethodParams, paramData } = props;

  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const [selection, setSelection] = useState({ textInput: paramData.value ? paramData.value : "", });

  const handleTextInput = (e) => {
    setSelection({
      ...selection,
      textInput: e.target.value,
    });
    let newSelectedAnalyticsMethodParams = selectedAnalyticsMethodParams;
    newSelectedAnalyticsMethodParams.forEach(param => {
      if (param.id === paramData.id) {
        param.value = e.target.value;
      }
    })
    dispatch(selectDeselectAnalysisMethodParams(newSelectedAnalyticsMethodParams));
    showSnackbar(`Your selection for ${paramData.title} has been saved.`);
  };

  return (
    <>
      <div>
        <Grid container sx={{ margin: '16px 0' }}>
          <Grid item xs={12}>
            <div style={{ fontSize: '12px', color: '#5F6368', marginBottom: '12px' }}>
              (Optional) Select <strong>{paramData.title}</strong>:
            </div>
          </Grid>
          <Grid item container xs={12} spacing={3} direction="row" alignItems="center">
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={selection.textInput}
                type={paramData.dataType === "INTEGER" ? "number" : "string"}
                onChange={handleTextInput}
              />
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
