import React from "react";
import Link from "next/link";

// Firebase
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="flex justify-between items-center py-10">
      <Link href={"/"}>
        <button className="text-lg font-medium">Creative Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <li>
            <Link href={"/auth/login"}>
              <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
                Join Now
              </a>
            </Link>
          </li>
        )}
        {user && (
          <>
            <li>
              <Link href="/post">
                <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-lg text-sm">
                  Post
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                <img
                  className="w-12 rounded-full cursor-pointer shadow-sm"
                  src={user.photoURL}
                />
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
