const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {

    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) return res.status(403).json({ message: "Token is invalid!!" });
      req.user = data;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res , () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json({msg: "Unauthorized"})
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res , () => {
      if(req.user.isAdmin){
          next()
      }else{
          res.status(403).json({msg: "Unauthorized"})
      }
  })
}

module.exports = {verifyToken, verifyTokenAndAuthorization , verifyTokenAndAdmin}