import { Checkbox, FormControlLabel } from "@mui/material";
import iframeSizeUpdater from "../../../../Helper/resizeIframe";
import SelectHelperAlert from "../../../../Common/SelectHelperAlert/SelectHelperAlert";

//importing react useState #7
import React, { useState } from 'react';


/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function IndicatorPreviewCard(props) {
    const { preview, isDisabled, compatibleErrorMsg, handleChange } = props;
    //
    const [styleProperty, setStyleProperty] = useState({
        minHeight: '100%',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 5px 1px #C9C9C9',
        padding: '16px',
        borderRadius: '4px',
        isSelected: false,
    });
//////#7

    const cardStyle = {
        position: 'relative',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    };
    //TODO: remove this later on and switch it with the computed state above in line 13 
    const contentStyle = {
        minHeight: '100%',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 5px 1px #C9C9C9',
        padding: '16px',
        borderRadius: '4px',
    };

    const labelStyle = {
        fontSize: '14px',
        color: '#5F6368',
    };

    const nameStyle = {
        fontSize: '16px',
        color: '#000',
        margin: '4px 0 16px 0',
    };

    const checkboxContainerStyle = {
        display: 'flex',
        justifyContent: 'end',
    };

    const incompabilityContainerStyle = {
        position: 'absolute', 
        height: '100%', 
        width: '100%', 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center'
    }

    //TODO: find a way to destruct the state instead of returning the colour back to white AND remove the unnecessary logs 
    // Find the correct property of giving the card a border and not just chaning the colour 
    const foobar = () => {
        console.log("hi there from whatever");
        styleProperty.isSelected ? setStyleProperty({
            ...styleProperty,
            backgroundColor : "#fff",
            isSelected : false,
        }) : setStyleProperty({
            ...styleProperty,
            backgroundColor : "#a102e7",
            isSelected : true,
        });
        console.log(JSON.stringify(styleProperty));
    };

    const wrapperFunction = () => {
        handleChange();
        foobar();
    }

    return (
        <div style={cardStyle}>
            <div style={styleProperty}>
                <div style={labelStyle}>Name:</div>
                <div style={nameStyle}>{preview.name}</div>
                <div dangerouslySetInnerHTML={{ __html: iframeSizeUpdater(preview.indicatorRequestCode, 248, 248) }}></div>
                <div style={checkboxContainerStyle}>
                    <FormControlLabel
                        value="start"
                        control={
                            <Checkbox
                                checked={undefined} // Consider using a controlled checkbox 
                                onChange={wrapperFunction}
                                disabled={isDisabled}
                                name={`${preview.id}@${preview.analyticsMethodId}`}
                                color="primary"
                            />
                        }
                        label="Select"
                        labelPlacement="start"
                    />
                </div>
            </div>
            {isDisabled && (
                <div style={{ ...contentStyle, ...incompabilityContainerStyle }}>
                    <SelectHelperAlert type="warning" size={16} content={<div><strong>Not compatible</strong><br /><span>{compatibleErrorMsg}.</span></div>} />
                </div>
            )}
        </div> 
    );
};