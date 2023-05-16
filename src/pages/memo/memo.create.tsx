import React, {ChangeEvent} from 'react';
import {collection, addDoc} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {ref, getDownloadURL, uploadBytes} from "firebase/storage"
import './memo.css'
import {useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";

function MemoCreate() {
  const {updateMemoList} = useOutletContext<{ updateMemoList: Function }>();
  const uid = localStorage.getItem('uid')!
  const [memoTitle, setMemoTitle] = React.useState("")
  const [memoContents, setMemoContents] = React.useState("")
  const navigate = useNavigate()
  const [imageUpload, setImageUpload] = React.useState<File>()
  const [image, setImage] = React.useState("");

  React.useEffect(() => {
    const imageRef = ref(storage, `image/${imageUpload?.name}`);
    if (!imageUpload) return;
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImage(url);
        console.log(url,'url');
        console.log(image,'image')
      });
    });
  }, [imageUpload]);


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

  const onChangeContent = (event: any) => {
    const inputDiv = event.target as HTMLDivElement;
    const inputText = inputDiv.innerHTML;
    const inputTitleText = inputDiv.innerText;
    const textLineList = inputTitleText.split("\n");
    const forTitle = textLineList.filter(item => item.length !== 0)
    setMemoTitle(forTitle[0]);
    setMemoContents(inputText)

  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const keepFile = {...file}
    // const test1 = {...file}
    // const test2 = {...e.target.files}
    // const test3 = {...file, ...e.target.files}
    // // console.log(keepFile, 'keepFile')
    // console.log(test1,'test1')
    // console.log(test2,'test2')
    // console.log(test3,'test3')
    // // e.target.files && setFile({ ... {file} , ...e.target.files})
    // e.target.files && setFile({...file, ...e.target.files})

    if (e.target.files) {
      setImageUpload(e.target.files[0])
    }

  }

  console.log(imageUpload, 'imageUpload')

  return (
    <div>
      <BackButton/>
      <input type="file" id='imageInput'
             accept="image/png, image/jpeg" multiple
             onChange={handleImageChange}
      />
      <div contentEditable className='memoPad' onInput={onChangeContent}>
      </div>

      <div onClick={() => createMemo()}>
        메모 등록하기
      </div>
    </div>

  );
}

export default MemoCreate;
