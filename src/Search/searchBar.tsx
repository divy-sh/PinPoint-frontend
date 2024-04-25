import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router';

const CircularSearchBox = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e: any) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e: any) => {
        if (searchTerm.length >=3) {
            navigate(`/search/${searchTerm}`)
        }
    };

    return (
        <div className='container'>
            <div className="row align-items-center">
                <div className="col-8">
                    <input
                        type="text"
                        className="form-control rounded-pill me-2 mt-2 mb-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-2">
                    <div className="btn btn-primary rounded-pill" onClick={handleSearch}>
                        <FaSearch />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircularSearchBox;