const enviroment = require('./server-enviroment')();

module.exports = (app, express) => {
    //starting server
    app.listen(3000, () => {
        console.log(`Server on port: ${app.get('port')}, enviroment: ${enviroment.mode}`);
    });
}