import Image from "next/image";
import React from "react";
import Container from "./container";

import userOneImg from "../public/img/user1.jpg";
import userTwoImg from "../public/img/user2.jpg";
import userThreeImg from "../public/img/user3.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowRightCircle, FastArrowLeft, FastArrowRight } from "iconoir-react";

const Testimonials = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://gorest.co.in/public/v2/posts?page=${page}&per_page=12`
        );
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts(page);
  }, [page]);

  return (
    <Container>
      <div>
        <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
          {posts &&
            posts.map((post, index) => (
              <div className="lg:col-span-2 xl:col-auto" key={index}>
                <Link href={`/blog/${post.id}`}>
                  <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-8 rounded-2xl py-8 dark:bg-trueGray-800 gap-2 cursor-pointer dark:hover:opacity-80 transition-colors">
                    <p className="font-semibold uppercase text-xl text-blue-600 text-start group-hover:text-white">
                      {post.title}
                    </p>
                    <p className="font-normal text-sm text-gray-500 text-start group-hover:text-white">
                      {post.body.length > 200 ? (
                        <>{post.body.substring(0, 200)}...</>
                      ) : (
                        post.body
                      )}
                    </p>
                    <div className="inline-flex gap-2 hover:text-blue-600">
                      <ArrowRightCircle /> <span>Read more...</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
        <div className="w-full inline-flex justify-center mt-4 gap-4 mb-10">
          <button
            disabled={page == 1}
            onClick={() =>
              setPage((prev) => {
                if (page > 1) {
                  return prev - 1;
                }
              })
            }
            className="px-4 py-1 rounded-md bg-gray-300 text-white hover:bg-gray-400 dark:bg-trueGray-800 dark:hover:opacity-80"
          >
            <FastArrowLeft />
          </button>
          <button
            onClick={() =>
              setPage((prev) => {
                return prev + 1;
              })
            }
            className="px-4 py-1 rounded-md bg-gray-300 text-white hover:bg-gray-400 dark:bg-trueGray-800 dark:hover:opacity-80"
          >
            <FastArrowRight />
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Testimonials;
