const enviroment = require('./server-enviroment')();
const path = require('path');
const port = normalizePort(process.env.PORT || '3000');

module.exports = (app, express) => {
    //settings
    
    const viewsPath =  __dirname.substring(0,__dirname.length-4) + '/views/';
    app.set('port', port);
    app.set('json spaces', 2);
    app.set('views', path.join(viewsPath));
    app.set('view engine', 'pug');
}

function normalizePort(val) {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  