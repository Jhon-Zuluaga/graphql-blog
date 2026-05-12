

const authenticate = (req, res, next) => {
    Authorization : 'Bearer '

    const token = req.headers.authorization
    console.log(token)
    next()
}

module.exports = { 
    authenticate
}