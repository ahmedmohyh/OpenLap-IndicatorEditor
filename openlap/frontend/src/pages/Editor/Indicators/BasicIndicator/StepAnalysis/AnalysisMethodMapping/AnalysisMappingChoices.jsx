import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { selectDeselectAnalysisMethodMap } from "../../../../../../utils/redux/reducers/indicatorEditor";
import MenuSingleSelect from '../../../../Common/MenuSingleSelect/MenuSingleSelect';
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';
import { useSnackbar } from '../../context/SnackbarContext';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function AnalysisMappingChoices(props) {
  const { analysisInput, selectedMappingAnalysisInputAttributesData, activityAttributesData } = props;
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const inputAttributeDataPosIndex = selectedMappingAnalysisInputAttributesData.findIndex(entry => entry.inputPort.title === analysisInput.title); // The array index of the current input data. If -1 value has not yet been selected.
  const dataSource = activityAttributesData.filter(a => a.type === analysisInput.type);
  const [value, setValue] = useState((inputAttributeDataPosIndex !== -1 && selectedMappingAnalysisInputAttributesData[inputAttributeDataPosIndex].outputPort != null) ? selectedMappingAnalysisInputAttributesData[inputAttributeDataPosIndex].outputPort.name : null);

  const handleChooseSelection = (label, value) => {
    setValue(value);    
    showSnackbar(`Your selection for ${analysisInput.title} has been saved.`);
    dispatch(selectDeselectAnalysisMethodMap([{input: analysisInput, output: value}]));
  };

  return (
    <>
      <SelectContainer
        name={analysisInput.title}
        isMandatory={analysisInput.required}
        allowsMultipleSelections={false}
        helper={'test'}
      >
        <MenuSingleSelect
          name={analysisInput.title}
          dataSource={dataSource}
          itemName={value}
          handleChange={handleChooseSelection}
        />
      </SelectContainer>
    </>
  );
}
