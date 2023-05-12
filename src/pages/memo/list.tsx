import React from 'react';
import {authFire} from "../../firebase";
import {signOut} from "firebase/auth";
import {Link, useNavigate, Outlet, useLocation} from "react-router-dom";
import {AuthContext} from "../../auth.context.provider";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import './list.css'
import BackButton from "../../common/back.button";

type MemoListType = {
  title: string,
  contents: string
  id: string
}[];

function List() {
  const isLoggedIn = React.useContext(AuthContext);
  const uid = localStorage.getItem('uid')!
  const [memoList, setMemoList] = React.useState<MemoListType>([])
  const location = useLocation();
  React.useEffect(() => {
    isLoggedIn && getMemos().then()
    console.log('리렌더링되길')
  }, [location])

  // 여기에 location을 넣으면 리렌더링 되어서 글 작성 직후에도 리렌더링이 되는데 그럼 그냥 글만 읽을지라도 리렌더링이 계속 되어서 성능에 안 좋을듯함

  React.useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.')
      navigate('/signin')
    }
  }, [])
  const [outlet, setOutlet] = React.useState(false);
  React.useEffect(() => {
    const {pathname} = location;
    const splitPathName = pathname.split("/");
    if (splitPathName.length > 2) setOutlet(true)
    else setOutlet(false)
  }, [location]);

  const navigate = useNavigate()
  const signOutButton = async () => {
    await signOut(authFire)
    localStorage.removeItem('uid')
    navigate('/signin')
  }

  const getMemos = async () => {
    const memoData = await getDocs(collection(db, uid));
    const newMemoData = memoData.docs.map((doc) => {
      const data = doc.data()
      return {
        title: data.title,
        contents: data.contents,
        id: doc.id
      }
    })
    setMemoList(newMemoData)

  }

  if (outlet) return <Outlet/>;
  if (!isLoggedIn) return <div>로그인이 필요한 페이지입니다.</div>

  return (
    <>
      <BackButton/>
      <div className='listMemoArea'>
        {memoList.map((item, index) => {
          return (
            <div key={index} className='listMemoEachLine' onClick={() => navigate(`detail/${item.id}`)}>
              {item.title}
              {item.id}
            </div>
          )
        })}
      </div>
      <div className='listMemoCreate' onClick={() => navigate(`write/write`)}>글쓰기 버튼</div>
      <div className='listMemoSignout' onClick={() => signOutButton()}>로그아웃</div>


    </>
  )


}

export default List;
