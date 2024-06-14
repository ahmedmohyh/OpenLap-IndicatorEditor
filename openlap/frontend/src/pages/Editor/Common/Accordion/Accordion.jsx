import { Accordion, AccordionDetails, AccordionSummary, Grid } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useState } from "react";
import zIndex from "@mui/material/styles/zIndex";
import { useDispatch } from "react-redux";
import { clearActivitiesAndUserFilters } from "../../../../utils/redux/reducers/indicatorEditor";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function SelectionAccordion({ summary, children }) {

    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();


    const onExpand = () => {
        setExpanded(!expanded);
    }

    const onReset = () => {
        dispatch(clearActivitiesAndUserFilters());
    }

    return (
        <div>
            <Grid container sx={{ marginTop: '32px' }}>
                <Grid item xs={10}
                    onClick={onExpand}
                >
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            {summary}
                            { expanded && <div 
                            style={{ zIndex: 2}}
                            onClick={onReset}><RestartAltIcon style={{zIndex: 3}}/> </div>}
                        </AccordionSummary>
                        <AccordionDetails sx={{ borderTop: '1px solid #F6F6F6' }}>
                            {children}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </div>
    );
}