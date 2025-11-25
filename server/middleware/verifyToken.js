import jwt from "jsonwebtoken";

// 1. Verify the Token (Check if it's real)
export const verifyToken = (req, res, next) => {
  // Get token from the "token" header
  const authHeader = req.headers.token;

  if (authHeader) {
    // Tokens usually look like "Bearer <token>", so we split it if needed.
    // For simplicity, we assume you send just the token string.
    const token = authHeader.split(" ")[1]; // Assumes "Bearer <token>"

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user; // Add the user info to the request
      next(); // Pass to the next step
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// 2. Verify Admin (Check if the user is allowed to do this)
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next(); // You are the Admin, proceed!
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};
