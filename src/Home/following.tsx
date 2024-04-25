import { useDispatch, useSelector } from "react-redux";
import * as client from "./client";
import { setFollowingPosts } from "./reducer";
import Post from "../Post/post";
import { SetStateAction, useEffect, useState } from "react";

const Following = () => {
  const dispatch = useDispatch();
  const followingPosts = useSelector(
    (state: any) => state.postsReducer.followingPosts
  );
  const user = useSelector((state: any) => state.userReducer.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const fetchPosts = async (page = 1, size = postsPerPage) => {
    if (user._id !== undefined && user._id !== "") {
      const posts = await client.findFollowingPosts(user._id, page, size);
      dispatch(setFollowingPosts(posts));
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, postsPerPage);
  }, [user, currentPage, postsPerPage]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = followingPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  return (
    <div className="m-4">
      {currentPosts.map((post: any, index: any) => (
        <Post key={post._id} post={post} deletable={false}/>
      ))}
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from(
          { length: Math.ceil(followingPosts.length / postsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              style={{
                backgroundColor: currentPage === i + 1 ? "gray" : "white",
              }}
            >
              {i + 1}
            </button>
          )
        )}
        <button
          disabled={indexOfLastPost >= followingPosts.length}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Following;