import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

// Icons
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

// Firebase
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth/login");
    }

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });

    return unsub;
  }, [user, loading]);

  // Handler functions
  const deletePost = async (id) => {
    try {
      const docRef = doc(db, "posts", id);
      await deleteDoc(docRef);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>Your posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    deletePost(post.id);
                  }}
                  className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                >
                  <BsTrash2Fill className="text-2xl" /> Delete
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-2xl" /> Edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6"
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
