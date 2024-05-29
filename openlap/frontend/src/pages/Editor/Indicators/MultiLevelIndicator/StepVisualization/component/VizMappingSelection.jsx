import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { selectDeselectVisMapping } from "../../../../../../utils/redux/reducers/indicatorEditor";
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';
import { useSnackbar } from '../../../BasicIndicator/context/SnackbarContext';
import MenuSingleSelect from '../../../../Common/MenuSingleSelect/MenuSingleSelect';

export default function VizMappingSelection(props) {
  const { vizDataInput, selectedVisualizationMapping, analysisMethodOutputsData } = props;
  // Local constants
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const dataSource = analysisMethodOutputsData.filter(a => a.type === vizDataInput.type);
  const [value, setValue] = useState(null);

  const handleChangeSelection = (label, value) => {
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
        helper={vizDataInput.description} // [todo] add helper text in backend.
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
