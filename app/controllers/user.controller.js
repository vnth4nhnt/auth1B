// return public & protected content
exports.allAccess = (req, res) => {
    return res.status(200).send('Public Content.')
}

exports.userBoard = (req, res) => {
    return res.status(200).send('User Content.')
}

exports.adminBoard = (req, res) => {
    return res.status(200).send('Admin Content.')
}

exports.moderatorBoard = (req, res) => {
    return res.status(200).send('Moderator Content.')
}