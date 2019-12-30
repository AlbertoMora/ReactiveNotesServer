module.exports = function (sequelize, Sequelize) {
    const user = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        surname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        email: {
            type: Sequelize.STRING,
            notEmpty: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        username: {
            type: Sequelize.STRING,
            notEmpty: false,
            unique: true
        },
        hashed_password: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        sign_up_date: {
            type: Sequelize.DATE,
            notEmpty: true
        },
        acc_locked_until: {
            type: Sequelize.DATE,
            notEmpty: false
        },
        img_uri: {
            type: Sequelize.STRING,
            notEmpty: false
        },
        salt: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });

    return user;
}