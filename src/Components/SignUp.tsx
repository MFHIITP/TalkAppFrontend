import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import allRoutes from "../Routes/RouterFrontend.routes.js";
import { useMutation } from "@tanstack/react-query";

const handleSignUp = async({email, name, password}: {email: string, name: string, password: string}) => {
  const { data } = await api.post(allRoutes.auth.signup, {
    email: email,
    name: name,
    password: password
  })
  return data;
}

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {mutate: handleSignUpMutation} = useMutation({
    mutationFn: ({email, name, password}: {email: string, name: string, password: string}) => handleSignUp({email, name, password}),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      navigate(`/verify-otp/${email}`);
    },
    onError: (data) => {
      alert(data.message);
    }
  })

  const handleLogin = () => {
    navigate("/login");
  }

  const handleOTPVerify = async() => {
    if(password !== verifyPassword){
      alert("Passwords do not match");
      return;
    }
    if(!email){
      alert("Please provide an Email ID");
      return;
    }
    handleSignUpMutation({email, name, password});
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </h2>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {setName(e.target.value)}}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {setEmail(e.target.value)}}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Verify Password"
              value={verifyPassword}
              onChange={(e) => {setVerifyPassword(e.target.value)}}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div
            onClick={handleOTPVerify}
            className="w-full flex justify-center items-center cursor-pointer rounded-xl bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            Sign Up
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <div className="font-medium text-green-600 hover:underline" onClick={handleLogin}>
            Login
          </div>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
