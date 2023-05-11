import React from 'react';
import {Outlet, useLocation} from "react-router-dom";

function MemoDetail() {
//   const location = useLocation();
// React.useEffect(()=>{
//   console.log('메모디테일 그려짐')
// },[])
//   React.useEffect(() => {
//     console.log(location.pathname);
//   }, [location]);
  return (
    <>

    <div>디테일페이지</div>
    <Outlet/>
    </>
  );
}

export default MemoDetail;
