import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { selectDeselectVisMapping } from "../../../../../../utils/redux/reducers/indicatorEditor";
import MenuSingleSelect from '../../../../Common/MenuSingleSelect/MenuSingleSelect';
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';
import { useSnackbar } from '../../../BasicIndicator/context/SnackbarContext';

/**
 * @bug This mapping selections has a known issue where the first pre-selected value
 * is not set as actual value -> no viz preview generation possible. Solution: Manual
 * set the value again. To be fixed.
 * 
 * @author Louis Born <louis.born@stud.uni-due.de> 
 */
export default function VizMappingSelection(props) {
  const { vizDataInput, selectedVisualizationMapping, analysisMethodOutputsData } = props;

  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const dataSource = analysisMethodOutputsData.filter(a => a.type === vizDataInput.type);
  const [value, setValue] = useState(null);

  const handleChangeSelection = (event, value) => {
    setValue(value.title);
    showSnackbar(`Your selection for ${vizDataInput.title} has been saved.`);
    dispatch(selectDeselectVisMapping([{input: vizDataInput, output: value}]));
  };

  return (
    <>
      <SelectContainer
        name={vizDataInput.title}
        isMandatory={vizDataInput.required}
        allowsMultipleSelections={false}
        helper={'Apologies, but there are currently no available assistants at the moment. We are actively working to add more helpers'} // [todo] add helper text in backend.
      >
        <MenuSingleSelect
          name={vizDataInput.title}
          dataSource={dataSource}
          itemName={value}
          handleChange={handleChangeSelection}
        />
      </SelectContainer>
    </>
  );
}
