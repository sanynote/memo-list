import React from 'react';
import {useNavigate} from "react-router-dom";
import {ReactComponent as WriteButton} from "../assets/write_button.svg";

function CreateButton() {
  const navigate = useNavigate();
  return (
    <div className='listMemoCreate' onClick={() => navigate(`write/write`)}><WriteButton/></div>
  );
}

export default CreateButton;
