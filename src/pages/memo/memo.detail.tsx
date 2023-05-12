import React from 'react';
import {collection, doc, getDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useLocation} from "react-router-dom";

function MemoDetail() {
  const [test, setTest] = React.useState('')
  const [memoTitle, setMemoTitle] = React.useState('')
  const [memoContents, setMemoContents] = React.useState('')
  console.log(test,'test')
  const location = useLocation();
  const uid = localStorage.getItem('uid')!

  React.useEffect(() => {
    getDocumentId().then(()=>{
      getDetailMemo().then()
    })
  }, [location])

  const getDocumentId = async () =>{
    try {
      const {pathname} = location;
      const splitPathName = pathname.split("/");
      const documentId = splitPathName[3]
      await setTest(documentId)
    } catch (e) { console.log(e,'error')}
  }

  const getDetailMemo = async () => {
    try {
      const docRef = doc(db, uid, test);
      const memoData = await getDoc(docRef);
      const memoDetail = memoData.data()
      setMemoTitle(memoDetail!['title'])
      setMemoContents(memoDetail!['contents'])
      console.log(memoDetail!['title'], '메모를가져오걸아 ')
    } catch (e) {
      console.log(e, 'e')
    }
  }

  console.log(memoTitle,memoContents)

  return (
    <div>
      <div>디테일페이지</div>
     <div>{memoTitle}</div>
      <div>{memoContents}</div>
    </div>
  );
}

export default MemoDetail;
