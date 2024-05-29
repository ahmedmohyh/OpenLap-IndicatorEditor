import React from 'react';
import PropTypes from 'prop-types';
import { Grid, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ScrollableContainer = styled('div')(() => ({
    flexGrow: 2,
    overflowY: 'auto',
    minHeight: '100%',
    maxHeight: `100%`,
    scrollMargin: '1rem'
}));

/**
 * A component designed to accommodate the new design for the OpenLap Indicator Editor.
 *
 * @module ResponsiveComponent
 * @param {Object} props - The props object containing configuration parameters.
 * @param {string|ReactNode} [props.title] - The title to be displayed in the top bar of the component.
 * @param {number} [props.cols=12] - The number of columns to be used in the grid layout system.
 * @param {ReactNode} props.children - The content to be rendered within the main content area.
 * @param {Array} [props.buttons] - An array of button objects representing action buttons displayed at the bottom of the component.
 * @returns {ReactNode} - The rendered responsive component.
 * @example
 * import React from 'react';
 * import ResponsiveComponent from './ResponsiveComponent';
 *
 * const buttons = [
 *   { label: 'Button 1', onClick: () => console.log('Button 1 clicked') },
 *   { label: 'Button 2', onClick: () => console.log('Button 2 clicked'), hidden: true }
 * ];
 *
 * const MyComponent = () => {
 *   return (
 *     <ResponsiveComponent title="Component Title" buttons={buttons}>
 *       {/* Your content here *\/}
 *     </ResponsiveComponent>
 *   );
 * };
 *
 * export default MyComponent;
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
const ResponsiveComponent = ({ gridSpace, title, children, buttons }) => {
    return (
        <div>
            <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', backgroundColor: '#ffffff', border: '1px solid #C9C9C9', borderRadius: '6px' }}>
                {/* Top Bar with Gray Bottom Border */}
                <Box borderBottom={1} borderColor="grey.300" mb={0} p={0} sx={{ flexGrow: 0,  minHeight: '56px', padding: '14px 16px' }}>
                    {title && <div style={{ fontSize: '1rem', fontWeight: '700' }}>{title}</div>}
                </Box>

                {/* Main Content with 12Col Grid System */}
                <ScrollableContainer>
                    <Grid container spacing={0} alignContent='flex-start' sx={{ padding: '16px 16px 32px 16px', height: '100%' }}>
                        {React.Children.map(children, (child) => (
                            <Grid item xs={12} sx={{ height: '100%' }}>
                                {child}
                            </Grid>
                        ))}
                    </Grid>
                </ScrollableContainer>

                {/* Bottom Section with Gray Top Border */}
                {buttons && buttons.length > 0 && (
                    <Box borderTop={1} borderColor="grey.300" mt={0} p={0} display="flex" justifyContent="space-between" flexDirection="row-reverse" sx={{ flexGrow: 0, minHeight: '56px', padding: '8px 16px' }}>
                        {buttons.map((button) => (
                            <Button key={button.label} {...button} sx={{ visibility: (button.hidden ? 'hidden': 'visible')}}>
                                {button.label}
                            </Button>
                        ))}
                    </Box>
                )}
            </Box>
        </div>
    );
};

ResponsiveComponent.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
    cols: PropTypes.number,
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ),
};

ResponsiveComponent.defaultProps = {
    cols: 12,
};

export default ResponsiveComponent;
