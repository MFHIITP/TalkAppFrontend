import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import allRoutes from "../Routes/RouterFrontend.routes.js";
import { useMutation } from "@tanstack/react-query";

const verifyOTP = async({email, otpValue}: {email: string, otpValue: string}) => {
  const { data } = await api.post(allRoutes.auth.verifyOTP, {
    email: email,
    otp: otpValue
  })
}

const resendOTP = async(email: string) => {
  const { data } = await api.post(allRoutes.auth.resendOTP, {
    email: email
  })
  return data;
}

function OTPVerify() {
  const {email} = useParams();
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {mutate: handleOTPVerifyMutation} = useMutation({
    mutationFn: ({email, otpValue}: {email: string, otpValue: string}) => verifyOTP({email, otpValue}),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      navigate('/');
    },
    onError: (data) => {
      alert(data.response.data.message);
    }
  })
  const {mutate: handleResendOTPMutation} = useMutation({
    mutationFn: (email: string) => resendOTP(email),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      alert("OTP sent to your provided Email Address");
    },
    onError: (data) => {
      alert(data.response.data.message);
    }
  })

  const handleSubmit = async() => {
    if(otpValue.length < 6){
      alert("Please provide a valid OTP")
      return;
    }
    if(!email){
      alert("Please provide a valid Email ID");
      return;
    }
    handleOTPVerifyMutation({email, otpValue});
  }

  const handleResendOTP = () => {
    handleResendOTPMutation(email ?? "");
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Verify OTP
        </h2>
        <p className="mb-4 text-center text-sm text-gray-600">
          Enter the 6-digit code sent to your email
        </p>
        <form className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otpValue}
            onChange={(e) => {setOtpValue(e.target.value)}}
            placeholder="Enter OTP"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-center text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div
            onClick={handleSubmit}
            className="w-full flex justify-center items-center cursor-pointer rounded-xl bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Verify
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Didn’t get the code?{" "}
          <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={handleResendOTP}>
            Resend
          </div>
        </p>
      </div>
    </div>
  );
}

export default OTPVerify;
