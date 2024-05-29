import React, { useEffect } from 'react';

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function Preview(props) {
  const { displayCodeData, scriptCodeData } = props;

  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = scriptCodeData;
    document.getElementById("root").appendChild(script);
    return () => {
      document.getElementById("root").removeChild(script);
    };
  }, [scriptCodeData]);

  const previewContainerStyle = {
    display: 'flex', 
    justifyContent: 'center', 
    padding: '16px'
  }

  return (
    <>
      <div style={{ ...previewContainerStyle }}>
        {displayCodeData}
      </div>
    </>
  );
}
