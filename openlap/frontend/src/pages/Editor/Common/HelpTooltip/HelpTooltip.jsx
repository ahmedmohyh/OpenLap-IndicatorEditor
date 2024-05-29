import { Tooltip, Zoom, styled } from "@mui/material";

/**
 * A Helper Icon that when hovered shows a tooltip information.
 * Is used within the `InputWithHelpContext` component.
 * 
 * @author Louis Born <louis.born@stud.uni-due.de> 
 */
export default function HelpTooltip({ message }) {
    const Helper = styled('div')(() => ({
        margin: '0px',
        borderRadius: '100%',
        backgroundColor: '#EDEDED',
        height: '32px',
        width: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'help',
        '& .helper-text': {
            fontSize: '20px',
        fontWeight: '700'
        }
    }));

    return (
        <Tooltip title={
            <span style={{ fontSize: '16px'}}>{message}.</span>
        } TransitionComponent={Zoom} arrow placement="right-start">
            <Helper>
                <span className="helper-text">?</span>
            </Helper>
        </Tooltip>
    );
}