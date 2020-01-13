module.exports = (sequelize, Sequelize) => {
    const session = sequelize.define('session', {
        sid: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        userId: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        expires: Sequelize.DATE,
        data: Sequelize.STRING(50000)
    });

    return session;
};