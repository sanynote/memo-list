import React from 'react';
import {collection, addDoc} from "firebase/firestore";
import {db} from "../../firebase";
import './memo.css'
import {useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";

function MemoCreate() {
  const { updateMemoList } = useOutletContext<{ updateMemoList: Function }>();
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
      updateMemoList()
      navigate(`/list`)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const onChangeContent = (event:any) => {
    const textArea = event.target as HTMLTextAreaElement;
    const inputText = textArea.value;
    const textLineList = inputText.split("\n");
    const forTitle = textLineList.filter(item => item.length !== 0)
    setMemoTitle(forTitle[0]);
    setMemoContents(inputText)

  };

  return (
    <div>
      <BackButton/>
      <div>
        <textarea onChange={onChangeContent} className='memoPad'/>
      </div>
      <div onClick={() => createMemo()}>
        메모 등록하기
      </div>
    </div>

  );
}

export default MemoCreate;
