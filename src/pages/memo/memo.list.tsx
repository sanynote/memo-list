import React from 'react';
import {useNavigate, Outlet, useLocation} from "react-router-dom";
import {AuthContext} from "../../auth.context.provider";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase";
import './memo.css'
import BackButton from "../../common/back.button";
import {ReactComponent as WriteButton} from "../../assets/write_button.svg";

type MemoListType = {
  title: string,
  contents: string
  id: string
}[];

function MemoList() {
  const isLoggedIn = React.useContext(AuthContext);
  const uid = localStorage.getItem('uid')!
  const [isLoading, setIsLoading] = React.useState(true);
  const [memoList, setMemoList] = React.useState<MemoListType>([])
  const location = useLocation();

  React.useEffect(() => {
    isLoggedIn && getMemos(true).then()
  }, [])

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

  const updateMemoList = () => {
    return getMemos(false)
  }


  const navigate = useNavigate()

  const getMemos = async (isLoading: boolean) => {
    if (isLoading) setIsLoading(true);
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
    if (isLoading) setIsLoading(false);
  }

  if (outlet) return <Outlet context={{updateMemoList}}/>;
  if (!isLoggedIn) return <div>로그인이 필요한 페이지입니다.</div>
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className='commonLayout'>
      <div className='commonLayoutPadding'>
        <BackButton/>
        <div className='listMemoArea'>
          {memoList.map((item, index) => {
            return (
              <div key={index} className='listMemoEachLine' onClick={() => navigate(`detail/${item.id}`)}>
                {item.title}
              </div>
            )
          })}
        </div>
        <div className='listMemoCreate'><WriteButton style={{backgroundColor: 'blue'}}
                                                     onClick={() => navigate(`write/write`)}/></div>

      </div>
    </div>
  )


}

export default MemoList;
