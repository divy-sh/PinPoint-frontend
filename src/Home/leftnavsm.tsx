import { Link, useNavigate } from 'react-router-dom';
import * as client from '../User/client';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../User/reducer';
import CircularSearchBox from '../Search/searchBar'; 
import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { TiThMenu } from "react-icons/ti";
import logo from '../logo.png'
const LeftNavSm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.userReducer.user);
    const [showMenu, setShowMenu] = useState(false);
    const handleSignout = async () => {
        await client.signout();
        dispatch(resetUser());
        navigate("/");
    };
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <>
            <div>
                <button className="btn btn-primary position-fixed d-none d-sm-block" type="button" data-bs-toggle="collapse" data-bs-target="#leftNavMenu" aria-expanded="false" aria-controls="leftNavMenu">
                    <TiThMenu />
                </button>
            </div>
            <div className={`collapse col-lg-3 p-2 position-fixed card ${showMenu ? 'show' : ''}`} id="leftNavMenu" style={{ height: '80%', zIndex: 9999  }}>
                <button className="btn-close position-absolute top-0 end-0 m-3" onClick={toggleMenu}></button>
                <div className="d-flex">
                    <div className="col-3">
                        <img src={logo} alt="login" className="rounded-circle m-2" style={{ height: '80%', width: '80%' }} />
                    </div>
                    <div className='pt-4'>
                        <Link to="/home/trending" className="d-flex align-items-center p-4 text-decoration-none fs-4">
                            Pin Point
                        </Link>
                    </div>
                </div>
                <CircularSearchBox />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/home/trending" className="nav-link w-100 mb-2" aria-current="page">
                            <h5>Home</h5>
                        </Link>
                    </li>
                    {localStorage.getItem("token") !== null ? (
                        <>
                            <Link to={"/profile/" + user._id} className="nav-link w-100 mb-2"><h5>Profile</h5></Link>
                            {user.role === 'ADVERTISER' &&
                                <Link to="/ads" className="nav-link w-100 mb-2"><h5>My Ads</h5></Link>
                            }
                            {user.role === 'ADMIN' &&
                                <Link to="/admin/ads" className="nav-link w-100 mb-2"> <h5>Admin Panel</h5></Link>
                            }
                            <Link onClick={handleSignout} className="nav-link w-100 mb-2" to={''}><h5>Sign out</h5></Link>
                        </>
                    ) : <Link to="/signin" className="nav-link w-100"><h5>Sign in</h5></Link>}
                </ul>
            </div>
        </>
    );
};
export default LeftNavSm;
