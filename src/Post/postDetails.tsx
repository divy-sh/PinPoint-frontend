import { useParams } from "react-router"
import LeftNav from "../Home/leftnav"
import RightNav from "../Home/rightnav"
import * as client from "../Home/client"
import { useEffect, useState } from "react"
import Post from "./post"
import LeftNavSm from "../Home/leftnavsm"

export const PostDetails = () => {
    const { postId } = useParams();
    const [currentPost, setCurrentPost] = useState(null);


    const findPost = async () => {
        const currentPostsByUser = await client.getPostById(postId);
        setCurrentPost(currentPostsByUser);
    }

    useEffect(() => {
        findPost();
    }, []);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-3 d-block-lg'>
                    <LeftNav />
                </div>
                <div className='col-lg-6'>
                    {currentPost && <Post key={postId} post={currentPost} deletable={true} />}
                </div>
                <div className='col-lg-3 d-none d-lg-block'>
                    <RightNav />
                </div>
            </div>
        </div>
    )
}
