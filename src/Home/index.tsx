import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from "react-router";
import Following from './following';
import Trending from './trending';
import LeftNav from './leftnav';
import { useState } from 'react';
import CreatePost from '../Post/Create';
import RightNav from './rightnav';
import LeftNavSm from './leftnavsm';


const Home = () => {
  const { pathname } = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const user = useSelector((state: any) => state.userReducer.user);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div>
      <nav className="nav nav-underline justify-content-center">
        <Link to="/home/trending" className={`nav-link ${pathname.includes("trending") ? "active" : ""}`}><h5>Trending</h5></Link>
        {localStorage.getItem("token") !== null &&
          <Link to="/home/following" className={`nav-link ${pathname.includes("following") ? "active" : ""}`}><h5>Following</h5></Link>
        }
      </nav>
      <div className='container'>
        <div className='row'>
          <div className="d-none d-sm-block">
            <LeftNavSm/>
          </div>
          <div className='col-lg-3 d-block-lg'>
            <LeftNav />
          </div>
          <div className='col-lg-6'>
            {user._id !== '' && <div className='mt-4' style={{ textAlign: "center" }}>
              <button className='btn btn-primary' onClick={openModal}>Post</button>
              <CreatePost isOpen={modalIsOpen} onClose={closeModal} />
            </div>}
            <Routes>
              <Route path="/trending" element={<Trending />} />
              <Route path="/following" element={<Following />} />
              <Route path='*' element={<Navigate to={'/'} />} />
            </Routes>
          </div>
          <div className='col-lg-3 d-none d-lg-block'>
            <RightNav />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
