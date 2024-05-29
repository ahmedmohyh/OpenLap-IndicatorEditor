import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Breadcrumbs, Grid, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * A customizable page layout component.
 *
 * @module PageLayout
 * @param {Object} props - The props object containing configuration parameters.
 * @param {Array} props.breadcrumbs - An array of breadcrumb objects representing navigation links.
 * @param {Array} props.actions - An array of action objects representing icons and their onClick handlers.
 * @param {ReactNode} props.children - The content to be rendered within the layout.
 * @returns {ReactNode} - The rendered page layout component.
 * @example
 * import React from 'react';
 * import PageLayout from './PageLayout';
 *
 * const breadcrumbs = [
 *   { title: 'Home', href: '/', onClick: () => {} },
 *   { title: 'Category', href: '/category', onClick: () => {} },
 *   { title: 'Subcategory', href: null, onClick: null, isLast: true }
 * ];
 *
 * const actions = [
 *   { icon: <SomeIcon />, onClick: () => console.log('Action 1 clicked') },
 *   { icon: <AnotherIcon />, onClick: () => console.log('Action 2 clicked') }
 * ];
 *
 * const MyPage = () => {
 *   return (
 *     <PageLayout breadcrumbs={breadcrumbs} actions={actions}>
 *       {/* Your content here *\/}
 *     </PageLayout>
 *   );
 * };
 *
 * export default MyPage;
 * @author Louis Born <louis.born@stud.uni-due.de>
 */
const PageLayout = ({ breadcrumbs, actions, children }) => {
    const navigate = useNavigate();
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [layoutHeight, setLayoutHeight] = useState((window.innerHeight - 40 - 1));
    const [childrenHeight, setChildrenHeight] = useState((window.innerHeight - 40 - 1 - 48));

    function handleClick(event) {
        event.preventDefault();
        navigate(event.target.href);
    }

    useEffect(() => {
        const innerHeight = window.innerHeight;
        const NAVBAR_HEIGHT = 64;
        const FOOTER_HEIGHT = 40;
        const APPBAR_HEIGHT = 48;
        const calcLayoutHeight = (innerHeight - FOOTER_HEIGHT - 1);
        const calcChildrenHeight = (layoutHeight - APPBAR_HEIGHT);
        setInnerHeight(innerHeight);
        setLayoutHeight(calcLayoutHeight);
        setChildrenHeight(calcChildrenHeight);
    }, [window.innerHeight]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: `${layoutHeight}px` }}>
            {/* Header Bar */}
            <AppBar position="static" elevation={0}>
                <Toolbar sx={{ minHeight: '48px!important', backgroundColor: '#ffffff', borderBottom: '1px solid #C9C9C9' }}>
                    <Container disableGutters maxWidth="false">
                        <Box sx={{ maxHeight: '64px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {/* Centered Page Title*/}
                            <div style={{ flexGrow: 1, textAlign: 'center', fontSize: '1rem', color: '#000000' }}>
                                <div role="presentation" onClick={handleClick}>
                                    <Breadcrumbs aria-label="breadcrumb">
                                        {breadcrumbs.map((v => {
                                            return !(v.isLast) ?
                                                <button key={v.title} underline="hover" color="inherit" style={{all: 'unset', cursor: 'pointer'}} href={v.href} onClick={v.onClick}>
                                                    {v.title}
                                                </button>
                                                : <Typography key={v.title} color="text.primary" style={{cursor: 'default'}}>{v.title}</Typography>
                                        }))}
                                    </Breadcrumbs>
                                </div>
                            </div>

                            {/* Action Icons on the right*/}
                            {actions && (
                                <div>
                                    {actions.map((action, index) => (
                                        <IconButton key={index} color="#000000" onClick={action.onClick}>
                                            {action.icon}
                                        </IconButton>
                                    ))}
                                </div>
                            )}
                        </Box>
                    </Container>
                </Toolbar>
            </AppBar>

            {/* Main Content with Grid 12col */}
            <div style={{ minHeight: `${childrenHeight}px`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: '#F6F6F6', padding: '24px' }}>
                {children}
            </div>
        </div>
    );
};

export default PageLayout;