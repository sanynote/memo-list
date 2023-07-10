import React, {useContext, useState} from 'react';
import '../../App.css';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {authFire} from "../../firebase";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../auth.context.provider";
import {serverCheck} from "../../function/server.check.func";
import {SystemError} from "../../interface/error.interface";

function AuthPage() {
  const isLoggedIn = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate()

  const googleButton = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(authFire, provider)
      .then((data) => {
        localStorage.setItem('uid', data.user.uid)
        navigate('/list')
      })
      .catch((e) => {
        const err = e as SystemError;
        const errorCode = err.code
        errorCode && setErrorMsg('알 수 없는 에러로 구글 로그인에 실패했습니다.')

      });
  }

  const signInButton = async () => {
    try {
      serverCheck()
      setErrorMsg('');
      const curUserInfo = await signInWithEmailAndPassword(authFire, email, password);
      localStorage.setItem('uid', curUserInfo.user.uid)
      navigate('/list')
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      switch (errorCode) {
        case 'auth/user-not-found':
          setErrorMsg('존재하지 않는 아이디입니다.');
          break;
        case 'auth/wrong-password':
          setErrorMsg('비밀번호가 일치하지 않습니다.');
          break;
        case 'auth/network-request-failed':
          alert('네트워크 연결에 실패했습니다. 와이파이 연결을 확인해주세요');
          break;
        default:
          setErrorMsg('알 수 없는 에러로 로그인을 할 수 없습니다.')
          break
      }
    }
  }

  const signUpButton = async () => {
    try {
      serverCheck()
      setErrorMsg('');
      const newUserInfo = await createUserWithEmailAndPassword(authFire, email, password);
      localStorage.setItem('uid', newUserInfo.user.uid)
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
  const signOutButton = async () => {
    try {
      serverCheck()
      await signOut(authFire)
      localStorage.removeItem('uid')
      navigate('/signin')
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      if (errorCode === 'auth/network-request-failed') {
        alert('네트워크 연결에 실패했습니다. 와이파이 연결을 확인해주세요')
      } else {
        setErrorMsg('알 수 없는 에러로 로그아웃에 실패했습니다.')
      }
    }
  }
  if (isLoggedIn) return (
    <div className='backArea'>
      <div onClick={() => navigate('/list')}>메모장으로 이동</div>
      <div onClick={() => signOutButton()}>로그아웃하기</div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>
  );

  return (

    <div className="backArea">
      <div>
        <button onClick={() => googleButton()}>구글 계정으로 로그인하기</button>
      </div>
      <div>
        <h2>
          로그인이 필요한 메모장 앱입니다.
        </h2>
        <div className='signInArea'>

        <div>
          <input type='email' value={email} placeholder='e-mail' onChange={e => setEmail(e.target.value)}/>
        </div>
        <div>
          <input type='password' value={password} placeholder='password' onChange={e => setPassword(e.target.value)}/>
        </div>
        <button type="submit" onClick={() => signInButton()}>로그인</button>
        </div>
        {/*<button type="submit" onClick={() => signUpButton()}>회원가입하기</button>*/}
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>

  );
}

export default AuthPage;
