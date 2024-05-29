import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectDeselectAnalysisMethodMapML, setIndRefParams } from "../../../../../../utils/redux/reducers/multiLevelEditor";
import MenuSingleSelect from '../../../../Common/MenuSingleSelect/MenuSingleSelect';
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';
import { useSnackbar } from '../../../BasicIndicator/context/SnackbarContext';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function AnalysisMappingChoices(props) {
  const {
    analysisInput,
    selectedMappingAnalysisInputAttributesData,
    activityAttributesData
  } = props;

  const dataSource = activityAttributesData.filter(a => a.type === analysisInput.type);
  const [value, setValue] = useState(null);

  // Local constants
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const indRefParams = useSelector((state) => state.multiLevelEditorReducer.selectedData.indRefParams);

  const handleChooseSelection = (label, value) => {
    setValue(value);
    let _index = /\d+/g.exec(analysisInput.id);
    let _indRefParams = indRefParams
    if (_indRefParams.length === 0) {
      _indRefParams.push({})
      _indRefParams[0][`indRefField${_index}`] = value.id

    } else {
      _indRefParams[0][`indRefField${_index}`] = value.id
    }

    showSnackbar(`Your selection for ${analysisInput.title} has been saved.`);
    dispatch(setIndRefParams(_indRefParams));
    dispatch(selectDeselectAnalysisMethodMapML([{input: analysisInput, output: value}]));
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
