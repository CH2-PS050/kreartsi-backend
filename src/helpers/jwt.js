const jwt = require('jsonwebtoken');
const SECRET_KEY = "inis3cr3tk3y";

function generateToken(payload) {
    const token = jwt.sign(payload, SECRET_KEY);
    return token;
};

function verifyToken(token) {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
}

module.exports = { generateToken, verifyToken };