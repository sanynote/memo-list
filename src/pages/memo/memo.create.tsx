import React from 'react';
import {collection, addDoc} from "firebase/firestore";
import {db} from "../../firebase";
import './memo.create.css'
import {useNavigate} from "react-router-dom";
import BackButton from "../../common/back.button";

function MemoCreate() {
  const uid = localStorage.getItem('uid')!
  const [memoTitle, setMemoTitle] = React.useState("")
  const [memoContents, setMemoContents] = React.useState("")
  const navigate = useNavigate()

  const createMemo = async () => {
    try {
      const docRef = await addDoc(collection(db, uid), {
        title: memoTitle,
        contents: memoContents,
      });
      console.log("Document written with ID: ", docRef.id);
      navigate(`/list`)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  return (
    <div>
      <BackButton/>
      <div>
        <div><label>글 제목</label><input value={memoTitle} onChange={(e) => setMemoTitle(e.target.value)}/></div>
        <div><label>글 내용</label><input value={memoContents} onChange={(e) => setMemoContents(e.target.value)}/></div>
      </div>
      <div onClick={() => createMemo()}>
        메모 등록하기
      </div>
    </div>

  );
}

export default MemoCreate;
