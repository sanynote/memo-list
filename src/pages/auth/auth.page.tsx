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

interface SystemError {
  code: string;
}


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
        console.log(data.user.email)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const signInButton = async () => {
    try {
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
          setErrorMsg('네트워크 연결에 실패했습니다');
          break;
      }
    }
  }

  const signUpButton = async () => {
    try {
      setErrorMsg('');
      await createUserWithEmailAndPassword(authFire, email, password);
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
          setErrorMsg('네트워크 연결에 실패했습니다');
          break;
        case 'auth/invalid-email':
          setErrorMsg('잘못된 이메일 형식입니다');
          break;
        case 'auth/internal-error':
          setErrorMsg('잘못된 요청입니다');
          break;
      }
    }
  }
  const signOutButton = async () => {
    try {

    await signOut(authFire)
    localStorage.removeItem('uid')
    navigate('/signin')
    } catch (e) {
      const err = e as SystemError;
      const errorCode = err.code
      if(errorCode) setErrorMsg('로그아웃에 실패했습니다.')
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
        <button onClick={() => googleButton()}>구글 계정 로그인</button>
      </div>
      <div>
        <h2>
          email로 회원가입 or 로그인
        </h2>
        <div>
          <label>e-mail</label><input type='email' value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div>
          <label>password</label><input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button type="submit" onClick={() => signInButton()}>로그인</button>
        <button type="submit" onClick={() => signUpButton()}>회원가입하기</button>
      </div>
      {errorMsg && <div>{errorMsg}</div>}
    </div>

  );
}

export default AuthPage;
