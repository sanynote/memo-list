import React, {ChangeEvent} from 'react';
import {collection, addDoc} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {ref, getDownloadURL, uploadBytes} from "firebase/storage"
import './memo.css'
import '../../common/common.css'
import {useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";
import imageCompression from "browser-image-compression";

function MemoCreate() {
  const {updateMemoList} = useOutletContext<{ updateMemoList: Function }>();
  const uid = localStorage.getItem('uid')!
  const [memoTitle, setMemoTitle] = React.useState("")
  const [memoContents, setMemoContents] = React.useState("")
  const navigate = useNavigate()
  const [imagesUpload, setImagesUpload] = React.useState<File[]>([])

  React.useEffect(() => {

    if (imagesUpload.length === 0) return;

    const memoDiv = document.getElementById("createDiv");
    if (!memoDiv) return;

    const selection = window.getSelection();
    const focusNode = selection?.focusNode;
    const isAppendLast =
      !focusNode ||
      (focusNode !== memoDiv &&
        focusNode.parentElement !== memoDiv &&
        focusNode.parentElement?.parentElement !== memoDiv);

    const uploadAndAppendImage = async () => {
      if (!memoDiv) return;

      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 500
      }

      const imageTagArray: HTMLImageElement[] = await Promise.all(
        imagesUpload
          .filter((imageFile) => imageFile)
          .map(async (imageFile, index) => {

            const compressedFile = await imageCompression(imageFile, options);

            const imageRef = ref(
              storage,
              `image/${window.crypto.randomUUID()}/${index}`
            );
            const snapshot = await uploadBytes(imageRef, compressedFile);
            const url = await getDownloadURL(snapshot.ref);
            const imgTag = document.createElement("img");
            imgTag.setAttribute("src", url);
            imgTag.setAttribute("width", '250');
            imgTag.setAttribute("height", '250');
            return imgTag;
          })
      );

      if (isAppendLast) {
        imageTagArray.forEach((imageTag) => memoDiv.appendChild(imageTag));
      } else {
        imageTagArray
          .reverse()
          .forEach((imageTag) => (focusNode as HTMLElement).after(imageTag));
      }

      const imageInputElement = document.getElementById("imageInput");
      if (imageInputElement instanceof HTMLInputElement) {
        imageInputElement.value = "";
      }

      setImagesUpload([]);
    }
    uploadAndAppendImage().then();
  }, [imagesUpload])


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

  const onChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
    const inputDiv = event.target as HTMLDivElement;
    const inputText = inputDiv.innerHTML;
    const inputTitleText = inputDiv.innerText;
    const textLineList = inputTitleText.split("\n");
    const forTitle = textLineList.filter(item => item.length !== 0)
    setMemoTitle(forTitle[0]);
    setMemoContents(inputText)

  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files && setImagesUpload([...Array.from(e.target.files)])

  }


  return (
    <div className='commonLayout'>
      <div className='commonLayoutPadding'>
        <BackButton/>
        <input type="file" id='imageInput'
               accept="image/png, image/jpeg" multiple
               onChange={handleImageChange}
        />
        <div contentEditable className='memoPad' onInput={onChangeContent}
             id='createDiv'
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
