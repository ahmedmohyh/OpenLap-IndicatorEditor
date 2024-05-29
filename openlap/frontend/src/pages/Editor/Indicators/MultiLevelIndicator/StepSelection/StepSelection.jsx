import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { getBasicIndicatorPreviewListML, resetIndicatorSession, selectIndicatorsML } from "../../../../../utils/redux/reducers/multiLevelEditor";
import SelectContainer from "../../../Common/SelectContainer/SelectContainer";
import { useSnackbar } from "../../BasicIndicator/context/SnackbarContext";
import IndicatorPreviewCard from "../../CompositeIndicator/StepSelection/component/IndicatorPreviewCard";
import config from "./config";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function StepSelection(props) {
    const { setAnalysisMethodOutputsData, onStepComplete, onStepIncomplete } = props;

    const dispatch = useDispatch();
    const showSnackbar = useSnackbar();

    const [currentIndicatorPreview, setCurrentIndicatorPreview] = useState({});
    const [notCompatibleBasicIndicatorList, setNotCompatibleBasicIndicatorList] = useState([]);

    const selectionIndicators = useSelector((state) => state.multiLevelEditorReducer.selectedData.indicators);
    const basicIndicatorPreviewMap = useSelector((state) => state.multiLevelEditorReducer.baiscIndicatorPreviewList);
    const basicIndicatorPreviewList = Object.values(useSelector((state) => state.multiLevelEditorReducer.baiscIndicatorPreviewList));

    const checkIndicatorCompatibility = (selections) => {
        let _notCompatibleBasicIndicatorList = [];

        for (let s in selections) {
            let tempIndicatorObj = basicIndicatorPreviewList.find(obj => obj.id === selections[s].id);
            let outps_str = [];
            let columns_obj = tempIndicatorObj['indicators'][0]['outputs']['columns']
            if (Object.keys(columns_obj).indexOf('group_column') !== -1) {
                outps_str.push(...columns_obj['group_column']['data'])
            } else {
                Object.keys(columns_obj).forEach(k => {
                    if (columns_obj[k]['configurationData']['type'] === 'Text') {
                        outps_str.push(...columns_obj[k]['data'])
                    }
                })
            }

            for (let i in basicIndicatorPreviewList) {
                let _tempObj = basicIndicatorPreviewList[i];
                let _outps_str = []
                let _columns_obj = _tempObj['indicators'][0]['outputs']['columns']
                if (Object.keys(_columns_obj).indexOf('group_column') !== -1) {
                    _outps_str.push(..._columns_obj['group_column']['data'])
                } else {
                    Object.keys(_columns_obj).forEach(k => {
                        if (_columns_obj[k]['configurationData']['type'] === 'Text') {
                            _outps_str.push(..._columns_obj[k]['data'])
                        }
                    })
                }
                // Indicator is not compatible with current selection
                if (
                    _outps_str.sort().toString() !== outps_str.sort().toString()
                ) {
                    _notCompatibleBasicIndicatorList = [
                        ..._notCompatibleBasicIndicatorList,
                        basicIndicatorPreviewList[i],
                    ];
                }
            }
        }
        setNotCompatibleBasicIndicatorList(_notCompatibleBasicIndicatorList);
    };

    const handleChange = (event) => {
        let indicatorId = event.target.name.split("@")[0];
        // Get complete indicator object
        let indicatorObj = basicIndicatorPreviewList.find((v) => v.id === indicatorId);

        if (Object.keys(currentIndicatorPreview).length === 0) {
            setCurrentIndicatorPreview(basicIndicatorPreviewMap[indicatorId]);
        } else {
            const methodMapList =
                basicIndicatorPreviewMap[indicatorId]["indicators"][0][
                "methodToVisualizationConfig"
                ]["mapping"];
            const _methodMapList = [];
            for (let i in methodMapList) {
                _methodMapList.push(methodMapList[i]["outputPort"]);
            }
            setAnalysisMethodOutputsData(_methodMapList);
        }
        dispatch(selectIndicatorsML(indicatorObj));
    };

    const _indicatorPreviewCards = (list) => {
        return list.map((e, index) => {
            const isNotCompatible = notCompatibleBasicIndicatorList.some(obj => {
                // If current element e is in unAvailable..List then return 'true'
                return obj.name === e.name && obj.id === e.id;
            });

            return (<IndicatorPreviewCard
                key={`${e.name}-${index}`}
                preview={e}
                isDisabled={isNotCompatible}
                compatibleErrorMsg={'Lacks common attribute'}
                handleChange={handleChange}
            />)
        });
    };

    /**
     * Check if the step is complete
     * @returns {boolean} - True if step is complete, false otherwise
     */
    const isStepComplete = () => {
        return selectionIndicators.length >= 2;
    };

    useEffect(() => {
        dispatch(resetIndicatorSession());
        dispatch(getBasicIndicatorPreviewListML());
    }, []);

    /**
     * useEffect to watch selected indicators change and run compatibility check
     */
    useEffect(() => {
        checkIndicatorCompatibility(selectionIndicators);
        showSnackbar("Your selection for Indicators has been saved.");
    }, [selectionIndicators])

    /**
     * useEffect to update step completeness on selected data change
     */
    useEffect(() => {
        if (isStepComplete()) {
            onStepComplete(config.id);
        } else {
            onStepIncomplete(config.id);
        }
    }, [selectionIndicators]);

    return (
        <>
            <Grid container direction="column" sx={{ paddingLeft: '8px', paddingRight: '8px' }}>
                <Grid item md={12}>
                    <h1 style={{ fontSize: '1rem', lineHeight: '1.5rem', fontWeight: '400', color: '#000' }}>
                        {config.title}:
                    </h1>
                </Grid>
                <Grid item md={12} style={{ maxHeight: '300px' }}>
                    <SelectContainer
                        name={"Indicators"}
                        isMandatory={true}
                        allowsMultipleSelections={false}
                        helper={null}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'stretch', paddingBottom: '32px' }}>
                            {_indicatorPreviewCards(basicIndicatorPreviewList, "")}
                        </div>
                    </SelectContainer>
                </Grid>
            </Grid>
        </>
    );
}