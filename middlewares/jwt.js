const { expressjwt: jwt } = require('express-jwt');

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request headers
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") { // Ejemplo: Bearer kdjekdncewnoeiñfewf
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}

const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders//token
  });


// const checkAuthenticated = async (req, res, next) => {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.split(" ")[1];
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.payload = decoded;
//       console.log(req.payload)
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   next();
// };


const isAdmin = (req, res, next) => {
  if (req.payload.role === 'admin') {
    next()
  } else {
    res.status(401).json({ message: 'User is not admin'})
    return;
  }
}

module.exports = {
  isAuthenticated,
  isAdmin
}

