import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { team } from "../../../utils/data/team";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Team = () => {
  return (
    <>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {" "}
          Team{" "}
        </Typography>
        <Grid container>
          {team.map((person, index) => {
            return (
              <Grid item sm={6} md={12} key={index}>
                <Card elevation={0}>
                  <CardActionArea onClick={() => window.open(person.link)}>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ width: 56, height: 56 }}
                          src={person.img}
                        />
                      }
                      title={person.name}
                      subheader={person.email}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button endIcon={<ArrowForwardIcon />}>view more</Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Team;
