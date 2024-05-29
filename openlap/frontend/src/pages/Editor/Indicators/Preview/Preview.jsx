import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, CardHeader, Grid, Typography} from "@mui/material";

const Preview = (props) => {
  const {viz: {name, objectData, scriptData}, card} = props;
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = scriptData;
    document.getElementById("root").appendChild(script);
    return () => {
      document.getElementById("root").removeChild(script);
    };
  }, [scriptData]);

  return (
    <>
      <Grid item sx={{m: 4}}>
        {card ? <Card raised={hover} onMouseEnter={() => setHover(!hover)} onMouseLeave={() => setHover(!hover)}
                      sx={{borderRadius: 1}}>
          <CardHeader title={<Typography gutterBottom variant="h6"> {name} </Typography>}/>
          <CardContent sx={{backgroundColor: "common.white"}}>
            {objectData}
          </CardContent>
        </Card> : <Box sx={{backgroundColor: "common.white", borderRadius: 12, p: 0}}> {objectData} </Box>}
      </Grid>
    </>
  );
}

export default Preview;
