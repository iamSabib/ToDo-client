import { useContext, useState } from "react";
// import { AuthContext } from "../provider/AuthProvider";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../provider/AuthProvider";


const Login = () => {
    const { setUser, signInWithGoogle } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();




    const googleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            const user = result.user;
            setUser(user);
            //   toast.success("Successfully Logged In");
            navigate(location?.state ? location.state : "/");
        } catch (error) {
            //   toast.error(error.code);
        }
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Welcome Back!</h1>
                    <p className="py-6">
                        Log in to your account and explore the amazing services we offer.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
                    <div className="form-control card-body pb-9">
                        <button
                            className="btn btn-neutral"
                            onClick={googleLogin}
                        >
                            <FcGoogle className="text-xl mr-2" /> Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
