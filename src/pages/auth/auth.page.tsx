import React, {useState} from 'react';
import '../../App.css';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import {authFire} from "../../firebase";
import {useNavigate} from "react-router-dom";


function AuthPage() {
  const [user,setUser] = useState({})
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("　");

  const navigate = useNavigate()

  const googleButton = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authFire, provider)
      .then((data) => {
        setUser(data.user);
        navigate('/list')
        console.log(data.user.email)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const signInButton = async() => {
    try {
      const curUserInfo = await signInWithEmailAndPassword(authFire, email, password);
      console.log(curUserInfo.user,'ssss');
      setUser(curUserInfo.user);
      // navigate('/list')
    } catch (err: any) {
      console.log(err.code,'eeee');
      /*
      입력한 아이디가 없을 경우 : auth/user-not-found.
      비밀번호가 잘못된 경우 : auth/wrong-password.
      */
    }
  }

  const signUpButton = async() => {
    try {
      setErrorMsg('　');
      const createdUser = await createUserWithEmailAndPassword(authFire, email, password);
      console.log(createdUser, '가입 성공');
      setEmail("");
      setPassword("");

    } catch(err:any){
      console.log(err.code, errorMsg);
      switch (err.code) {
        case 'auth/weak-password':
          setErrorMsg('비밀번호는 6자리 이상이어야 합니다');
          break;
        case 'auth/invalid-email':
          setErrorMsg('잘못된 이메일 주소입니다');
          break;
        case 'auth/email-already-in-use':
          setErrorMsg('이미 가입되어 있는 계정입니다');
          break;
      }
    }
  }
  return (

    <div className="backArea">
      <div>

        <button onClick ={()=>googleButton()}>구글 계정 로그인</button>
      </div>
      <div>
        <h2>
          email로 회원가입 or 로그인
        </h2>
        <div>
          <label>e-mail</label><input type='email' value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div>
          <label>password</label><input type='password' value={password} onChange={e=>setPassword(e.target.value)}/>
        </div>
        <button type = "submit" onClick={()=>signInButton()}>로그인</button>
        <button type="submit" onClick={()=>signUpButton()}>회원가입하기</button>
      </div>
<div>
  {authFire.currentUser && authFire.currentUser.email}
</div>
    </div>
  );
}

export default AuthPage;