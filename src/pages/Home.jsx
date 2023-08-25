import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContex";
function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  useEffect(() => {
    console.log("authhhhhhh " + authState.status);
    if (!authState.status) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts?.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);
  console.log(listOfPosts);
  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };
  return (
    <div className="homeDiv">
      {listOfPosts?.map((value, key) => (
        <div key={key} className="listDiv">
          <div className="titleDiv">
            <h2>{value.title}</h2>
          </div>
          <div
            onClick={() => navigate(`/postid/${value.id}`)}
            className="postText"
          >
            {value.postText}
          </div>
          <div>
            <Link to={`/profile/${value.UserId}`}>
              <h2>{value.username}</h2>
            </Link>
          </div>
          <button
            onClick={() => {
              likeAPost(value.id);
            }}
            className={likedPosts.includes(value.id) ? "unlikebtn" : "likebtn"}
          >
            Like
          </button>
          <label>{value.Likes.length}</label>
        </div>
      ))}
    </div>
  );
}

export default Home;
