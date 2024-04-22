import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiUserFollowFill, RiUserFollowLine } from "react-icons/ri";
import * as postClient from '../Home/client';
import { updatePost } from '../Home/reducer';
import * as userClient from '../User/client';
import { setUser } from '../User/reducer';

const Post = ({ post }: { post: any }) => {
    const dispatch = useDispatch();
    var user = useSelector((state: any) => state.userReducer.user);
    const react = async (add: boolean) => {
        var newPost = {}
        if (add) {
            newPost = { ...post, reactions: [...post.reactions, user._id] }
        } else {
            newPost = { ...post, reactions: post.reactions.filter((userid: any) => userid !== user._id) }
        }
        await postClient.updatePost(post._id, newPost);
        dispatch(updatePost(newPost));
    }

    const follow = async (add: boolean) => {
        await userClient.follow(user._id, post.userid, add);
        var newUser = {}
        if (add === true) {
            newUser = { ...user, following: [...user.following, post.userid] }
        } else {
            newUser = { ...user, following: user.following.filter((userid: any) => userid !== post.userid) }
        }
        dispatch(setUser(newUser));
    }

    const castVote = async (option: any) => {
        const newVotes = { ...post.votes, [user._id]: option };
        const newPost = { ...post, votes: newVotes };
        await postClient.updatePost(post._id, newPost);
        dispatch(updatePost(newPost));
    };

    return (
        <div className="card m-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <Link className="nav-link" to={`/profile/${post.userid}`}>
                            {post.user.username}
                        </Link>
                    </div>
                    {user._id !== '' && (
                        <div className="col-md-6 text-end">
                            {user.following.includes(post.userid) ? (
                                <Link
                                    className="nav-link"
                                    onClick={() => follow(false)}
                                    to={''}
                                >
                                    <RiUserFollowFill /> Unfollow
                                </Link>
                            ) : (
                                <Link
                                    className="nav-link"
                                    onClick={() => follow(true)}
                                    to={''}
                                >
                                    <RiUserFollowLine /> Follow
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="ratio ratio-1x1">
                <img
                    src={`${post.image}`}
                    alt="image"
                    className="img-fluid"
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div className="container">
                <div className="row align-items-center my-3">
                    {user._id !== '' ? (
                        <div className="col-auto">
                            {post.reactions.includes(user._id) ? (
                                <FaHeart onClick={() => react(false)} />
                            ) : (
                                <FaRegHeart onClick={() => react(true)} />
                            )}
                            {post.reactions.length > 0 && ` ${post.reactions.length} likes`}
                        </div>
                    ) : (
                        <div className="col-auto">{` ${post.reactions.length} likes`}</div>
                    )}
                </div>
                <div className="row">
                    {user._id !== '' && (
                        <div className="col-12">
                            {post.votes && user._id in post.votes ? (
                                <div className="container p-0">
                                    <p className="mb-1">
                                        <strong>Voted:</strong> {post.options[post.votes[user._id]]}
                                    </p>
                                    <p>
                                        <strong>Answer:</strong> {post.options[5]}
                                    </p>
                                </div>
                            ) : (
                                <div className="container">
                                    <div className="row">
                                        <div className="col-6">
                                            <button
                                                className="btn btn-primary w-100 mb-2"
                                                onClick={() => castVote(1)}
                                            >
                                                {post.options[1]}
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                className="btn btn-primary w-100 mb-2"
                                                onClick={() => castVote(2)}
                                            >
                                                {post.options[2]}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <button
                                                className="btn btn-primary w-100 mb-2"
                                                onClick={() => castVote(3)}
                                            >
                                                {post.options[3]}
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button
                                                className="btn btn-primary w-100 mb-2"
                                                onClick={() => castVote(4)}
                                            >
                                                {post.options[4]}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Post;
