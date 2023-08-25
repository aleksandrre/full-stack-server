import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContex";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input Title"),
    postText: Yup.string().required(),
  });
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => navigate("/"));
  };
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="form">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            className="field"
            id="inputCreatePost"
            name="title"
            placeholder="(EX.Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            className="field"
            id="inputCreatePost"
            name="postText"
            placeholder="(EX.Post...)"
          />

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
