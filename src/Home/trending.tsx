import { useDispatch, useSelector } from 'react-redux';
import * as client from './client'
import { setPosts } from "./reducer"
import Post from '../Post/post';
import { SetStateAction, useEffect, useState } from 'react';

const Trending = () => {
    const dispatch = useDispatch()
    const trendingPosts = useSelector((state: any) => state.postsReducer.trendingPosts);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const fetchPosts = async () => {
        const posts = await client.findTrendingPosts(currentPage, postsPerPage)
        dispatch(setPosts(posts))
    }

    useEffect(() => {
        fetchPosts()
    }, [currentPage, postsPerPage]);

    const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = trendingPosts.slice(indexOfFirstPost, indexOfLastPost);
    return (
        <div className='m-4'>
            {currentPosts.map((post: any, index: any) => (
                <Post key={post._id} post={post} deletable={false} />
            ))}
            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                >
                    Previous
                </button>
                {Array.from(
                    { length: Math.ceil(trendingPosts.length / postsPerPage) },
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
                    disabled={indexOfLastPost >= trendingPosts.length}
                    onClick={() => paginate(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
export default Trending;
