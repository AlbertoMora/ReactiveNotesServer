module.exports = (sequelize, Sequelize) => {
    const session = sequelize.define('Session', {
        sid: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        userId: Sequelize.STRING,
        expires: Sequelize.DATE,
        data: Sequelize.STRING(50000)
    });

    return session;
};