import React, { useState } from "react";
import CSVPreview from "./CSVPreview";

const ToCSV = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  return (
    <>
      <CSVPreview />
    </>
  );
};

export default ToCSV;
