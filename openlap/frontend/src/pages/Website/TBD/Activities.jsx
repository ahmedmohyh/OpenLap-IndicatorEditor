import React, {useState} from 'react';
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import {activities} from "../../../utils/utils";

const Activities = () => {
  const [hover, setHover] = useState(null);

  return (
    <>
      <Grid item xs>
        <Typography variant="h5" style={{marginBottom: 16}}>
          Activities
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {activities.map((activity, index) => {
            return (
              <Grid item xs={12} sm={6} lg={4}>
                <Card raised={hover === index} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
                  <CardMedia sx={{height: 280}} image={activity.img}
                  />
                  <CardContent>
                    {/* 3. Typography of "variant" "body1" and color "textSecondary" and wrap around "activity.description" */}
                    <Typography variant="body1" color="textSecondary">
                      {activity.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Grid container justifyContent="flex-end">
                      {/* 4. A button and wrap around "activity.buttonLabel" */}
                      <Button> {activity.buttonLabel} </Button>
                      {/* Task 3: End*/}
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </>
  );
}

export default Activities;
