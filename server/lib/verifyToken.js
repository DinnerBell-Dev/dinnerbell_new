const jwt = require('jsonwebtoken');
const constants = require("../config/constants");
var verifyToken =  async (req, res, next)=> {
    // check header or url parameters or post parameters for token
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        var token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    try {
        // verifies secret and checks exp
        const decoded = await jwt.verify(token, constants.jwt.JWT_ENCRYPTION);
        req.email = decoded.email;
        req.empToken = decoded.empToken;
        next();
    } catch (err) {
        res.status(500).send({ auth: false, message: err });
    }
};
module.exports = verifyToken;