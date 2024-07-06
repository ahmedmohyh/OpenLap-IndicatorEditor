import { Avatar, Chip, Tooltip } from "@mui/material";
import {styled} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CancelIcon from '@mui/icons-material/Cancel';

const TagStyled = styled(Chip)(() => ({
    marginRight: '4px',
    marginBottom: '4px',
}));

const AvatarStyled = styled(Avatar, {
    shouldForwardProp: (props) => props !== 'bgColor',
})(({ bgColor }) => ({
    '&.MuiAvatar-root': {
        backgroundColor: bgColor
    }
}))

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function Tag({ color, step, label, completed, tooltip }) {

    return (
        <Tooltip title={
            <span style={{ fontSize: '16px' }}>{tooltip}</span>
        } arrow placement="right-start">
            <TagStyled avatar={
                <AvatarStyled sx={{ backgroundColor: `${color}` }}>
                    <span style={{ color: '#fff' }}>
                        {step + 1}
                    </span>
                </AvatarStyled>
            } 
            label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{label}</span>
                    <IconButton 
                    size="small" 
                  
                    sx={{ marginLeft: '8px', marginRight: '-11px' }} // Negative right margin
                >
                    <CancelIcon sx={{ color: '#AEAEAE' }} />
                </IconButton>

                </div>
            } 
            variant={completed ? 'filled' : 'outlined'}
            />
        </Tooltip>
    );
    
}