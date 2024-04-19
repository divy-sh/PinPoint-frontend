import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route, Navigate } from "react-router";
import * as client from '../User/client'
import { resetUser } from '../User/reducer'
import Following from './following';
import Trending from './trending';
import { useState } from 'react';
import CreatePost from '../Post/Create';
import Profile from '../User/profile';
import EditProfilePage from '../User/editProfile';
import LeftNav from './leftnav';

const Home = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignout = async () => {
    await client.signout();
    dispatch(resetUser());
    navigate("/");
  }
  return (
    <div>
      <nav className="nav nav-underline justify-content-center">
        <Link to="/home/trending" className={`nav-link ${pathname.includes("trending") ? "active" : ""}`}>Trending</Link>
        {localStorage.getItem("token") != null &&
          <Link to="/home/following" className={`nav-link ${pathname.includes("following") ? "active" : ""}`}>Following</Link>
        }
      </nav>
      <div className='container'>
        <div className='row'>
          <div>
          <LeftNav />
          </div>
          <div className='col-lg-6'>
            <Routes>
              <Route path="/profile/:profileId" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="*" element={<Navigate to="/home/trending" />} />
              <Route path="trending" element={<Trending />} />
              <Route path="following" element={<Following />} />
            </Routes>
          </div>
          <div className='col-lg-3'>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
