module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('roles', {
        id: {
            type: Sequelize.INTEGER, // = Sequelize.DataTypes.STRING
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

    return Role
}