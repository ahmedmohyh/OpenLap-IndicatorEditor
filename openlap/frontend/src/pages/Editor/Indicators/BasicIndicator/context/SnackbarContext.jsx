import React, { createContext, useContext, useState } from "react";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import debounceWithCooldown from "../../../Helper/debounce";
import SnackbarType from "../enum/SnackbarType";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

/**@author Louis Born <louis.born@stud.uni-due.de> */
export const SnackbarProvider = ({ children, anchor = {
    left: `calc(50% + ${248 / 2}px)`,
    bottom: '1%',
    transform: "translateX(-50%)",
} }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState(null);

    const debouncedShowSnackbar = debounceWithCooldown((msg, isOpen) => {
        setOpen(isOpen);
        setMessage(msg);
    }, 3000);

    const showSnackbar = (message, type = null) => {
        setType(type);
        debouncedShowSnackbar(message, true);
    };

    const _renderSnackbarContent = (severity, msg) => {
        return (
            <Alert
                severity={severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {msg}
            </Alert>
        );
    }

    function _getSnackbarType(type) {
        // switch is used to render 'default' if no match is found.
        switch (type) {
            case SnackbarType.success:
                return (
                    _renderSnackbarContent(type, message)
                );
            case SnackbarType.info:
                return (
                    _renderSnackbarContent(type, message)
                );
            case SnackbarType.warning:
                return (
                    _renderSnackbarContent(type, message)
                );
            case SnackbarType.error:
                return (
                    _renderSnackbarContent(type, message)
                );
            default:
                return (null);
        }
    };

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={null}
                message={message}
                style={anchor}
            >
                {_getSnackbarType(type)}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};