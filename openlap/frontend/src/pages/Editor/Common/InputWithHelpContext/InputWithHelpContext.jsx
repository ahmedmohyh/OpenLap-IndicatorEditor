import { Grid } from "@mui/material";
import HelpTooltip from "../HelpTooltip/HelpTooltip";

/**
 * DEPRECATED CAN BE DELETED
 * @author Louis Born <louis.born@stud.uni-due.de> */
export default function InputWithHelpContext({ label, isMandatory, hasMultipleSelectionsAllowed, help, children }) {
    return (
        <div>
            <Grid container xs={12}>
                <Grid item xs={12}>
                    <div style={{ fontSize: '12px', color: '#5F6368', marginBottom: '12px' }}>
                        {isMandatory ? (
                            <span style={{ color: 'red' }}>
                                *
                            </span>
                        ) : (<span></span>)}
                        {label}
                        {hasMultipleSelectionsAllowed ? (
                            <span>
                                {' '}(multiple selections allowed)
                            </span>
                        ) : (<span></span>)}
                        :
                    </div>
                </Grid>
                <Grid item container xs={12} spacing={3} direction="row" alignItems="center">
                    <Grid item xs={10}>
                        {children}
                    </Grid>
                    <Grid item xs={2}>
                        <HelpTooltip message={help}></HelpTooltip>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}