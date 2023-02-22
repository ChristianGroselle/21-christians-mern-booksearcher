const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (context) {
    const { req } = context;

    // allows token to be sent via req.query or headers
    let token = req.headers.authorization || "";

    if (token) {
      token = token.replace("Bearer ", "");
    }

    if (!token) {
      throw new Error("You have no token!");
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      return { user: data };
    } catch (error) {
      console.log("Invalid token");
      throw new Error("Invalid token!");
    }
  },

  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
