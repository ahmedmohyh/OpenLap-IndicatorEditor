import { Accordion, AccordionDetails, AccordionSummary, Grid } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function SelectionAccordion({ summary, children }) {
    return (
        <div>
            <Grid container sx={{ marginTop: '32px' }}>
                <Grid item xs={10}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            {summary}
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