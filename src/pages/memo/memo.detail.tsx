import React, {ChangeEvent} from 'react';
import {doc, getDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
import BackButton from "../../common/back.button";
import imageCompression from "browser-image-compression";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {serverCheck} from "../../function/server.check.func";
import {SystemError} from "../../interface/error.interface";

function MemoDetail() {
  const {updateMemoList} = useOutletContext<{ updateMemoList: Function }>();
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
    if (!documentId) return;

    setIsLoading(true)

    try {
      serverCheck()
      const docRef = doc(db, uid, documentId);
      console.log(docRef.id, 'qqq')
      const memoData = await getDoc(docRef);
      const memoDetail = memoData.data()
      if (memoDetail === undefined) {
        alert('존재하지 않는 메모입니다.');
        navigate('/list')
        return;
      }
      setMemoTitle(memoDetail.title)
      setMemoContents(memoDetail.contents)
      setMemoTotal(memoDetail.contents)
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      if (errorCode === 'auth/network-request-failed') {
        alert('네트워크 연결에 실패했습니다. 와이파이 연결을 확인해주세요')
      } else {
        alert('알 수 없는 에러로 메모 읽어오기에 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
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
      setMemoContents(memoDiv.innerHTML);
      setImagesUpload([]);
    }
    uploadAndAppendImage().then();
  }, [imagesUpload])

  const updateMemo = async () => {
    if (!memoTitle) return alert('텍스트 입력은 필수입니다.');
    try {
      serverCheck()
      const updateMemo = doc(db, uid, documentId);
      await updateDoc(updateMemo, {title: memoTitle, contents: memoContents});
      await updateMemoList()
      navigate(`/list`)
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      if (errorCode === 'auth/network-request-failed') {
        alert('네트워크 연결에 실패했습니다. 와이파이 연결을 확인해주세요')
      } else {
        alert('알 수 없는 에러로 메모 수정에 실패했습니다.')
      }
    }
  }

  const deleteMemo = async () => {
    try {
      serverCheck()
      const detailDoc = doc(db, uid, documentId);
      await deleteDoc(detailDoc);
      updateMemoList()
      navigate(`/list`)
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      if (errorCode === 'auth/network-request-failed') {
        alert('네트워크 연결에 실패했습니다. 와이파이 연결을 확인해주세요')
      } else {
        alert('알 수 없는 에러로 메모 삭제에 실패했습니다.')
      }
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
        <input type="file" id='imageInput'
               accept="image/png, image/jpeg" multiple
               onChange={handleImageChange}
        />
        <div id="modifyDiv" contentEditable className='memoPad' dangerouslySetInnerHTML={{__html: memoTotal}}
             onInput={onChangeContent}/>
        <div className='memoButton'>
          <div className='memoUpdateButton' onClick={() => updateMemo()}>메모 수정</div>
          <div className='memoDeleteButton' onClick={() => deleteMemo()}>메모 삭제</div>
        </div>
      </div>
    </div>
  );
}

export default MemoDetail;
