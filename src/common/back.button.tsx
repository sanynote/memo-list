import React from 'react';
import {useNavigate} from "react-router-dom";

function BackButton() {
  const navigate = useNavigate()
  const backButton = () => {
    console.log('뒤로가기버튼')
    navigate(-1)
  }

  return (
    <div onClick={()=>backButton()}>
      뒤로가기버튼
    </div>
  );
}

export default BackButton;
