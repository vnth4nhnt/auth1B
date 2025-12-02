module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define('refreshTokens', {
        token: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })
    return RefreshToken
}