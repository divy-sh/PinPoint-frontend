import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as client from './client';
import * as userReducer from './reducer'
import LeftNav from '../Home/leftnav';
import LeftNavSm from '../Home/leftnavsm';
import { ToastContainer, toast } from 'react-toastify';
import RightNav from '../Home/rightnav';

const EditProfile = () => {
    const [changePassword, setChangePassword] = useState<boolean>(true);
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.userReducer.user);
    const [formData, setFormData] = useState({
        username: user.username,
        bio: user.bio,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        _id: user._id,
        email: user.email,
        image: user.image,
        following: user.following,
        follower: user.follower
    });
    const navigate = useNavigate();
    const navigateBack = () => {
        navigate(`/profile/${user._id}`);
    }

    useEffect(() => {
        if (user._id === undefined || user._id === '') {
            navigate("/");
        }
    }, [user, navigate]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                const img = new Image();
                img.src = arrayBuffer;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 500;

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const resizedArrayBuffer = canvas.toDataURL();
                    setFormData({ ...formData, image: resizedArrayBuffer });
                }
            };
        }
    };

    const updatePassword = async () => {
        try {
            await client.updatePassword(password);
            toast.success("Saved");
        } catch (e: any) {
            toast.error(e.response.data);
        }
    };

    const handleSubmit = async () => {
        try {
            await client.updateUser(formData);
            dispatch(userReducer.setUser(formData));
            toast.success("Saved");
        } catch (e: any) {
            toast.error(e.response.data);
        }
    };

    return (
        <div className="container">
            <ToastContainer />
            <LeftNavSm />
            <nav className="nav nav-underline justify-content-center">
                <div className="nav-link active mb-4">
                    <h5>Edit Profile</h5>
                </div>
            </nav>
            <div className="row">
                <div className="col-lg-3 d-none d-lg-block">
                    <LeftNav />
                </div>
                {changePassword ?
                    <div className="col-lg-6">
                        <button className='btn btn-primary mb-3' onClick={navigateBack}> Back</button>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control mb-3"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                className="form-control mb-3"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="USER">USER</option>
                                {user.role === 'ADMIN' && <option value="ADMIN">ADMIN</option>}
                                <option value="ADVERTISER">ADVERTISER</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Avatar</label>
                            <input
                                type="file"
                                className="form-control mb-3"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary m-2">
                            Save Changes
                        </button>
                        <button onClick={() => setChangePassword(false)} type="submit" className="btn btn-warning m-2">
                            Update Password
                        </button>
                    </div> :
                    <div className="col-lg-6">
                        <button className='btn btn-primary mb-3' onClick={() => setChangePassword(true)}> Back</button>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                className="form-control mb-3"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={updatePassword} type="submit" className="btn btn-primary m-2">
                            Save Password
                        </button>
                    </div>
                }
                <div className="col-lg-3">
                    <RightNav />
                </div>
            </div>
        </div>
    );
};

export default EditProfile;