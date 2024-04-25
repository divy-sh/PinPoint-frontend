import { useParams } from "react-router-dom";
import LeftNav from "../Home/leftnav";
import { useEffect, useState } from "react";
import * as searchClient from "./client";
import axios from "axios";
import { SearchUser } from "./searchUser";
import { SearchCities } from "./searchCities";
import { SearchPosts } from "./searchPosts";
import { Spinner } from "./Spinner";
import RightNav from "../Home/rightnav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeftNavSm from "../Home/leftnavsm";

const Search = () => {
  const { searchTerm } = useParams();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const fetchCities = async (value: String) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            city: value,
            format: "geojson",
          },
        },
      );
      setCities(
        response.data.features.filter(
          (e: any) =>
            e.properties.addresstype === "city" ||
            e.properties.addresstype === "town",
        ),
      );
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data);
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const searchUsers = async () => {
      try {
        if (searchTerm !== undefined) {
          const response = await searchClient.searchUsers(searchTerm);
          setUsers(response);
        }
      } catch (error: any) {
        toast.error(error.response.data);
        console.error("Error fetching user data:", error);
      }
    };
    const searchPosts = async () => {
      try {
        if (searchTerm !== undefined) {
          const response = await searchClient.searchPosts(searchTerm);
          setPosts(response);
        }
      } catch (error: any) {
        toast.error(error.response.data);
        console.error("Error fetching user data:", error);
      }
    };

    const searchCities = async () => {
      try {
        if (searchTerm !== undefined) {
          await fetchCities(searchTerm);
        }
      } catch (error: any) {
        toast.error(error.response.data);
        console.error("Error fetching user data:", error);
      }
    };
    searchUsers();
    searchPosts();
    searchCities();
  }, [searchTerm]);

  return (
    <div className="container">
      <ToastContainer />
      <div className="row">
        <div className="d-none d-sm-block">
          <LeftNavSm />
        </div>
        <div className="col-lg-3 d-none d-lg-block">
          <LeftNav />
        </div>
        <div className="col-lg-6">
          <nav className="nav nav-underline justify-content-center">
            <div className="nav-link active">
              <h5>Search</h5>
            </div>
          </nav>
          <ul className="nav nav-underline justify-content-center mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <h5>Users</h5>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "cities" ? "active" : ""}`}
                onClick={() => setActiveTab("cities")}
              >
                <h5>Cities</h5>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}
              >
                <h5>Posts</h5>
              </button>
            </li>
          </ul>
          <div className="container">
            <div className="row justify-content-center">
              {activeTab === "users" && <SearchUser users={users} />}
              {activeTab === "cities" && loading && <Spinner />}
              {activeTab === "cities" && !loading && (<SearchCities cities={cities} />)}
              {activeTab === "posts" && <SearchPosts posts={posts} />}
            </div>
          </div>
        </div>
        <div className="col-lg-3 d-none d-lg-block">
          <RightNav />
        </div>
      </div>
    </div>
  );
};
export default Search;
