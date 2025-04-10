import { Avatar, Button as MuiButton, Typography } from "@mui/material";
import propTypes from 'prop-types'
import { grey } from "@mui/material/colors";
import {
  CloudUpload as MuiCloudUpload,
  Delete as MuiDelete,
} from "@mui/icons-material";
import { spacing } from "@mui/system";
import React, { createRef, useState } from "react";
import styled from "styled-components";

const Button = styled(MuiButton)(spacing);
const UploadIcon = styled(MuiCloudUpload)(spacing);
const DeleteIcon = styled(MuiDelete)(spacing);

const CenteredContent = styled.div`
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin: 0 auto 2px;
  ${({ $withBorder }) =>
    $withBorder &&
    `border: 1px solid ${grey[500]};
     box-shadow: 0 0 1px 0 ${grey[500]} inset, 0 0 1px 0 ${grey[500]};`}
`;

const AvatarUpload = ({changeImage, url}) => {
  const [image, _setImage] = useState(null);
  const inputFileRef = createRef(null);

  const cleanup = () => {
    URL.revokeObjectURL(image);
    inputFileRef.current.value = null;
  };

  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleOnChange = (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
    changeImage(event);
  };

  /**
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  const handleClick = (event) => {
    if (image) {
      event.preventDefault();
      setImage(null);
    }
  };

  return (
    <CenteredContent>
      <BigAvatar
        $withBorder
        alt="Avatar"
        src={image || url}
        imgProps={{
          style: {
            maxHeight: "50%",
            maxWidth: "50%",
            objectFit: "cover",
          },
        }}
      />
      <input
        ref={inputFileRef}
        accept="image/*"
        hidden
        id="avatar-image-upload"
        type="file"
        onChange={handleOnChange}
      />
      <label htmlFor="avatar-image-upload">
        <Button
          variant="contained"
          color="primary"
          component="span"
          mb={2}
          onClick={handleClick}
        >
          {image ? <DeleteIcon mr={2} /> : <UploadIcon mr={2} />}
          {image ? "Limpar" : "Upload"}
        </Button>
      </label>
    </CenteredContent>
  );
};
AvatarUpload.propTypes = {
  changeImage: propTypes.func,
  url: propTypes.string
}
export default AvatarUpload;