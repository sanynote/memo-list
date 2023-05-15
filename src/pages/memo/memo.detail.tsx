import React from 'react';
import {doc, getDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";

function MemoDetail() {
  const { updateMemoList } = useOutletContext<{ updateMemoList: Function }>();
  const [documentId, setDocumentId] = React.useState('')
  const [memoTitle, setMemoTitle] = React.useState('')
  const [memoContents, setMemoContents] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate()
  const location = useLocation();
  const uid = localStorage.getItem('uid')!

  React.useEffect(()=>{
    getDocumentId()
  },[])

  React.useEffect(()=>{
    getDetailMemo().then()
  },[documentId])

  const getDocumentId = () => {
      const {pathname} = location;
      const splitPathName = pathname.split("/");
      const documentId = splitPathName[3]
      setDocumentId(documentId)
    }

  const getDetailMemo = async () => {
    try {
      setIsLoading(true)
      const docRef = doc(db, uid, documentId);
      const memoData = await getDoc(docRef);
      const memoDetail = memoData.data()
      setMemoTitle(memoDetail!['title'])
      setMemoContents(memoDetail!['contents'])
      setIsLoading(false)
    } catch (e) {
      console.log(e, 'e')
    }
  }

  const updateMemo = async ()=>{
    try{
      // setIsLoading(true)
      const updateMemo = doc(db, uid, documentId);
      await updateDoc(updateMemo,{title:memoTitle,contents:memoContents});
      updateMemoList(true)
      navigate(`/list`)
      // setIsLoading(false)
      console.log('메모 수정 성공')

    }catch (e) {
      console.log(e, '메모 수정 실패')
    }
  }

  const removeMemo = async () => {
    try {
      const detailDoc = doc(db, uid, documentId);
      await deleteDoc(detailDoc);
      updateMemoList()
      navigate(`/list`)
      console.log('메모 삭제 성공')
    } catch (e) {
      console.log(e, '메모 삭제 실패')
    }
  }
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <BackButton/>
      <div>디테일페이지</div>
      <input value={memoTitle} onChange={(e)=>setMemoTitle(e.target.value)}/>
      <input value={memoContents} onChange={(e)=>setMemoContents(e.target.value)}/>
      <div onClick={() => updateMemo()}>메모 수정 버튼</div>
      <div onClick={() => removeMemo()}>메모 삭제 버튼</div>
    </div>
  );
}

export default MemoDetail;
