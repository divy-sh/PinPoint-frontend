import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import * as client from '../Ads/client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addAd } from '../Ads/reducer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAd = ({ isOpen, onClose }: { isOpen: boolean, onClose: any }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [isFormValid, setIsFormValid] = useState(false); // State to track form validation
    const user = useSelector((state: any) => state.userReducer.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateForm = () => {
        return title.trim() !== "" && description.trim() !== "" && image !== "" && url.trim() !== "";
    };

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [title, description, image, url]);

    const handleSubmit = (e: any) => {
        const ad = {
            userid: user._id,
            title: title,
            description: description,
            image: image,
            totalImpressions: 0,
            date: new Date().toISOString(),
            approved: false,
            url: url
        };
        try {
            client.createAd(ad);
            dispatch(addAd(ad));
            navigate("/");
        } catch (error: any) {
            toast.error(error.response.data);
            console.error('Error creating ad:', error);
        }
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImage(reader.result);
            };
        }
    };

    return (
        <Modal style={{
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
            }
        }}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Ad"
        >
            <ToastContainer />
            <div style={{ textAlign: 'center' }}>
                {image === "" && (
                    <svg width="400" height="400" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#CCC" />
                    </svg>
                )}
                {image !== "" && <img width="500" height="500" style={{ objectFit: 'cover' }} src={image} alt="Ad Image" />}
                <input
                    type="file"
                    className='form-control mt-1'
                    id="image"
                    onChange={handleFileChange}
                />
                <input
                    className='form-control mt-1'
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Ad title"
                />
                <input
                    className='form-control mt-1'
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter ad description"
                />
                <input
                    className='form-control mt-1'
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                />
                <button className={`btn btn-primary m-2 ${!isFormValid && 'disabled'}`} onClick={handleSubmit} disabled={!isFormValid}>Create Ad</button>
                <button className='btn btn-danger m-2' onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

export default CreateAd;
