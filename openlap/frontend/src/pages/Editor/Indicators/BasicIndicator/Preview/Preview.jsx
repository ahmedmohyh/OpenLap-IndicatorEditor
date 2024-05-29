import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function Preview(props) {
  const { displayCodeData, scriptCodeData } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = scriptCodeData;
    document.getElementById("root").appendChild(script);
    return () => {
      document.getElementById("root").removeChild(script);
    };
  }, [scriptCodeData]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
        {displayCodeData}
      </div>
    </>
  );
}
