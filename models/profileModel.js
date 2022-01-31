
module.exports = (sequelize, DataTypes) => {

    const Profile = sequelize.define('profile', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        ssn: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        routing_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        street_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    
    return Profile
}