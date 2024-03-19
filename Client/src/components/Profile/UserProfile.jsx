import { useEffect, useState } from "react";
import { getProfile, getRatings, updateProfile } from "../../Api/userApi";
import { FaUserCircle } from "react-icons/fa";
import Ratings from "./Ratings";
import CommonLoading from "../loader/CommonLoading";
import "./Profile.scss";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const UserProfile = ({ ownerId }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProfile(ownerId);
        if (!res.error) {
          setProfileData(res.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchData();
  }, [ownerId]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await getRatings(ownerId);
        if (!res.error) {
          setRatings(res.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setLoading(false);
      }
    };
    fetchRatings();
  }, [ownerId]);

  const updateDetails = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("about", profileData.about);
      formData.append("image", profileData.image);

      const res = await updateProfile(formData);

      if (res.error) {
        throw new Error("Failed to update profile details");
      }

      setProfileData(res.data);
      setPopUp(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[80px] my-auto">
      {profileData && (
        <div className="w-full">
          <div className="wrapper-profile mx-auto">
            <div className="profile">
              {profileData.imageUrl ? (
                <img
                  className="rounded-full"
                  src={`${BASE_URL}/${profileData.imageUrl}`}
                  alt={profileData.name}
                />
              ) : (
                <FaUserCircle className=" text-gray-500" />
              )}
              <div className="check">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="name">{profileData.name}</h3>
              <p className="title">About</p>
              <p className="description">{profileData.about}</p>
              <div className="w-full">
                <button
                  className="px-4 py-2 mx-auto bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out"
                  onClick={() => setPopUp(true)}
                >
                  Update Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {popUp && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 z-50">
            <div className="flex flex-col space-y-4 container mt-8">
              <textarea
                placeholder="Enter About"
                className="border border-gray-300 rounded-md px-3 py-2"
                value={profileData.about}
                onChange={(e) =>
                  setProfileData({ ...profileData, about: e.target.value })
                }
              ></textarea>
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) =>
                  setProfileData({ ...profileData, image: e.target.files[0] })
                }
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setPopUp(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={updateDetails}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <CommonLoading />}
      {ratings && <Ratings ratings={ratings} />}
    </div>
  );
};
