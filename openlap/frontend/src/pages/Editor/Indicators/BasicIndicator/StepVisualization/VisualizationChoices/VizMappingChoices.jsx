import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { selectDeselectVisMapping } from "../../../../../../utils/redux/reducers/indicatorEditor";
import MenuSingleSelect from '../../../../Common/MenuSingleSelect/MenuSingleSelect';
import SelectContainer from '../../../../Common/SelectContainer/SelectContainer';
import { useSnackbar } from '../../context/SnackbarContext';

export default function VizMappingChoices(props) {
  const { vizDataInput, selectedVisualizationMapping, analysisMethodOutputsData } = props;

  const dataSource = analysisMethodOutputsData.filter(a => a.type === vizDataInput.type);
  const [value, setValue] = useState(null);

  // Local constants
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const handleChooseSelection = (label, value) => {
    setValue((value === null) ? value : value.title);
    
    if (dataSource.length > 1) {
        // Do not show snackbar when pre-select with only single option.
        showSnackbar(`Your selection for ${vizDataInput.title} has been saved.`);
    }

    dispatch(selectDeselectVisMapping([{input: vizDataInput, output: value}]));
  };

  return (
    <>
      <SelectContainer
        name={vizDataInput.title}
        isMandatory={vizDataInput.required}
        allowsMultipleSelections={false}
        helper={'test'}
      >
        <MenuSingleSelect
          name={vizDataInput.title}
          dataSource={dataSource}
          itemName={value}
          handleChange={handleChooseSelection}
        />
      </SelectContainer>
    </>
  );
}
