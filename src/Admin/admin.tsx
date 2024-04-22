import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as client from '../Ads/client';
import { setAds, deleteAd, updateAd } from '../Ads/reducer';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import LeftNav from '../Home/leftnav';
import AdCard from '../Ads/adcomponent';
import AdminAds from './adminads';
import AdminUsers from './adminusers';
import RightNav from '../Home/rightnav';

const Admin = () => {
    const { pathname } = useLocation();
    const user = useSelector((state: any) => state.userReducer.user);
    const ads = useSelector((state: any) => state.adReducer.ads);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const userAds = await client.findAllAds();
                dispatch(setAds(userAds));
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };

        fetchAds();
    }, [user._id, dispatch]);

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-3 d-block-lg">
                        <LeftNav />
                    </div>
                    <div className="col-lg-6">
                        <nav className="nav nav-underline justify-content-center mb-4">
                            <Link to="/admin/ads" className={`nav-link ${pathname.includes("admin/ads") ? "active" : ""}`}><h5>Approve Ads</h5></Link>
                            <Link to="/admin/users" className={`nav-link ${pathname.includes("admin/users") ? "active" : ""}`}><h5>Manage Users</h5></Link>
                        </nav>
                        <Routes>
                            <Route path="ads" element={<AdminAds />} />
                            <Route path="users" element={<AdminUsers />} />
                        </Routes>
                    </div>
                    <div className="col-3">
                        <RightNav />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;