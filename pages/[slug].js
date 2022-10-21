import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function PostDetail() {
  const router = useRouter();
  const routerData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const submitMessage = async () => {
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("Don't leave an empty message 😒");
      return;
    }

    try {
      const docRef = doc(db, "posts", routerData.id);
      await updateDoc(docRef, {
        comments: arrayUnion({
          message,
          avatar: auth.currentUser.photoURL,
          username: auth.currentUser.displayName,
          timestamp: Timestamp.now(),
        }),
      });
      setMessage("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", routerData.id);
    const unsub = onSnapshot(docRef, (snapshot) =>
      setAllMessages(snapshot.data().comments)
    );
    return unsub;
  };

  useEffect(() => {
    // Execute once router is ready
    if (!router.isReady) return;

    getComments();
  }, [router]);

  return (
    <div>
      <Message {...routerData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Send a message ✏️"
            className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.timestamp}>
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-10 rounded-full"
                  src={message.avatar}
                  alt=""
                />
                <h2>{message.username}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
