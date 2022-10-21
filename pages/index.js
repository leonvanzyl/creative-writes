import Head from "next/head";
import Link from "next/link";
import Message from "../components/Message";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setAllPosts(
        snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });

    return unsub;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>Creative Writes</title>
      </Head>

      <div className="my-12 text-lg font-medium">
        <h2>See what about people are saying</h2>
        {allPosts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
                <button>{post.comments?.length || 0} comments</button>
              </Link>
            </Message>
          );
        })}
      </div>
    </div>
  );
}
