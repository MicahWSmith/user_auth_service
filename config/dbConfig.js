// store the configuration secrets of the PG DB here
module.exports = {
    HOST: 'rds-activity-1.cj5hu7ak0gdn.us-east-1.rds.amazonaws.com', // your endpoint
    USER: 'postgres', // your username
    PASSWORD: 'postgres', // your password
    DB: 'users_db', // your db name
    dialect: 'postgres',
    }