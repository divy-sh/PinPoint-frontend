import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import * as client from "../Home/client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addPost } from "../Home/reducer";
import { User } from "../User/reducer";
import { Post } from "../Home/reducer";
import _ from "lodash";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = ({ isOpen, onClose }: { isOpen: boolean; onClose: any }) => {
  const [image, setImage] = useState("");
  const userObj: User = useSelector((state: any) => state.userReducer.user);
  const [searchValues, setSearchValues] = useState<any>([]);
  const [voteOptions, setVoteOptions] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const cleanupFunction = () => {
      if (!isOpen) {
        setImage("");
        setVoteOptions({
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
        });
        setShowDropdown(false);
        setSearchValues([]);
      }
    };
    return cleanupFunction;
  }, [isOpen]);

  const handleSubmit = async (e: any) => {
    var post: Post = {
      userid: userObj._id,
      image: image,
      options: voteOptions,
      date: new Date().toISOString(),
      reactions: [],
      user: userObj
    };
    setShowDropdown(false);
    // post.user = userObj;
    await client.createPost(post);
    dispatch(addPost(post));
    navigate("/");
  };

  const SearchDropdown = () => {
    return (
      <div className="dropdown">
        {searchValues.map((result: any, index: any) => (
          <div
            key={index}
            className="dropdown-item"
            onClick={() => {
              getCitiesFromLocation({
                latitude: result.geometry.coordinates[1],
                longitude: result.geometry.coordinates[0],
              });
            }}
          >
            {result.properties.display_name}
          </div>
        ))}
      </div>
    );
  };

  const handleItemClick = (result: any) => {
    setVoteOptions({ ...voteOptions, 5: result });
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
          const canvas = document.createElement("canvas");
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

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const resizedArrayBuffer = canvas.toDataURL();
          setImage(resizedArrayBuffer);
        };
      };
    }
  };

  const handleSearch = async (value: any) => {
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
      setSearchValues(
        response.data.features.filter(
          (e: any) =>
            e.properties.addresstype === "city" ||
            e.properties.addresstype === "town",
        ),
      );
    } catch (error :any) {
      toast.error(error.response.data);
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearchDebounced = _.debounce(handleSearch, 500);

  const getCitiesFromLocation = ({
    longitude,
    latitude,
  }: {
    longitude: any;
    latitude: any;
  }) => {
    setSearchValues([]);
    const radius = 50000;
    const targetLatitude = latitude;
    const targetLongitude = longitude;
    const query = `
          [out:json];
          node
            [place=city]
            (around:${radius},${targetLatitude},${targetLongitude});
          out;
        `;
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    axios
      .post(overpassUrl, query, {
        headers: {
          "Content-Type": "application/xml",
        },
      })
      .then((response) => {
        const nearestCities = response.data.elements
          .filter((element: { type: string }) => element.type === "node")
          .map((node: { tags: { name: any }; lat: any; lon: any }) => ({
            name: node.tags.name,
            latitude: node.lat,
            longitude: node.lon,
          }));
        setVoteOptions({
          1: nearestCities[0].name,
          2: nearestCities[1].name,
          3: nearestCities[2].name,
          4: nearestCities[3].name,
          5: "",
        });
        setShowDropdown(true);
      })
      .catch((error:any) => {
        toast.error(error.response.data);
        console.error(error);
      });
  };

  return (
    <Modal
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
        },
      }}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Post"
    >
      <ToastContainer/>
      <div style={{ textAlign: "center" }}>
        {image === "" && (
          <svg width="400" height="400" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#CCC" />
          </svg>
        )}
        {image !== "" && (
          <img
            alt="upload"
            width="400"
            height="400"
            style={{ objectFit: "cover" }}
            src={image}
          />
        )}
        <input
          type="file"
          className="form-control mt-1"
          id="image"
          onChange={handleFileChange}
        />
        {!showDropdown && (
          <input
            type="text"
            className="form-control mt-1"
            onChange={(e) => handleSearchDebounced(e.target.value)}
          />
        )}
        {searchValues.length > 0 && <SearchDropdown />}
        <div>
          {showDropdown && (
            <div className="dropdown">
              <p>Choose The Correct Option</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                {Object.entries(voteOptions)
                  .slice(0, 4)
                  .map(([key, value], index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        value={value}
                        checked={voteOptions[5] === value}
                        onChange={() => handleItemClick(value)}
                        style={{ marginRight: "8px" }}
                      />
                      <label>{value}</label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <button
          className={
            image === "" || voteOptions[5] === ""
              ? "btn btn-primary m-2 disabled"
              : "btn btn-primary m-2"
          }
          onClick={handleSubmit}
        >
          Post
        </button>
        <button className="btn btn-danger m-2" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default CreatePost;
