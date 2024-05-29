import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFilterData,
  selectDeselectActivityName,
  setAllFilterData,
  setTimeDuration,
  setUsers
} from "../../../../../utils/redux/reducers/indicatorEditor";
import TimeFilter from "./TimeFilter/TimeFilter";
import UserFilter from "./UserFilter/UserFilter";
import MenuMultiSelect from "../../../Common/MenuMultiSelect/MenuMultiSelect";
import config from "./config";
import ConditionalSelectionRender from "../../../Common/ConditionalSelectionRender/ConditionalSelectionRender";
import SelectContainer from "../../../Common/SelectContainer/SelectContainer";
import SelectHelperAlert from "../../../Common/SelectHelperAlert/SelectHelperAlert";
import SelectionAccordion from '../../../Common/Accordion/Accordion';
import { useSnackbar } from "../context/SnackbarContext";
import dayjs from "dayjs";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function StepFilter(props) {
  const { onStepComplete, onStepIncomplete } = props;

  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const activityNameData = useSelector(state => state.indicatorEditorReducer.fetchedData.activityName);
  const selectedPlatform = useSelector(state => state.indicatorEditorReducer.selectedData.platforms);
  const selectedActivityTypes = useSelector(state => state.indicatorEditorReducer.selectedData.activityTypes);
  const selectedActionOnActivities = useSelector(state => state.indicatorEditorReducer.selectedData.actionOnActivities);
  const selectedActivityName = useSelector(state => state.indicatorEditorReducer.selectedData.activityName);
  const timeDurationData = useSelector(state => state.indicatorEditorReducer.selectedData.timeDuration);
  const languages = useSelector(state => state.indicatorEditorReducer.fetchedData.language);
  const errorActivitiesMethodOutput = useSelector(state => state.errorMessagesReducer.connectionErrors.activitiesMethodOutput);

  // Local constants
  let date = new Date();
  let dateEnd = dayjs(new Date());
  /*
    BORN-DEV-INDICATORS: for evaluation prupose set default start date 2019
    production code: new Date(date.setDate(date.getDate() - 90));
  */
  let dateStart = dayjs(new Date('2019-01-01'));

  const handleSelectActivities = (event, values) => {
    showSnackbar('Your selection for Activities has been saved.');
    dispatch(selectDeselectActivityName(values));
  };

  const handleSelectAllActivities = () => {
    showSnackbar('Your selection for Activities has been saved.');
    dispatch(selectDeselectActivityName(activityNameData));
  }

  const handleChangeTimeDuration = (startDate, endDate) => {
    showSnackbar('Your selection for Time has been saved.');
    dispatch(setTimeDuration(startDate, endDate));
  };

  const handleChangeUsers = (value) => {
    showSnackbar('Your selection for Users has been saved.');
    dispatch(setUsers(value));
  };

  const handleRefresh = () => {
    showSnackbar('Refreshing...');
    dispatch(getAllFilterData(selectedPlatform, selectedActivityTypes, selectedActionOnActivities, languages));
  }

  /**
   * Helper function for generating a SelectHelperAlert based on selected activity types.
   *
   * @returns {JSX.Element} - React component rendering a SelectHelperAlert.
   */
  const _activitiesSelectHelper = () => {
    const types = selectedActivityTypes.map((e => `"${e.name}"`)).join(', ');
    const typesPlural = selectedActivityTypes.map((e => `${e.name.toLowerCase()}s`)).join(', ');

    return (
      <>
        <SelectHelperAlert type='info' content={
          `Because you selected ${types} as the Activity Type, this list contains ${typesPlural} to choose from.`
        } />
      </>
    );
  }

  /**
  * Check if the step is complete
  * @returns {boolean} - True if step is complete, false otherwise
  */
  const isStepComplete = () => {
    return selectedActivityName.length !== 0;
  };

  useEffect(() => {
    dispatch(setAllFilterData({activityName: [], contextActivities: 0, result: 0}))
    if (timeDurationData.startDate === "" && timeDurationData.endDate === "")
      dispatch(setTimeDuration(dateStart, dateEnd));
    if (selectedActivityName.length === 0) {
      dispatch(getAllFilterData(selectedPlatform, selectedActivityTypes, selectedActionOnActivities, languages));
    }
  }, [dispatch, selectedPlatform, selectedActivityTypes, selectedActionOnActivities]);

  /**
   * useEffect to update step completeness on selected data change
   */
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete(config.id);
    } else {
      onStepIncomplete(config.id);
    }
  }, [selectedActivityName]);

  return (
    <>
      <Grid container direction="column" sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
        <Grid item xs={12}>
          <h1 style={{ fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400', color: '#000' }}>
            {config.title}:
          </h1>
        </Grid>
        <ConditionalSelectionRender
          isRendered={true}
          isLoading={(activityNameData.length === 0)}
          hasError={errorActivitiesMethodOutput}
          handleRefresh={handleRefresh}
        >
          <div>
            <SelectContainer
              name={config.list_of_activities.name}
              isMandatory={config.list_of_activities.mandatory}
              allowsMultipleSelections={config.list_of_activities.multiple_selections}
              helper={config.list_of_activities.helper}
            >
              <MenuMultiSelect
                name={config.list_of_activities.name}
                dataSource={activityNameData}
                itemName={selectedActivityName}
                selectAll={handleSelectAllActivities}
                handleChange={handleSelectActivities}
                customHelper={<_activitiesSelectHelper />}
              />
            </SelectContainer>
            <SelectionAccordion summary="More Filters">
              <UserFilter
                name={config.users.name}
                isMandatory={config.users.mandatory}
                allowsMultipleSelections={config.users.multiple_selections}
                helper={config.users.helper}
                handleChange={handleChangeUsers}
              />
              <TimeFilter
                name={config.time.name}
                isMandatory={config.time.mandatory}
                allowsMultipleSelections={config.time.multiple_selections}
                helper={config.time.helper}
                timeDurationData={timeDurationData}
                handleChange={handleChangeTimeDuration}
              />
            </SelectionAccordion>
          </div>
        </ConditionalSelectionRender>
      </Grid>
    </>
  );
}
