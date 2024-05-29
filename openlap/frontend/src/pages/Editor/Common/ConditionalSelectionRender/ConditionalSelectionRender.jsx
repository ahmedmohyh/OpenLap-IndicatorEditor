import { CircularProgress, Fab, Grid, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import config from './config';
import { useSnackbar } from '../../Indicators/BasicIndicator/context/SnackbarContext';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function ConditionalSelectionRender(props) {
    const { isRendered, isLoading, hasError, handleRefresh, refreshType, children } = props;
    const showSnackbar = useSnackbar();
    
    const refreshHandler = () => {
        showSnackbar("Refreshing...");
        handleRefresh(refreshType);
    }

    const CircularIndeterminateLoader = () => {
        return (
            <Grid container direction="column" alignItems="center" sx={{ padding: '1rem' }}>
                <CircularProgress sx={{ mb: '1rem' }} />
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#80868b' }}>
                    {config.loading}
                </span>
            </Grid>
        );
    };

    const ConnectionProblem = () => {
        return (
            <Grid container direction='column' justify="center" alignItems="center">
                <Tooltip title={
                    <span style={{ fontSize: '16px' }}>{config.errorTooltip}</span>
                }>
                    <Fab color="primary" size="small" sx={{ mb: '1rem' }}
                        onClick={() => refreshHandler()}>
                        <RefreshIcon />
                    </Fab>
                </Tooltip>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#80868b' }}>
                    {config.error}
                </span>
            </Grid>
        );
    }

    return (
        <>
            {
                isRendered &&
                (<Grid item xs={12}>
                    {(isLoading && !hasError) ?
                        <CircularIndeterminateLoader />
                        : hasError ?
                            <ConnectionProblem />
                            :
                            children
                    }
                </Grid>)
            }
        </>
    );
};