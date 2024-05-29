import React from 'react';
import {Button, Grid, Paper, Typography} from '@mui/material';

const Banner = () => {
  let header = "Social Computing Group";
  let welcomeMessage = "Welcome to the website of Social Computing Group";
  let description = "At the intersection of computer science and social science, we conduct applied research into intelligent data-intensive systems and their application in social media, technology-enhanced learning, and knowledge management domains."

  return (<>
    <Grid item xs>
      <Paper sx={{p: 8, borderRadius: 4, textAlign: "center", background: 'rgba(255,255,255,0.18)', color: "white"}}
             elevation={0}>

        <Typography variant="h4" gutterBottom>
          {header}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {welcomeMessage}
        </Typography>

        <Typography gutterBottom>
          {description}
        </Typography>

        <Grid container justifyContent="center" alignItems="center" spacing={2} style={{marginTop: 16}}>
          <Grid item>
            <Button variant="contained" color="primary"> Ongoing Projects </Button>
          </Grid>

          <Grid item>
            <Button variant="outlined" color="inherit">Our Publications</Button>
          </Grid>

        </Grid>
      </Paper>
    </Grid>
  </>);
}

export default Banner;
