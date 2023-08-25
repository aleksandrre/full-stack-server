import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContex";

function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();
  console.log(listOfPosts);
  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);
  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username:{username}</h1>
        {authState.username === username && (
          <button onClick={() => navigate("/changepassword")}>
            Chane My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => (
          <div key={key} className="listDiv">
            <div>
              <h2>{value.title}</h2>
            </div>
            <div
              onClick={() => navigate(`/postid/${value.id}`)}
              className="postText"
            >
              {value.postText}
            </div>
            <div>
              <h2>{value.username}</h2>
            </div>
            <label>Likes: {value.Likes.length}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
