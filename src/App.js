import "./App.css";
import CreatePost from "./pages/CreatePost";
import DirectPage from "./pages/DirectPage";
import ChangePassword from "./pages/ChangePassword";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/AuthContex";
import { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./pages/Profile";
function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,

    status: !localStorage.getItem("accessToken") ? false : true,
  });
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <BrowserRouter>
          {!authState.status ? (
            <div className="navbarDiv11">
              <Link to="/login">Login</Link>
              <Link to="/registration">REgistration</Link>
            </div>
          ) : (
            <div className="navbarDiv">
              <div className="home-createPost">
                <Link to="/">Home</Link>
                <Link to="/createpost">Create A Post</Link>
              </div>
              <div className="username-logOut">
                <h1>{authState.username}</h1>
                <button className="logOutBtn" onClick={logout}>
                  Log Out
                </button>
              </div>
            </div>
          )}
          <div className="routes">
            <Routes>
              <Route path="/" Component={Home} />
              <Route path="/createpost" Component={CreatePost} />
              <Route path="/postid/:id" Component={DirectPage} />
              <Route path="/registration" Component={Registration} />
              <Route path="/login" Component={Login} />
              <Route path="/profile/:id" Component={Profile} />
              <Route path="/changepassword" Component={ChangePassword} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
