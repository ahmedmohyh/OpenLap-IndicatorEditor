import { Alert, styled } from "@mui/material";

const StyledAlert = styled(Alert)(({ size = 12 }) => ({
    margin: '0 -14px',
    padding: '0 12px',
    fontSize: `${size}px`,
    "& .MuiAlert-icon": {
        fontSize: `${(size)+4}px`,
    },
    "& .MuiAlert-message": {
        whiteSpace: 'normal'
    }
}));

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function SelectHelperAlert(props) {
    const { type, content, size } = props;

    return (
        <>
            <StyledAlert severity={type} size={size}>{content}</StyledAlert>
        </>
    );
}