import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// React
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { toast } from "react-toastify";

export default function Post() {
  // Form State
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);

  const router = useRouter();

  const updateData = router.query;

  const submitPost = async (e) => {
    e.preventDefault();

    if (!post.description) {
      toast.error("Description field empty 😬");
      return;
    }

    if (post.description.length > 300) {
      toast.error("Description is too long! 🤮");
      return;
    }

    // Update Post
    if (post?.hasOwnProperty("id")) {
      try {
        const docRef = doc(db, "posts", post.id);
        const updatedPost = { ...post, timestamp: serverTimestamp() };
        await updateDoc(docRef, updatedPost);
        toast.success("Post has been updated 🥳");
        return router.push("/");
      } catch (error) {
        toast.error(error.message);
        return;
      }
    }

    // Make a new post
    try {
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });

      setPost({ ...post, description: "" });
      toast.success("Post has been made 🚀");

      return router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) router.push("/auth/login");

    if (updateData.id) {
      setPost({ description: updateData.description, id: updateData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [loading, user]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Update post" : "Create new post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
            value={post.description}
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 && "text-red-600"
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
