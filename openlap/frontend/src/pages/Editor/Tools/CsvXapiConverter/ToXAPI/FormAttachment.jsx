import React, { useState } from "react";
import Property from "./Property";
import {
  Button,
  Checkbox, Grid, Paper, Typography,
  FormControlLabel
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import FormLanguageMap from "./FormLanguageMap";
import {
  setForm
} from "../../../../../utils/redux/reducers/csvxapiReducer";

const FormAttachment = (props) => {
  const { prefix, type, index } = props;

  const dispatch = useDispatch();
  const form = useSelector((state) => state.csvxapiReducer.form);
  const columnDefs = useSelector(
    (state) => state.csvxapiReducer.data.columnDefs
  );

  const [attachmentsDescription, setAttachmentsDescription] = useState(false);
  const handleAddAttachmentsDescription = () => {
    setAttachmentsDescription((prevState) => !prevState);
    let arr = form.attachments.array;
    arr[index].description = { ...form.attachments.array[index].description, selected: true }
    dispatch(
      setForm({
        ...form,
        attachments: {
          ...form.attachments,
          array: arr
        },
      })
    );
  };
  const handleRemoveAttachmentsDescription = () => {
    setAttachmentsDescription((prevState) => !prevState);
    let arr = form.attachments.array;
    arr[index].description = { ...form.attachments.array[index].description, selected: false }
    dispatch(
      setForm({
        ...form,
        attachments: {
          ...form.attachments,
          array: arr
        },
      })
    );
  };
  const [fileUrl, setFileUrl] = useState(false);
  const handleAddFileUrl = () => {
    setFileUrl((prevState) => !prevState);
    let arr = form.attachments.array;
    arr[index].fileUrl = { ...form.attachments.array[index].fileUrl, selected: true }
    dispatch(
      setForm({
        ...form,
        attachments: {
          ...form.attachments,
          array: arr
        },
      })
    );
  };
  const handleRemoveFileUrl = () => {
    setFileUrl((prevState) => !prevState);
    let arr = form.attachments.array;
    arr[index].fileUrl = { ...form.attachments.array[index].fileUrl, selected: false }
    dispatch(
      setForm({
        ...form,
        attachments: {
          ...form.attachments,
          array: arr
        },
      })
    );
  };

  const setGenerateSHA2 = (bool) => {

    let arr = form.attachments.array;
    arr[index].sha2 = { ...form.attachments.array[index].sha2, generateSHA2: bool }
    dispatch(
      setForm({
        ...form,
        attachments: {
          ...form.attachments,
          array: arr
        },
      })
    );
  };

  return (
    <>
              <Property
                columnDefs={columnDefs}
                name="attachments.usageType"
                desc="IRI, e.g. http://adlnet.gov/expapi/attachments/signature"
                index={index}
              />
          <Paper sx={{ overflowX: "auto" }}>
          <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                display
              </Typography>
              <FormLanguageMap
                columnDefs={columnDefs}
                name="attachments.display"
                index={index}
              />
              </Paper>
              <Property
                columnDefs={columnDefs}
                name="attachments.contentType"
                desc="internet media type, e.g. application/octet-stream"
                index={index}
              />
              <Property
                columnDefs={columnDefs}
                name="attachments.length"
                desc="integer, e.g. 4235"
                index={index}
              />
              <Property
                columnDefs={columnDefs}
                name="attachments.sha2"
                desc="SHA2 hash value, e.g. 672fa5fa658017f1b72d65036f13379c6ab05d4ab3b6664908d8acf0b6a0c634"
                index={index}
/>
              <FormControlLabel
                control={<Checkbox />}
                label="generateSHA2"
                onChange={(event) => setGenerateSHA2(event.target.checked)}
              />
              {attachmentsDescription ? (
                <>
                  <Grid>
                    <ClearIcon
                      fontSize="medium"
                      onClick={(event) => handleRemoveAttachmentsDescription()}
                    />
                    <Typography sx={{ pl: 1, pr: 3, pt: 1, pb: 2 }}>
                      description
                    </Typography>
                    <FormLanguageMap
                      columnDefs={columnDefs}
                      name="attachments.description"
                      index={index}
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              {fileUrl ? (
                <>
                  <ClearIcon
                    fontSize="medium"
                    onClick={(event) => handleRemoveFileUrl()}
                  />
                  <Property
                    columnDefs={columnDefs}
                    name="attachments.fileUrl"
                    desc="IRL, e.g. http://www.example.com/files/345256"
                    index={index}
                  />
                </>
              ) : (
                <></>
              )}

              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleAddAttachmentsDescription()}
                disabled={attachmentsDescription}
              >
                description
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={(event) => handleAddFileUrl()}
                disabled={fileUrl}
              >
                file url
              </Button>
    </>
  );
};

export default FormAttachment;
