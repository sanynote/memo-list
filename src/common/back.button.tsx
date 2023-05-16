import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as BackArrow} from "../assets/back_arrow.svg";
import {ReactComponent as Dot} from "../assets/dot.svg";

function BackButton() {
  const location = useLocation();
  const [lastName, setLastName] = React.useState('')
  React.useEffect(() => {
    const {pathname} = location;
    const splitPathName = pathname.split("/");

    if (splitPathName.length > 2) {setIsWriting(true)
    setLastName(splitPathName[2])}
    else setIsWriting(false)


  }, [location]);
// console.log(lastName,'lastName')
  const [isWriting, setIsWriting] = React.useState(false)
  const navigate = useNavigate()
  const backButton = () => {
    console.log('뒤로가기버튼')
    navigate(-1)
  }

  const fix = () => {
    if (lastName === 'detail') {

    } else {

    }
  }

  return (
    <div>
      <BackArrow onClick={() => backButton()} style={{backgroundColor: 'red'}}/>
      {isWriting ? (
        <>
          <Dot/>
          <span onClick={()=> fix()}>완료</span>
        </>
      ) : null}
    </div>
  );
}

export default BackButton;
