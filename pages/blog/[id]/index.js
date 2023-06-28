// import axios from "axios";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import Container from "../../../components/container";
// import Navbar from "../../../components/navbar";
// import { ArrowLeftCircle } from "iconoir-react";
// import Link from "next/link";

// const Index = () => {
//   const router = useRouter();
//   const [post, setPost] = useState(null);
//   const [user, setUser] = useState(null);

//   const fetchUser = async (userId) => {
//     try {
//       const response = await axios.get(
//         `https://gorest.co.in/public/v2/users/${userId}`
//       );
//       setUser(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     const postId = router.query.id;
//     if (postId) {
//       const fetchPost = async () => {
//         try {
//           const response = await axios.get(
//             `https://gorest.co.in/public/v2/posts/${postId}`
//           );
//           if (response.status == 200) {
//             fetchUser(response.data.user_id);
//             setPost(response.data);
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       };
//       fetchPost();
//     }
//   }, [router]);

//   return (
//     <>
//       <Navbar />
//       <Container>
//         {post && (
//           <div className="flex flex-col w-full h-full bg-gray-100 px-8 py-8 rounded-2xl gap-2 dark:bg-trueGray-800">
//             <Link href="/">
//               <div className="inline-flex gap-2 hover:text-blue-600">
//                 <ArrowLeftCircle /> <span>Back</span>
//               </div>
//             </Link>
//             {user ? (
//               <div className="font-bold text-lg">
//                 {user && <h5>Name: {user.name}</h5>}
//               </div>
//             ) : (
//               <div className="font-bold text-lg">
//                 <h5>User not found</h5>
//               </div>
//             )}
//             {post.body}
//           </div>
//         )}
//       </Container>
//     </>
//   );
// };

// export default Index;

import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../../../components/container";
import Navbar from "../../../components/navbar";
import { ArrowLeftCircle } from "iconoir-react";
import Link from "next/link";

const Index = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(
        `https://gorest.co.in/public/v2/users/${userId}`
      );
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `https://gorest.co.in/public/v2/comments?post_id=${postId}`
      );
      setComments(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const postId = router.query.id;
    if (postId) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(
            `https://gorest.co.in/public/v2/posts/${postId}`
          );
          if (response.status === 200) {
            fetchUser(response.data.user_id);
            fetchComments(postId);
            setPost(response.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchPost();
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <Container>
        {post && (
          <div className="flex flex-col w-full h-full bg-gray-100 px-8 py-8 rounded-2xl gap-2 dark:bg-trueGray-800">
            <Link href="/">
              <div className="inline-flex gap-2 hover:text-blue-600">
                <ArrowLeftCircle /> <span>Back</span>
              </div>
            </Link>
            {user ? (
              <div className="font-bold text-lg">
                {user && <h5>Name: {user.name}</h5>}
              </div>
            ) : (
              <div className="font-bold text-lg">
                <h5>User not found</h5>
              </div>
            )}
            <p className="font-semibold uppercase text-xl text-blue-600 text-start group-hover:text-white">
              {post.title}
            </p>
            {post.body}

            <h3 className="mt-4 mb-2 font-bold">Comments:</h3>
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-2">
                  <p>{comment.name}</p>
                  <p>{comment.email}</p>
                  <p>{comment.body}</p>
                </div>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default Index;

