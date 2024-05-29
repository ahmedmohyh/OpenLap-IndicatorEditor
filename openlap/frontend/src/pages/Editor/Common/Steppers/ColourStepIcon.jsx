import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { styled } from '@mui/material';

const useColorStepIconStyles = styled((theme) => ({
  root: {
    backgroundColor: "#ccc",
    boxShadow: theme.palette.type === 'light' ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' : '0 1px 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,1)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: theme.palette.type === 'light' ? '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)' : '0 14px 28px rgba(0,0,0,0.85), 0 10px 10px rgba(0,0,0,0.82)',
    },
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white,
    },
    boxShadow: theme.palette.type === 'light' ? '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)' : '0 14px 28px rgba(0,0,0,0.85), 0 10px 10px rgba(0,0,0,0.82)',
  },
  completed: {
    backgroundColor: theme.palette.primary.main,
    transition: 'all 0.6s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white,
    },
  }
}));

export default function ColourStepIcon(props) {
  const classes = useColorStepIconStyles();
  const {active, completed, index, icon} = props;

  return (
    <div className={clsx(classes.root, {[classes.active]: active === index, [classes.completed]: completed})}>
      {/*{!completed ? (icon) : (<FontAwesomeIcon icon={faCheck} size="2x"/>)}*/}
      {icon}
    </div>
  );
};