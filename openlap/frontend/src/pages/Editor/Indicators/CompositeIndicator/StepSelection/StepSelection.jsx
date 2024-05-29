import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { getBasicIndicatorPreviewList, resetIndicatorSession, selectIndicators } from "../../../../../utils/redux/reducers/compositeEditor";
import SelectContainer from "../../../Common/SelectContainer/SelectContainer";
import { useSnackbar } from "../../BasicIndicator/context/SnackbarContext";
import IndicatorPreviewCard from "./component/IndicatorPreviewCard";
import config from "./config";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function StepSelection(props) {
    const { setAnalysisMethodOutputsData, onStepComplete, onStepIncomplete } = props;

    const dispatch = useDispatch();
    const showSnackbar = useSnackbar();

    const [currentIndicatorPreview, setCurrentIndicatorPreview] = useState({});
    const [notCompatibleBasicIndicatorList, setNotCompatibleBasicIndicatorList] = useState([]);

    const basicIndicatorPreviewMap = useSelector((state) => state.compositeEditorReducer.baiscIndicatorPreviewList);
    const selectionIndicators = useSelector((state) => state.compositeEditorReducer.selectedData.indicators);
    const basicIndicatorPreviewList = Object.values(useSelector((state) => state.compositeEditorReducer.baiscIndicatorPreviewList));

    const checkIndicatorCompatibility = (selections) => {
        let _notCompatibleBasicIndicatorList = [];

        for (let s in selections) {
            let tempIndicatorObj = basicIndicatorPreviewList.find(obj => obj.id === selections[s].id);

            for (let i in basicIndicatorPreviewList) {
                // Indicator is not compatible with current selection
                if (
                    basicIndicatorPreviewList[i]["id"] !== tempIndicatorObj["id"] &&
                    basicIndicatorPreviewList[i]["analyticsMethodId"] !== tempIndicatorObj["analyticsMethodId"]
                ) {
                    _notCompatibleBasicIndicatorList = [
                        ..._notCompatibleBasicIndicatorList,
                        basicIndicatorPreviewList[i],
                    ];
                }
            }
            setNotCompatibleBasicIndicatorList(_notCompatibleBasicIndicatorList);
        }
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
        showSnackbar("Your selection for Indicators has been saved.");
        dispatch(selectIndicators(indicatorObj));
    };

    const _indicatorPreviewCards = (list) => {
        return list.map((e) => {
            const isNotCompatible = notCompatibleBasicIndicatorList.some(obj => {
                // If current element e is in unAvailable.List then return 'true'
                return obj.name === e.name && obj.id === e.id;
            });

            return (<IndicatorPreviewCard
                key={e.name}
                preview={e}
                isDisabled={isNotCompatible}
                compatibleErrorMsg={'Differs in analysis method'}
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
        dispatch(getBasicIndicatorPreviewList());
    }, []);

    /**
     * useEffect to watch selected indicators change and run compatibility check
     */
    useEffect(() => {
        checkIndicatorCompatibility(selectionIndicators);
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
                {basicIndicatorPreviewList.length > 0 ? (
                    <div>
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
                                    {_indicatorPreviewCards(basicIndicatorPreviewList)}
                                </div>
                            </SelectContainer>
                        </Grid>
                    </div>
                ) : <span>No Indicator Preview available.</span>}
            </Grid>
        </>
    );
}