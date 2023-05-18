import React, {ChangeEvent} from 'react';
import {collection, addDoc} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {ref, getDownloadURL, uploadBytes} from "firebase/storage"
import './memo.css'
import '../../common/common.css'
import {useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";

function MemoCreate() {
  const {updateMemoList} = useOutletContext<{ updateMemoList: Function }>();
  const uid = localStorage.getItem('uid')!
  const [memoTitle, setMemoTitle] = React.useState("")
  const [memoContents, setMemoContents] = React.useState("")
  const navigate = useNavigate()
  const [imagesUpload, setImagesUpload] = React.useState<File[]>([])
  const [accessible, setAccessible] = React.useState(false)
  const [location, setLocation] = React.useState<number>(0)

  const selection: Selection | null = window.getSelection();
  const selectionToNumber = Number(selection)
  const seletedDiv = document.getElementById('tears')

  let imageUrlArray: string[] = []

  React.useEffect(() => {

    imagesUpload.forEach((imageUpload, index) => {
      if (!imageUpload) return;
      const imageRef = ref(storage, `image/${memoTitle}/${index}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {

          imageUrlArray.push(`<img src=${url}/>`)

          // const imgTest = imageUrlArray.map((item)=>item as HTMLImageElement)


          // const inputDiv = event.target as HTMLDivElement;
          // const inputText = inputDiv.innerHTML;

          console.log(imageUrlArray, 'imageArray')
        });
      });
    })
    seletedDiv && location && (
      seletedDiv.innerHTML = seletedDiv.innerHTML.slice(0, location) + imageUrlArray + seletedDiv.innerHTML.slice(location, 10))
    setAccessible(false)

  }, [imagesUpload])

  console.log(selectionToNumber, 'selectionToNumber')

  const createMemo = async () => {
    try {
      const docRef = await addDoc(collection(db, uid), {
        title: memoTitle,
        contents: memoContents,
        images: imageUrlArray
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
    e.target.files && setImagesUpload([...imagesUpload, ...Array.from(e.target.files)])

  }


  return (
    <div className='commonLayout'>
      <div className='commonLayoutPadding'>
        <BackButton/>
        <input type="file" id='imageInput'
               accept="image/png, image/jpeg" multiple
               onChange={handleImageChange}
               disabled={!accessible}
        />
        <div contentEditable className='memoPad' onInput={onChangeContent}
             onFocus={() => setAccessible(true)} onBlur={() => setLocation(selectionToNumber)}
             id='tears'
        >
        </div>
        <div onClick={() => createMemo()}>
          메모 등록하기
        </div>
      </div>
    </div>

  );
}

export default MemoCreate;
