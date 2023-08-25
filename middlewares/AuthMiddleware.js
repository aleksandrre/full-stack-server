const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    return res.json({ error: "User not logged in!" });
  } else {
    try {
      const validToken = verify(accessToken, "importantsecret");
      // console.log("this is valid token-------------" + validToken);
      req.user = validToken;
      // const username = validToken.username;
      if (validToken) {
        return next();
      }
    } catch (err) {
      return res.json({ error: err });
    }
  }
};

module.exports = { validateToken };
