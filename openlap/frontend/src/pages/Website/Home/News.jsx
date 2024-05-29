import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { news } from "../../../utils/data/news";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const News = () => {
  return (
    <>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {" "}
          Latest news{" "}
        </Typography>
        <Grid container>
          {news.map((updates, index) => {
            if (index < 3) {
              return (
                <Grid item sm={6} md={12} key={index}>
                  <Card elevation={0}>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{ width: 56, height: 56 }}
                          variant="rounded"
                          src={updates.img}
                        />
                      }
                      title={updates.title}
                      subheader={
                        <>
                          <Typography variant="body2">
                            {updates.date}
                          </Typography>
                          <Typography variant="body2">
                            {updates.description}
                          </Typography>
                        </>
                      }
                    />
                  </Card>
                </Grid>
              );
            } else return "";
          })}
        </Grid>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button endIcon={<ArrowForwardIcon />}>more news</Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default News;
