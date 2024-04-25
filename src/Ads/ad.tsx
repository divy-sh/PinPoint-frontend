import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as client from './client';
import { setAds } from './reducer';
import { useNavigate } from 'react-router-dom';
import LeftNav from '../Home/leftnav';
import AdCard from './adcomponent';
import CreateAd from './create';
import RightNav from '../Home/rightnav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeftNavSm from '../Home/leftnavsm';

const AdList = () => {
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.userReducer.user);
    const ads = useSelector((state: any) => state.adReducer.ads);
    const dispatch = useDispatch();
    const [adModalIsOpen, setAdModalIsOpen] = useState(false);
    const openAdModal = () => setAdModalIsOpen(true);
    const closeAdModal = () => setAdModalIsOpen(false);
    useEffect(() => {
        if (user._id === undefined || user._id === '' || user.role !== 'ADVERTISER') {
            navigate("/")
        }
        const fetchAds = async () => {
            try {
                const userAds = await client.findAdByUser(user._id);
                dispatch(setAds(userAds));
            } catch (error: any) {
                toast.error(error.response.data);
                console.error('Error fetching ads:', error);
            }
        };

        fetchAds();
    }, [dispatch, user, navigate]);

    return (
        <div>
            <ToastContainer />
            <nav className="nav nav-underline justify-content-center">
                <div className="nav-link active mb-4">
                    <h5>My Ads</h5>
                </div>
            </nav>
            <div className="container">
                <div className="row">
                    <div className="d-none d-sm-block">
                        <LeftNavSm />
                    </div>
                    <div className="col-lg-3 d-block-lg">
                        <LeftNav />
                    </div>
                    <div className="col-lg-6">
                        <div style={{ textAlign: "center" }}>
                            <button className='btn btn-primary' onClick={openAdModal}>Create Ad</button>
                            <CreateAd isOpen={adModalIsOpen} onClose={closeAdModal} />
                        </div>
                        {ads.map((ad: any) => (
                            <AdCard
                                ad={ad}
                                editable={true}
                                approvable={false}
                            />
                        ))}
                    </div>
                    <div className="col-lg-3 d-none d-lg-block">
                        <RightNav />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdList;