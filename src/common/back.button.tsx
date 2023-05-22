import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as BackArrow} from "../assets/back_arrow.svg";

function BackButton() {
  const location = useLocation();

  React.useEffect(() => {
    const {pathname} = location;
    const splitPathName = pathname.split("/");

    if (splitPathName.length > 2) {
      setIsWriting(true)
    } else setIsWriting(false)


  }, [location]);

  const [isWriting, setIsWriting] = React.useState(false)
  const navigate = useNavigate()
  const backButton = () => {
    isWriting ? navigate('/list') : navigate('/signin')
  }

  return (
    <div className='backButton'>
      <BackArrow onClick={() => backButton()}/>
    </div>
  );
}

export default BackButton;
