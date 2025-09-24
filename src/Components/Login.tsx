import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import allRoutes from "../Routes/RouterFrontend.routes.js";
import { useMutation } from "@tanstack/react-query";

const LoginFunction = async({email, password}: {email: string, password: string}) => {
  const { data } = await api.post(allRoutes.auth.login, {
    email: email,
    password: password
  })
  return data;
}

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    navigate('/signup')
  }

  const {mutate: handleLoginMutation} = useMutation({
    mutationFn: ({email, password}: {email: string, password: string}) => LoginFunction({email, password}),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      localStorage.setItem("email", email);
      window.location.href = '/';
    },
    onError: (data) => {
      console.log(data);
      alert(data.response.data.message);
    }
  })

  const handleLogin = async() => {
    if(!email || !password){
      alert("All fields are required");
    }
    handleLoginMutation({email, password});
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <form className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {setEmail(e.target.value)}}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => {setPassword(e.target.value)}}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div
            onClick={handleLogin}
            className="w-full flex justify-center items-center cursor-pointer rounded-xl bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick = {handleSignUp}>
            Sign up
          </div>
        </p>
      </div>
    </div>
  );
}

export default Login;
