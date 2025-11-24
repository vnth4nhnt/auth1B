// return public & protected content
exports.allAccess = (req, res) => {
    console.log('GET /api/test/all route was accessed')
    res.status(200).send('Public Content.')
}

exports.userBoard = (req, res) => {
    console.log('GET /api/test/user route was accessed')
    res.status(200).send('User Content.')
}

exports.adminBoard = (req, res) => {
    console.log('GET /api/test/admin route was accessed')
    res.status(200).send('Admin Content.')
}

exports.moderatorBoard = (req, res) => {
    console.log('GET /api/test/mod route was accessed')
    res.status(200).send('Moderator Content.')
}