import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as client from './client';
import { setAds, deleteAd, updateAd } from './reducer';
import { Link } from 'react-router-dom';
import LeftNav from '../Home/leftnav';
import AdCard from './adcomponent';
import CreateAd from './create';

const AdList = () => {

    const user = useSelector((state: any) => state.userReducer.user);
    const ads = useSelector((state: any) => state.adReducer.ads);
    const dispatch = useDispatch();
    const [adModalIsOpen, setAdModalIsOpen] = useState(false);
    const openAdModal = () => setAdModalIsOpen(true);
    const closeAdModal = () => setAdModalIsOpen(false);
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const userAds = await client.findAdByUser(user._id);
                dispatch(setAds(userAds));
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };

        fetchAds();
    }, [user._id, dispatch]);

    return (
        <div>
            <nav className="nav nav-underline justify-content-center">
                <Link to="/ads" className="nav-link">
                    <h5>Your Ads</h5>
                </Link>
            </nav>

            <div className="container">
                <div className="row">
                    <div className="col-lg-3 d-block-lg">
                        <LeftNav />
                    </div>
                    <div className="col ps-4">
                        {ads.map((ad: any) => (
                            <AdCard
                                ad={ad}
                                editable={true}
                                approvable={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6" style={{textAlign: "center"}}>
                        <button className='btn btn-primary' onClick={openAdModal}>Ads</button>
                        <CreateAd isOpen={adModalIsOpen} onClose={closeAdModal} />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdList;