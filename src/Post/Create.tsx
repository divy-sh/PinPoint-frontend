import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import * as client from '../Home/client'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addPost } from '../Home/reducer';

const CreatePost = ({ isOpen, onClose }: { isOpen: boolean, onClose: any }) => {
    const [image, setImage] = useState("");
    const user = useSelector((state: any) => state.userReducer.user);
    var posts = useSelector((state: any) => state.postsReducer.posts);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = (e: any) => {
        const post = {
            userid: user._id,
            image: image,
            options: {
                1: searchValue, 2: searchValue, 3: searchValue, 4: searchValue,
            },
            date: new Date,
            reactions: []
        }
        client.createPost(post);
        dispatch(addPost(post));
        navigate("/")
    };

    const handleSearchChange = (e: any) => {
        setSearchValue(e.target.value);
        if (e.target.value.trim() !== '') {
            fetchSearchResults(e.target.value);
        } else {
            setSearchResults([]);
        }
    };

    const fetchSearchResults = async (value: any) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    city: value,
                    format: 'geojson',
                },
            });
            setSearchResults(response.data.features);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleItemClick = (result: any) => {
        setSearchValue(result.properties.display_name);
        setSearchResults([]);
        setShowDropdown(false);
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
                  setImage(resizedArrayBuffer);
                }
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
        }} isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Post">
            <div style={{ textAlign: 'center' }}>
                {image == "" && <svg width="500" height="500" viewBox="0 0 100 100"><rect width="100" height="100" fill="#CCC" /></svg>}
                {image != "" && <img width="500" height="500" style={{ objectFit: 'cover' }} src={image} />}
                <input type="file" className='form-control' id="image" onChange={handleFileChange} />
                <div>
                    <input
                        className='form-control'
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Enter a city name"
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 500)}
                    />
                    {showDropdown && (
                        <ul className="dropdown">
                            {searchResults.map((result: any) => (
                                <li key={result.properties.place_id} onClick={() => handleItemClick(result)}>
                                    {result.properties.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button className='btn btn-primary m-2' onClick={handleSubmit}>Post</button>
            </div>
        </Modal>
    );
};

export default CreatePost;