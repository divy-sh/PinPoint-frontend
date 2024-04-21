import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import * as client from '../Ads/client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addAd } from '../Ads/reducer';

const CreateAd = ({ isOpen, onClose }: { isOpen: boolean, onClose: any }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const user = useSelector((state: any) => state.userReducer.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e :any) => {
        const ad = {
            userid: user._id,
            title: title,
            description: description,
            image: image,
            totalImpressions: 0,
            date: new Date(),
            approved: false
        };
        try {
            client.createAd(ad);
            dispatch(addAd(ad));
            navigate("/");
        } catch (error) {
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
        }} isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Ad">
            <div style={{ textAlign: 'center' }}>
                {image === "" && <svg width="500" height="500" viewBox="0 0 100 100"><rect width="100" height="100" fill="#CCC" /></svg>}
                {image !== "" && <img width="500" height="500" style={{ objectFit: 'cover' }} src={image} alt="Ad Image" />}
                <input type="file" className='form-control' id="image" onChange={handleFileChange} />
                <input
                    className='form-control'
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter ad title"
                />
                <input
                    className='form-control'
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter ad description"
                />
                <button className='btn btn-primary m-2' onClick={handleSubmit}>Create Ad</button>
            </div>
        </Modal>
    );
};

export default CreateAd;