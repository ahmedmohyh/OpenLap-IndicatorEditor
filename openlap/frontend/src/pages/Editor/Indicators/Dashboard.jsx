import React, { useEffect, useState } from "react";
import {
    AppBar,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPlatforms, resetIndicatorSession } from "../../../utils/redux/reducers/indicatorEditor";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { showVisualization } from "../../../utils/backend";
import Preview from "./Preview/Preview";
import Box from "@mui/material/Box";
import { createNewIndicatorRequest } from "../../../utils/redux/reducers/gqiEditor";
import PreviewIcon from '@mui/icons-material/Preview';
import ModalMessage from "../Common/Modal/ModalMessage";
import { getUserQuestionsAndIndicators } from "../../../utils/redux/reducers/reducer";
import { scrollToTop } from "../../../utils/utils";
import config from "./config";
import CloseIcon from '@mui/icons-material/Close';

const Section = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #C9C9C9',
    marginLeft: '-24px',
    marginRight: '-24px',
    padding: '10px 24px 10px 24px',
    minHeight: '100%',
    '&.first': {
        padding: '0 16px 10px 16px'
    },
    '&.last': {
        borderBottom: 'none'
    }
}));

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const indicatorSaveResponse = useSelector((state) => state.compositeEditorReducer.selectedData.indicatorResponseData);
    const userDefinedIndicators = useSelector((state) => state.rootReducer.user.definedIndicators);

    const [visData, setVisData] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [indicators, setIndicators] = useState([]);
    const [feedback, setFeedback] = useState({
        openFeedbackStartCompositeIndicator: false,
        openFeedbackStartMultiLevelIndicator: false
    });

    const filteredResults = indicators.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

    const handleShowVisualization = async (indicator) => {
        setLoading(true);
        showVisualization(indicator).then((result) => {
            setVisData(result);
            setLoading(false);
        });
    };

    const searchByIndicatorName = (e) => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
    };

    const handleConfirmIndicatorChoice = (indicatorType) => {
        if (indicatorType === "Basic Indicator") {
            dispatch(createNewIndicatorRequest(indicatorType));
            dispatch(resetIndicatorSession());
            dispatch(getAllPlatforms());
            navigate("/indicator/create-basic");
        } else if (indicatorType === "Composite Indicator") {
            handleFeedbackStartCompositeIndicator();
        } else if (indicatorType === "Multi-level Indicator") {
            handleFeedbackStartMultiLevelIndicator();
        }
    }

    const handleFeedback = (name, value) => {
        setFeedback(() => ({
            ...feedback,
            [name]: !value,
        }))
    };

    const handleFeedbackStartCompositeIndicator = () => {
        handleFeedback("openFeedbackStartCompositeIndicator", feedback.openFeedbackStartCompositeIndicator);
    };

    const handleFeedbackStartMultiLevelIndicator = () => {
        handleFeedback("openFeedbackStartMultiLevelIndicator", feedback.openFeedbackStartMultiLevelIndicator);
    };

    const _createIndicatorItem = ({ item }) => {
        const IndicatorItemContainer = styled('div')(() => ({
            '&:hover': {
                cursor: 'pointer',
                '& #item-paper': {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2), 0px 4px 8px rgba(0, 0, 0, 0.14), 0px 8px 16px rgba(0, 0, 0, 0.12)',
                }
            },
        }));

        return (
            <IndicatorItemContainer style={{ maxWidth: '250px' }} onClick={() => handleConfirmIndicatorChoice(item.name)}>
                <Tooltip title={
                    <span style={{ fontSize: '16px' }}>{item.tooltip}</span>
                }>
                    <div style={{ padding: '2px 5px' }}>
                        <Paper id="item-paper" elevation={0} square={false} sx={{ position: 'relative', width: '250px', height: '150px', padding: '16px', border: '1px solid #dadce0' }}>
                            <img width="225px" height="auto" src={item.img} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                        </Paper>
                        <div style={{ paddingTop: '16px', fontSize: '14px', width: '250px' }}>{item.name}</div>
                        <div style={{ paddingTop: '4px', fontSize: '12px', color: '#5f6368', width: '250px' }}>{item.info}</div>
                    </div>
                </Tooltip>
            </IndicatorItemContainer>
        );
    }

    const _createNewIndicator = () => {
        return (
            <div>
                <p style={{ marginTop: 0, fontSize: '16px' }}>Create new indicators</p>
                <div style={{ display: 'flex', gap: '32px' }}>
                    {Object.entries(config).map(([key, value]) => (
                        <_createIndicatorItem key={key} item={value} />
                    ))}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (userDefinedIndicators.length > 0) {
            setIndicators(userDefinedIndicators[0].indicators);
        }
    }, [userDefinedIndicators]);

    useEffect(() => {
        dispatch(resetIndicatorSession());
        dispatch(getUserQuestionsAndIndicators());
        scrollToTop();
    }, [dispatch, indicatorSaveResponse.length]);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div>
                        <AppBar position="static" elevation={0}>
                            <Toolbar sx={{ minHeight: '48px!important', backgroundColor: '#ffffff', borderBottom: '1px solid #C9C9C9' }}>
                                <Container disableGutters maxWidth="false">
                                    <Box sx={{ maxHeight: '64px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        {/* Centered Page Title*/}
                                        <div style={{ flexGrow: 1, textAlign: 'center', fontSize: '1rem', color: '#000000' }}>
                                            <div role="presentation">
                                                <Breadcrumbs aria-label="breadcrumb">
                                                    <Typography color="text.primary">Indicator Editor</Typography>
                                                </Breadcrumbs>
                                            </div>
                                        </div>
                                    </Box>
                                </Container>
                            </Toolbar>
                        </AppBar>
                        <Grid container style={{ maxWidth: '990px', display: 'flex', flexDirection: 'column', margin: '24px auto', padding: '0 32px' }}>
                            <Grid item>
                                <div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                        <_createNewIndicator />
                                        <div>
                                            <p style={{ marginTop: 0, fontSize: '16px' }}>Your workspace</p>
                                            <Grid container sx={{ backgroundColor: '#F6F6F6' }}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        type="search"
                                                        fullWidth
                                                        sx={{ backgroundColor: '#f1f3f4' }}
                                                        placeholder="Search"
                                                        onChange={searchByIndicatorName}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <SearchIcon></SearchIcon>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <TableContainer component={Paper}>
                                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Indicator Name</TableCell>
                                                            <TableCell>Type</TableCell>
                                                            <TableCell align="center">Preview</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {filteredResults.map((indicator) => (
                                                            <TableRow
                                                                key={indicator.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {indicator.name}
                                                                </TableCell>
                                                                <TableCell>{(indicator.indicatorType === 'composite') ? 'Composite Indicator' : (indicator.indicatorType === 'multianalysis') ? 'Multi-Level Analysis Indicator' : indicator.indicatorType}</TableCell>
                                                                <TableCell>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        <Tooltip title="Open Preview">
                                                                            <IconButton color="priamry" sx={{ padding: 0, maring: '0 4px' }} onClick={() => {
                                                                                handleShowVisualization(indicator);
                                                                                setOpenDetails(!openDetails);
                                                                            }}>
                                                                                <PreviewIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            {(filteredResults.length === 0 && search != "") && (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#80868b', margin: '30px' }}>
                                                        No indicator found with search term: "{search}".
                                                    </span>
                                                </div>
                                            )}
                                            {(userDefinedIndicators.length === 0) && (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#80868b', margin: '30px' }}>
                                                        No user defined indicators found.
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        {/* Dialog to preview the indicators specified for the question*/}
                        <Dialog
                            fullWidth
                            maxWidth="sm"
                            open={openDetails}
                            onClose={() => setOpenDetails(!openDetails)}
                            aria-labelledby="form-dialog-title"
                        >
                            {!loading ? (
                                <>
                                    <DialogTitle id="form-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #C9C9C9' }}>
                                        <span>Preview: {visData.name}</span>
                                        <IconButton onClick={() => setOpenDetails(!openDetails)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </DialogTitle>
                                    <DialogContent>
                                        <Preview viz={visData} />
                                    </DialogContent>
                                </>
                            ) : (
                                <Grid container direction="column" alignItems="center" sx={{ mt: 5 }}>
                                    <CircularProgress sx={{ mb: 1 }} />
                                    <Typography>Loading indicator</Typography>
                                </Grid>
                            )}
                            <DialogActions>
                                <Button onClick={() => setOpenDetails(!openDetails)}> Close </Button>
                            </DialogActions>
                        </Dialog>
                        {/**@author Louis Born <louis.born@stud.uni-due.de> */}
                        <ModalMessage
                            dialogTitle={"Please note"}
                            dialogPrimaryContext={`All the combining basic indicators MUST apply the same analytics method, i.e., Count.`}
                            openDialog={feedback.openFeedbackStartCompositeIndicator}
                            setOpenDialog={() => handleFeedback("openFeedbackStartCompositeIndicator", feedback.openFeedbackStartCompositeIndicator)}
                            primaryAction={() => navigate("/indicator/create-composite")}
                            primaryButton={"Continue"}
                        />
                        {/**@author Louis Born <louis.born@stud.uni-due.de> */}
                        <ModalMessage
                            dialogTitle={"Please note"}
                            dialogPrimaryContext={`All the combining basic indicators MUST have at least one common attribute, i.e., student ID.`}
                            openDialog={feedback.openFeedbackStartMultiLevelIndicator}
                            setOpenDialog={() => handleFeedback("openFeedbackStartMultiLevelIndicator", feedback.openFeedbackStartMultiLevelIndicator)}
                            primaryAction={() => navigate("/indicator/create-multi-level")}
                            primaryButton={"Continue"}
                        />

                    </div >
                </div>
            </div>
        </>
    );
};
