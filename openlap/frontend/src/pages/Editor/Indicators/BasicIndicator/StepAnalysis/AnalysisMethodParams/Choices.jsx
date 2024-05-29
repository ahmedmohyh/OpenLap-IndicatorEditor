import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import MenuDropDown from "../../../../Common/MenuDropDown/MenuDropDown";
import { useDispatch } from "react-redux";
import { selectDeselectAnalysisMethodParams } from "../../../../../../utils/redux/reducers/indicatorEditor";
import HelpTooltip from '../../../../Common/HelpTooltip/HelpTooltip';
import { useSnackbar } from '../../context/SnackbarContext';

export default function Choices(props) {
  const { paramData, selectedAnalyticsMethodParams } = props;

  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const [selection, setSelection] = useState({ choiceInput: paramData.value ? paramData.value : "", });

  const handleChooseSelection = (label, value) => {
    setSelection({
      ...selection,
      [label]: value,
    })
    let newSelectedAnalyticsMethodParams = selectedAnalyticsMethodParams;
    newSelectedAnalyticsMethodParams.forEach(param => {
      if (param.id === paramData.id) {
        param.value = value;
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
              <MenuDropDown
                displayLabel={paramData.type}
                showType={true}
                parameterName={"choiceInput"}
                boxType={"outlined"}
                source={paramData.possibleValues}
                value={selection.choiceInput}
                handleSelection={handleChooseSelection}
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
