import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

// Firebase
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Next
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  // Sign in with Google
  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Initial Load
  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of our providers</h3>
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 w-full font-medium rounded-lg align-middle flex p-4 gap-2"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
