const enviroment = require('./server-enviroment')();
const path = require('path');
const port = process.env.PORT || '3000';

module.exports = (app, express) => {
    //settings
    
    const viewsPath =  path.join(__dirname.substring(0,__dirname.length-4), '/views/');
    app.set('port', port);
    app.set('json spaces', 2);
    app.set('view engine', 'pug');
    app.set('views', viewsPath);  
}
  