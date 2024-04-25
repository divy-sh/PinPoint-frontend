import { Link } from 'react-router-dom';
import * as userClient from './client';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import UserList from './userList';
import { RiCrossFill } from 'react-icons/ri';

const UserListModal = ({ isOpen, onClose, userList }: { isOpen: boolean, onClose: any, userList: any }) => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            const f = await userClient.findUsers(userList);
            setUsers(f)
        };
        fetchUsers();
    }, [userList]);

    return (
        <Modal
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                },
            }}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Post"
        >
            <div className="container mt-4">
                {users.map((user: any, index: any) => (
                    <div key={index} className="row mb-3 align-items-center">
                        <div className="col-6 d-flex align-items-center">
                            <img
                                src={user.image === undefined || user.image === '' ? "/default.jpg" : user.image}
                                alt="profile-image"
                                className="rounded-circle me-2"
                                style={{ maxWidth: "40px" }}
                            />
                            <h6>{user.username}</h6>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <Link className="text-decoration-none" onClick={onClose} to={`/profile/${user._id}`}>
                                <h6>Profile</h6>
                            </Link>
                        </div>
                    </div>
                ))}
                <button
                    className="btn btn-danger rounded-circle ps-2 pe-2 d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-2"
                    onClick={onClose}
                >
                     X 
                </button>
            </div>
        </Modal>
    );
};
export default UserListModal;
