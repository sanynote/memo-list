import React, {useContext, useState} from 'react';
import '../../App.css';
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {authFire} from "../../firebase";
import {useNavigate} from "react-router-dom";
import {serverCheck} from "../../function/server.check.func";
import {SystemError} from "../../interface/error.interface";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate()

  const signUpButton = async () => {
    try {
      serverCheck()
      setErrorMsg('');
      const newUserInfo = await createUserWithEmailAndPassword(authFire, email, password);
      localStorage.setItem('uid', newUserInfo.user.uid)
      navigate('/signin')
      setEmail("");
      setPassword("");

    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setErrorMsg('이미 가입되어 있는 계정입니다');
          break;
        case 'auth/weak-password':
          setErrorMsg('비밀번호는 6자리 이상이어야 합니다');
          break;
        case 'auth/network-request-failed':
          alert('네트워크 연결에 실패했습니다. 와이파이 연결을 확인해주세요');
          break;
        case 'auth/invalid-email':
          setErrorMsg('잘못된 이메일 형식입니다');
          break;
        case 'auth/internal-error':
          setErrorMsg('잘못된 요청입니다');
          break;
        default:
          setErrorMsg('알 수 없는 에러로 회원가입을 할 수 없습니다.')
          break
      }
    }
  }

  return (
    <div className="backArea">
      <div>
        <h2>
          회원가입 페이지 입니다.
        </h2>
        <div className='signInArea'>
    <div className='field'>

        <div>
          <input type='email' value={email} placeholder='e-mail' onChange={e => setEmail(e.target.value)}/>
        </div>
        <div>
          <input type='password' value={password} placeholder='password' onChange={e => setPassword(e.target.value)}/>
        </div>
    </div>
            <div className='button' onClick={() => signUpButton()}>회원가입</div>
        </div>
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>

  );
}

export default SignInPage;
