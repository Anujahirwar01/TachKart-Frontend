import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useLoginMutation, getUser } from '../redux/api/userAPI';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { MessageResponse } from '../types/api-types';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { userExist } from '../redux/reducer/userReducer';


const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginHandler = async () => {
    try {
      if (!gender || !date) {
        toast.error("All fields are required");
        return;
      }

      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        dob: date,
        _id: user.uid,
        role: "user",
      })

      if (res.data) {
        toast.success(res.data.message);

        // Fetch the user data and update Redux state
        const userData = await getUser(user.uid);
        dispatch(userExist(userData.user));

        // Navigate to home page
        navigate('/');
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = error.data as MessageResponse;
        toast.error(message.message);
      }

    } catch (err) {
      toast.error("Login failed. Please try again.");
      console.error(err);
    }
  };
  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login
