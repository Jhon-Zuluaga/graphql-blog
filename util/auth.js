const jwt = require('jsonwebtoken');

const createJWTToken = user => {
    return jwt.sign({user}, 'jhonxyz123', {
        expiresIn: '1h'
    })
}

module.exports = { createJWTToken }