import React, { useEffect } from 'react';
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getActionOnActivities,
  getActivityTypes,
  getAllPlatforms,
  resetFilterData,
  selectActivityTypes,
  selectDeselectActionOnActivities,
  selectPlatform
} from "../../../../../utils/redux/reducers/indicatorEditor";
import {
  setConnectionErrorActionOnActivity,
  setConnectionErrorActivityType,
  setConnectionErrorPlatform
} from "../../../../../utils/redux/reducers/errorMessages";
import MenuMultiSelect from "../../../Common/MenuMultiSelect/MenuMultiSelect";
import ConditionalSelectionRender from '../../../Common/ConditionalSelectionRender/ConditionalSelectionRender';
import SelectContainer from '../../../Common/SelectContainer/SelectContainer';
import config from './config';
import { useSnackbar } from '../context/SnackbarContext';
import slower from '../../../Helper/slower';

/**
 * StepDataset Component
 * @param {Object} props - React props
 * @param {Function} props.onStepComplete - Callback function for completing the step
 * @param {Function} props.onStepIncomplete - Callback function for incomplete step
 * @returns {JSX.Element} - React component
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
export default function StepDataset({ onStepComplete, onStepIncomplete }) {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const platformsData = useSelector(state => state.indicatorEditorReducer.fetchedData.platforms);
  const activityTypesData = useSelector(state => state.indicatorEditorReducer.fetchedData.activityTypes);
  const actionOnActivitiesData = useSelector(state => state.indicatorEditorReducer.fetchedData.actionOnActivities);
  const selectedPlatform = useSelector(state => state.indicatorEditorReducer.selectedData.platforms);
  const selectedActivityTypes = useSelector(state => state.indicatorEditorReducer.selectedData.activityTypes);
  const selectedActionOnActivities = useSelector(state => state.indicatorEditorReducer.selectedData.actionOnActivities);
  const selectedActivityName = useSelector(state => state.indicatorEditorReducer.selectedData.activityName);
  const errorPlatform = useSelector(state => state.errorMessagesReducer.connectionErrors.platform);
  const errorActivityType = useSelector(state => state.errorMessagesReducer.connectionErrors.activityType);
  const errorActionOnActivity = useSelector(state => state.errorMessagesReducer.connectionErrors.actionOnActivity);

  const handleRefresh = (type) => () => {
    showSnackbar("Refreshing...");
    if (type === config.dataset.refresh_type) {
      dispatch(setConnectionErrorPlatform(false));
      dispatch(getAllPlatforms());
    }

    if (type === config.activity_types.refresh_type) {
      dispatch(setConnectionErrorActivityType(false));
      dispatch(getActivityTypes(selectedPlatform));
    }

    if (type === config.action_on_activities.refresh_type) {
      dispatch(setConnectionErrorActionOnActivity(false));
      dispatch(getActionOnActivities(selectedPlatform, selectedActivityTypes));
    }
  }

  const handleSelectDataset = (event, values) => {
    showSnackbar('Your selection for Dataset has been saved.');
    dispatch(selectPlatform(values));

    if (values.length !== 0) dispatch(getActivityTypes(values));
  };

  const handleSelectAllDataset = (e) => {
    dispatch(selectPlatform([])); // Reset dataset data to refresh Activity Types selection.
    showSnackbar('Your selection for Dataset has been saved.');
    dispatch(selectPlatform(platformsData));
    dispatch(getActivityTypes(platformsData));

    if (selectedActivityTypes.length !== 0) dispatch(selectActivityTypes([]));
  }

  const handleSelectActivityTypes = (event, values) => {
    dispatch(selectDeselectActionOnActivities([]));
    dispatch(selectActivityTypes([])); // Reset activity types data to refresh Action on Activites selection.
    showSnackbar('Your selection for Activity Types has been saved.');
    dispatch(selectActivityTypes(values));

    slower(() => {
        if (values.length !== 0) dispatch(getActionOnActivities(selectedPlatform, values));
    });
  };

  const handleSelectAllActivityTypes = () => {
    showSnackbar('Your selection for Activity Types has been saved.');
    dispatch(selectActivityTypes(activityTypesData));
    dispatch(getActionOnActivities(selectedPlatform, activityTypesData));
  }

  const handleSelectActionOnActivities = (event, values) => {
    showSnackbar('Your selection for Action on Activities has been saved.');
    dispatch(selectDeselectActionOnActivities(values));
  };

  const handleSelectAllActionOnActivities = () => {
    showSnackbar('Your selection for Action on Activities has been saved.');
    dispatch(selectDeselectActionOnActivities(actionOnActivitiesData));

    if (selectedActivityName.length !== 0) dispatch(resetFilterData());
  }

  /**
   * Check if the step is complete
   * @returns {boolean} - True if step is complete, false otherwise
   */
  const isStepComplete = () => {
    return selectedPlatform.length !== 0 && selectedActivityTypes.length !== 0 && selectedActionOnActivities.length !== 0;
  };

  useEffect(() => {
    dispatch(getAllPlatforms());
  }, []);

  /**
   * useEffect to update step completeness on selected data change
   */
  useEffect(() => {
    if (isStepComplete()) {
      onStepComplete(config.id);
    } else {
      onStepIncomplete(config.id);
    }
  }, [selectedPlatform, selectedActivityTypes, selectedActionOnActivities]);

  return (
    <>
      <Grid container direction="column" sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
        <Grid item md={12}>
          <h1 style={{ fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400', color: '#000' }}>
            {config.title}:
          </h1>
        </Grid>
        {/** Dataset selection. */}
        <ConditionalSelectionRender
          isRendered={true}
          isLoading={(platformsData.length === 0)}
          hasError={errorPlatform}
          handleRefresh={handleRefresh}
          refreshType={config.dataset.refresh_type}
        >
          <SelectContainer
            name={config.dataset.name}
            isMandatory={config.dataset.mandatory}
            allowsMultipleSelections={config.dataset.multiple_selections}
            helper={config.dataset.helper}
          >
            <MenuMultiSelect
              name={config.dataset.name}
              dataSource={platformsData}
              itemName={selectedPlatform}
              selectAll={handleSelectAllDataset}
              handleChange={handleSelectDataset}
            />
          </SelectContainer>
        </ConditionalSelectionRender>
        {/** Activity Types selection. */}
        <ConditionalSelectionRender
          isRendered={(selectedPlatform.length !== 0)}
          isLoading={(activityTypesData.length === 0)}
          hasError={errorActivityType}
          handleRefresh={handleRefresh}
          refreshType={config.activity_types.name}
        >
          <SelectContainer
            name={config.activity_types.name}
            isMandatory={config.activity_types.mandatory}
            allowsMultipleSelections={config.activity_types.multiple_selections}
            helper={config.activity_types.helper}
          >
            <MenuMultiSelect
              name={config.activity_types.name}
              dataSource={activityTypesData}
              itemName={selectedActivityTypes}
              selectAll={handleSelectAllActivityTypes}
              handleChange={handleSelectActivityTypes}
            />
          </SelectContainer>
        </ConditionalSelectionRender>
        {/** Action on Activity Types selection. */}
        <ConditionalSelectionRender
          isRendered={(selectedActivityTypes.length !== 0)}
          isLoading={(actionOnActivitiesData.length === 0)}
          hasError={errorActionOnActivity}
          handleRefresh={handleRefresh}
          refreshType={config.action_on_activities.name}
        >
          <SelectContainer
            name={config.action_on_activities.name}
            isMandatory={config.action_on_activities.mandatory}
            allowsMultipleSelections={config.action_on_activities.multiple_selections}
            helper={config.action_on_activities.helper}
          >
            <MenuMultiSelect
              name={config.action_on_activities.name}
              dataSource={actionOnActivitiesData}
              itemName={selectedActionOnActivities}
              selectAll={handleSelectAllActionOnActivities}
              handleChange={handleSelectActionOnActivities}
            />
          </SelectContainer>
        </ConditionalSelectionRender>
      </Grid>
    </>
  )
};
