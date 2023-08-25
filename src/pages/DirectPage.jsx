import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContex";
function DirectPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/postid/${id}`)
      .then((response) => setPost(response.data));

    axios
      .get(`http://localhost:3001/comments/${id}`)
      .then((response) => setComments(response.data));
  }, []);

  const addComment = () => {
    // console.log(localStorage.getItem("accesToken"));
    if (newComment) {
      axios
        .post(
          "http://localhost:3001/comments",
          {
            commentBody: newComment,
            PostId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.error) {
            alert(response.data.error);
          } else {
            setComments([
              ...comments,
              {
                commentBody: newComment,
                username: response.data.username,
              },
            ]);
            setNewComment("");
          }
        });
    }
  };
  const deleteComment = (id) => {
    // alert("ooookkii");
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        `http://localhost:3001/posts/title`,
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPost({ ...post, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text");
      axios.put(
        `http://localhost:3001/posts/postText`,
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPost({ ...post, postText: newPostText });
    }
  };
  return (
    <div className="DirectPostPage">
      <div className="leftSide">
        <div className="listDiv">
          <div
            className="titleDiv"
            onClick={() => {
              if (authState.username === post.username) {
                editPost("title");
              }
            }}
          >
            <h2>{post?.title}</h2>
          </div>
          <div
            onClick={() => {
              if (authState.username === post.username) {
                editPost("body");
              }
            }}
            className="postText"
          >
            {post?.postText}
          </div>

          <div>
            <h2>{post?.username}</h2>
          </div>
          {authState.username === post?.username && (
            <button onClick={() => deletePost(post.id)}>delete Post</button>
          )}
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentCounteiner">
          <input
            type="text"
            value={newComment}
            placeholder="Comment..."
            autoComplete="off"
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => (
            <div key={key} className="comment">
              <label>{comment.username}-</label>
              {" " + comment.commentBody + " "}
              {authState.username === comment.username && (
                <button onClick={() => deleteComment(comment.id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DirectPage;
