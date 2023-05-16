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
  const [memoTotal,setMemoTotal] = React.useState('')
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
      if (memoDetail === undefined) return;
      setMemoTitle(memoDetail.title)
      setMemoContents(memoDetail.contents)
      setMemoTotal( memoDetail.contents)
      setIsLoading(false)
    } catch (e) {
      console.log(e, 'e')
    }
  }

  const updateMemo = async ()=> {
    try{
      const updateMemo = doc(db, uid, documentId);
      await updateDoc(updateMemo,{title:memoTitle,contents:memoContents});
      await updateMemoList()
      navigate(`/list`)
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

  const onChangeContent = (event:any) => {
    const inputDiv = event.target as HTMLDivElement;
    const inputText = inputDiv.innerHTML;
    const inputTitleText = inputDiv.innerText;
    const textLineList = inputTitleText.split("\n");
    const forTitle = textLineList.filter(item => item.length !== 0)
    setMemoTitle(forTitle[0]);
    setMemoContents(inputText)
  };


  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <BackButton/>
      <div>디테일페이지</div>
      <div id="abc" contentEditable className='memoPad' dangerouslySetInnerHTML={{ __html: memoTotal }} onInput={onChangeContent} />
      <div onClick={() => updateMemo()}>메모 수정 버튼</div>
      <div onClick={() => removeMemo()}>메모 삭제 버튼</div>
    </div>
  );
}

export default MemoDetail;
