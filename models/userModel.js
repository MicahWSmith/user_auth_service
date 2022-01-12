// this file stores the "customer" model (model is table schema in sequelize lingo)

// this is a function that would take the sequelize instance and DT Class
// and return a Customer model object
module.exports = (sequelize, DataTypes) => {

    // Define a new model, representing a table in the database.
    // modelName is 'customer' (first argument of define function)
    // When synced, this will create a table name of "modelName" + "s", i.e. "customers"
    const User = sequelize.define('user', {
        id: { // the id will be our primary key for accessing customer data
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        security_question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        security_answer: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return User
}