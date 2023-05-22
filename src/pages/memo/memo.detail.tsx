import React, {ChangeEvent} from 'react';
import {doc, getDoc, deleteDoc, updateDoc, query, where, collection} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";
import imageCompression from "browser-image-compression";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

interface SystemError {
  code: string;
}

function MemoDetail() {
  const {updateMemoList, memoListId} = useOutletContext<{ updateMemoList: Function; memoListId:string[] }>();
  const [documentId, setDocumentId] = React.useState('')
  const [memoTitle, setMemoTitle] = React.useState('')
  const [memoContents, setMemoContents] = React.useState('')
  const [memoTotal, setMemoTotal] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate()
  const location = useLocation();
  const uid = localStorage.getItem('uid')!
  const [imagesUpload, setImagesUpload] = React.useState<File[]>([])

  React.useEffect(() => {
    getDocumentId()
  }, [])

  React.useEffect(() => {
    getDetailMemo().then()
  }, [documentId])

  const getDocumentId = () => {
    const {pathname} = location;
    const splitPathName = pathname.split("/");
    const documentId = splitPathName[3]
    setDocumentId(documentId)
  }

  const getDetailMemo = async () => {
    if(!documentId) return ;
    // const coll = collection(db, uid);
    // const citiesRef = collection(db, uid);
    // const q = query(citiesRef, where(documentId, "==", "CA"));
    // console.log(coll,'qqq',documentId)
    console.log(memoListId,'memoListId')

    setIsLoading(true)

    try {
      const docRef = doc(db, uid, documentId);
      console.log(docRef.id,'qqq')
      const memoData = await getDoc(docRef);
      const memoDetail = memoData.data()
      if (memoDetail === undefined) return;
      setMemoTitle(memoDetail.title)
      setMemoContents(memoDetail.contents)
      setMemoTotal(memoDetail.contents)
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      console.log(errorCode, '메모디테일에러')
    } finally {
      setIsLoading(false)
      console.log('파이널리')

    }
  }

  React.useEffect(() => {

    if (imagesUpload.length === 0) return;

    const memoDiv = document.getElementById("modifyDiv");
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
    uploadAndAppendImage();
  }, [imagesUpload])

  const updateMemo = async () => {
    if (!memoTitle) return alert('텍스트 입력은 필수입니다.');
    try {
      const updateMemo = doc(db, uid, documentId);
      await updateDoc(updateMemo, {title: memoTitle, contents: memoContents});
      await updateMemoList()
      navigate(`/list`)
      console.log('메모 수정 성공')

    } catch (e) {
      console.log(e, '메모 수정 실패')
    }
  }

  const deleteMemo = async () => {
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


  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className='commonLayout'>
      <div className='commonLayoutPadding'>
        <BackButton/>
        <div>디테일페이지</div>
        <input type="file" id='imageInput'
               accept="image/png, image/jpeg" multiple
               onChange={handleImageChange}
        />
        <div id="modifyDiv" contentEditable className='memoPad' dangerouslySetInnerHTML={{__html: memoTotal}}
             onInput={onChangeContent}/>
        <div onClick={() => updateMemo()}>메모 수정 버튼</div>
        <div onClick={() => deleteMemo()}>메모 삭제 버튼</div>
      </div>
    </div>
  );
}

export default MemoDetail;
