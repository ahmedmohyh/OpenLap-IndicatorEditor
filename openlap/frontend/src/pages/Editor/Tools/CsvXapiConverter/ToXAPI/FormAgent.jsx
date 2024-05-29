import React, { useState } from "react";
import Property from "./Property";
import {
  Checkbox,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import HelpIcon from "@mui/icons-material/Help";
// import {
//   setForm
// } from "../../../../utils/redux/reducers/csvxapiReducer";

import { setForm } from "../../../../../utils/redux/reducers/csvxapiReducer";

const FormAgent = (props) => {
  const { prefix, type, index } = props;

  const dispatch = useDispatch();
  const form = useSelector((state) => state.csvxapiReducer.form);
  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );

  const ifiOptions = [
    ["mbox", 1],
    ["mbox_sha1sum", 2],
    ["openid", 3],
    ["account", 4],
  ];
  const [ifi, setIfi] = useState("");

  const handleIFISelected = (val) => {
    setIfi(val);
    let arr = [];
    switch (prefix) {
      case "actor":
        dispatch(setForm({ ...form, actor: { ...form.actor, ifi: val } }));
        break;
      case "instructor":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: { ...form.context.instructor, ifi: val },
            },
          })
        );
        break;
      case "actor.members":
        arr = form.actor.members.array;
        arr[index].ifi = val;
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              members: { ...form.actor.members, array: arr },
            },
          })
        );
        break;
      case "instructor.members":
        arr = form.context.instructor.members.array;
        arr[index].ifi = val;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { ...form.context.members, array: arr },
              },
            },
          })
        );
        break;
      case "team.members":
        arr = form.context.members.array;
        arr[index].ifi = val;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { ...form.context.members, array: arr },
            },
          })
        );
        break;
      default:
    }
  };

  const setGenerateSHA1 = (bool) => {
    alert(bool);
    let arr = [];
    let arr2 = [];
    switch (type) {
      case "actor":
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              mbox_sha1sum: {
                ...form.actor.mbox_sha1sum,
                generateSHA1: bool,
              },
            },
          })
        );
        break;
      case "instructor":
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                mbox_sha1sum: {
                  ...form.context.instructor.mbox_sha1sum,
                  generateSHA1: bool,
                },
              },
            },
          })
        );
        break;
      case "actor.members":
        arr = form.actor.members.array;
        arr[index].mbox_sha1sum.generateSHA1 = bool;
        dispatch(
          setForm({
            ...form,
            actor: {
              ...form.actor,
              members: { ...form.actor.members, array: arr },
            },
          })
        );
        break;
      case "instructor.members":
        arr = form.context.instructor.members.array;
        arr[index].mbox_sha1sum.generateSHA1 = bool;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              instructor: {
                ...form.context.instructor,
                members: { ...form.context.members, array: arr },
              },
            },
          })
        );
        break;
      case "team.members":
        arr = form.context.members.array;
        arr[index].mbox_sha1sum.generateSHA1 = bool;
        dispatch(
          setForm({
            ...form,
            context: {
              ...form.context,
              members: { ...form.context.members, array: arr },
            },
          })
        );
        break;
      default:
    }
  };

  return (
    <>
      <Property
        columnDefs={columnDefs}
        name={prefix + ".name"}
        desc="Full name of Agent, e.g. John Doe"
        type={type}
        index={index}
      />
      <Paper sx={{ overflowX: "auto" }}>
        <Grid sx={{ pb: 2 }}>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
            IFI
            <Tooltip
              title="Inverse Functional Identifier"
              arrow
              placement="right-start"
            >
              <IconButton size="small">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <FormControl sx={{ width: 200, pl: 3 }} size="small">
            <InputLabel sx={{ pl: 3 }}>Select IFI</InputLabel>
            <Select
              label="Select IFI"
              value={ifi}
              onChange={(event) => handleIFISelected(event.target.value)}
            >
              {ifiOptions.map(([option, index]) => {
                return (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        {ifi === "account" ? (
          <>
            <Grid>
              <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                account
              </Typography>
            </Grid>
            <Grid sx={{ pb: 2, pl: 3, pr: 3 }}>
              <Property
                columnDefs={columnDefs}
                name={prefix + ".account.name"}
                desc="log in ID, e.g.1234"
                type={type}
                index={index}
              />
              <Property
                columnDefs={columnDefs}
                name={prefix + ".account.homepage"}
                desc="IRL, e.g. https://www.hompage.com"
                type={type}
                index={index}
              />
            </Grid>
          </>
        ) : ifi === "mbox" ? (
          <>
            <Property
              columnDefs={columnDefs}
              name={prefix + ".mbox"}
              desc="mailto IRI, e.g. mailto:name@example.com"
              type={type}
              index={index}
            />
          </>
        ) : ifi === "mbox_sha1sum" ? (
          <>
            <Property
              columnDefs={columnDefs}
              name={prefix + ".mbox_sha1sum"}
              desc="SHA1 hash value of a mailto email address (mailto:name@example.com), e.g. 18be9c1adaf3174f42b7bbad735aa9382076fad6"
              type={type}
              index={index}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="generateSHA1"
              onChange={(event) => setGenerateSHA1(event.target.checked)}
            />
          </>
        ) : ifi === "openid" ? (
          <>
            <Property
              columnDefs={columnDefs}
              name={prefix + ".openid"}
              desc="URI, e.g. https://name.example.com"
              type={type}
              index={index}
            />{" "}
          </>
        ) : (
          <></>
        )}
      </Paper>
    </>
  );
};

export default FormAgent;
