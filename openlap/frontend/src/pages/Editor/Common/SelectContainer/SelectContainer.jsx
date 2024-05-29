import { Grid } from "@mui/material";
import HelpTooltip from "../HelpTooltip/HelpTooltip";

/**
 * SelectContainer Component for rendering a container layout.
 * @param {Object} props - React props
 * @param {string} props.name - The name of the selection container.
 * @param {boolean} props.isMandatory - Whether the selection is mandatory.
 * @param {boolean} props.allowsMultipleSelections - Whether multiple selections are allowed.
 * @param {string} props.helper - Helper text for the selection.
 * @param {React.ReactNode} props.children - Input select component.
 * @returns {JSX.Element} - React component
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
export default function SelectContainer(props) {
    const { name, isMandatory, allowsMultipleSelections, helper, children } = props;

    return (
        <>
            <Grid container style={{ marginTop: '24px' }}>
                {name && <Grid item xs={12}>
                    <div style={{ fontSize: '12px', color: '#5F6368', marginBottom: '12px' }}>
                        {isMandatory ? <span style={{ color: 'red' }}>*</span> : <span>(Optional){' '}</span>}
                        Select <strong>{name}</strong>
                        {allowsMultipleSelections && <span>{' '}(multiple selections allowed)</span>}
                        :
                    </div>
                </Grid>}
                <Grid item container xs={12} spacing={3} direction="row" alignItems="center">
                    <Grid item xs={(helper ? 10 : 12)}>
                        {children}
                    </Grid>
                    {helper && <Grid item xs={2}>
                        <HelpTooltip message={helper}></HelpTooltip>
                    </Grid>}
                </Grid>
            </Grid>
        </>
    );
}