import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { getUserQuestionsAndIndicators } from "../../../utils/redux/reducers/reducer";
import { scrollToTop } from "../../../utils/utils";
import MyQuestions from "./MyQuestions";

const GQIDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserQuestionsAndIndicators());
    scrollToTop();
  }, [dispatch]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <MyQuestions />
        </Grid>
      </Grid>
    </>
  );
};

export default GQIDashboard;
