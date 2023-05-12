import React from 'react';
import {collection, doc, getDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useLocation, useNavigate} from "react-router-dom";
import BackButton from "../../common/back.button";

function MemoDetail() {
  const [test, setTest] = React.useState('')
  const [memoTitle, setMemoTitle] = React.useState('')
  const [memoContents, setMemoContents] = React.useState('')
  const navigate = useNavigate()
  console.log(test, 'test')
  const location = useLocation();
  const uid = localStorage.getItem('uid')!

  React.useEffect(() => {
    getDocumentId().then(() => {
      getDetailMemo().then()
    })
  }, [location])

  const getDocumentId = async () => {
    try {
      const {pathname} = location;
      const splitPathName = pathname.split("/");
      const documentId = splitPathName[3]
      await setTest(documentId)
    } catch (e) {
      console.log(e, 'error')
    }
  }

  const getDetailMemo = async () => {
    try {
      const docRef = doc(db, uid, 'qrQkqowtP7BdtKEXEnVG');
      const memoData = await getDoc(docRef);
      const memoDetail = memoData.data()
      setMemoTitle(memoDetail!['title'])
      setMemoContents(memoDetail!['contents'])
      console.log(memoDetail!['title'], '메모를가져오걸아 ')
    } catch (e) {
      console.log(e, 'e')
    }
  }

  console.log(memoTitle, memoContents)

  const updateMemo = async ()=>{
    try{

      const updateMemo = doc(db, uid, test);
      await updateDoc(updateMemo,{title:memoTitle,contents:memoContents});
      navigate(`/list`)
      console.log('메모 수정 성공')

    }catch (e) {
      console.log(e, '메모 수정 실패')
    }
  }

  const removeMemo = async () => {
    try {
      const detailDoc = doc(db, uid, test);
      await deleteDoc(detailDoc);
      navigate(`/list`)
      console.log('메모 삭제 성공')
    } catch (e) {
      console.log(e, '메모 삭제 실패')
    }
  }

  return (
    <div>
      <BackButton/>
      <div>디테일페이지</div>
      <input value={memoTitle} onChange={(e)=>setMemoTitle(e.target.value)}/>
      <input value={memoContents} onChange={(e)=>setMemoContents(e.target.value)}/>
      {/*<div>{memoTitle}</div>*/}
      {/*<div>{memoContents}</div>*/}
      <div onClick={() => updateMemo()}>메모 수정 버튼</div>
      <div onClick={() => removeMemo()}>메모 삭제 버튼</div>
    </div>
  );
}

export default MemoDetail;
