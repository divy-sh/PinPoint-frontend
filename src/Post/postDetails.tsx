import { useParams } from "react-router"
import LeftNav from "../Home/leftnav"
import * as client from "../Home/client"
import { useEffect, useState } from "react"
import Post from "./post"
import LeftNavSm from "../Home/leftnavsm"
import RightNav from "../Home/rightnav"

export const PostDetails = () => {
    const { postId } = useParams();
    const [currentPost, setCurrentPost]: [currentPost: any, setCurrentPost: any] = useState(null);
    const findPost = async () => {
        const currentPostsByUser = await client.getPostById(postId);
        setCurrentPost(currentPostsByUser);
    }
    useEffect(() => {
        findPost();
    });
    return (
        <div className='container'>
            <LeftNavSm />
            <nav className="nav nav-underline justify-content-center">
                <div className="nav-link active">
                    <h5>Post</h5>
                </div>
            </nav>
            <div className='row mb-4'>
                <div className='col-lg-3'>
                    <LeftNav />
                </div>
                <div className='col-lg-6'>
                    {currentPost && <Post key={postId} currentPost={currentPost} />}
                </div>
                <div className="col-lg-3">
                    <RightNav />
                </div>
            </div>
        </div>
    )
}
