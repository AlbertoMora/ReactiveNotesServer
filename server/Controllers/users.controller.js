const dbContext = require('../../models/db.context');

usersController = {}

usersController.getAllUsers = async (req, res) => {
    dbContext.user.findAll()
        .then(data => {
            res.json({
                status: "OK",
                data: data
            });
        })
        .catch(err => {
            res.json({
                status: "ERROR",
                errMsg: `An unexpected error has occurred. Please, contact our support team`,
                errInfo: err
            });
        });
}
usersController.login = (req, res) => {
    const { username, email, pass } = req.body;
    var params = [];
    var loginFunc = (field) => {
        var sql = "SELECT id, hashed_password, acc_locked_until from users WHERE " + field + "=@" + field;
        var val = field == "username" ? username : email;
        connection.paramBuilder(params, field, TYPES.VarChar, val);
        connection.query(sql, params, async (result) => {
            if (result.length > 0) {
                var check = await argon.verify(result[0].hashed_password, pass);
                if (check === true) {
                    params = [];
                    sql = "SELECT name,surname,email,username,img_uri,acc_locked_until FROM users WHERE id=@id";
                    connection.paramBuilder(params, "id", TYPES.Int, result[0].id);
                    connection.query(sql, params, (r) => {
                        res.json({ "status": "ok", "result": r });
                    });
                } else {
                    res.status(401).json({ "error": "Password doesn't match." });
                }
            } else {
                res.status(401).json({ "error": "Username or Password doesn't match." });
            }
        });
    }
    if (username) {
        loginFunc("username");
    } else if (email) {
        loginFunc("email");
    } else {
        res.status(500).json({ "error": "Invalid Format:Username or Email are required" });
    }
}

usersController.createNewUser = async (req, res) => {

    const { name, surname, email, username, pass, img_uri } = req.body;

    if (name && surname && email && pass && username) {
        if (checkEmail(email)) {
            var params = [];
            var hashed_password = await argon.hash(pass, argonOptions);
            var date = new Date();
            var today = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            var sql = img_uri ? `INSERT INTO users(name,surname,email,username,hashed_password,sign_up_date,img_uri) 
            VALUES(@name,@surname,@email,@username,@hashed_password,@sign_up_date,@img_uri);`
                :
                `INSERT INTO users(name,surname,email,username,hashed_password,sign_up_date) 
                    VALUES(@name,@surname,@email,@username,@hashed_password,@sign_up_date);`;

            connection.paramBuilder(params, "name", TYPES.VarChar, name);
            connection.paramBuilder(params, "surname", TYPES.VarChar, surname);
            connection.paramBuilder(params, "email", TYPES.VarChar, email);
            connection.paramBuilder(params, "username", TYPES.VarChar, username);
            connection.paramBuilder(params, "hashed_password", TYPES.VarChar, hashed_password);
            connection.paramBuilder(params, "sign_up_date", TYPES.Date, today);
            if (img_uri);
            connection.paramBuilder(params, "img_uri", TYPES.VarChar, img_uri);
            var callback = (result) => {
                if (result && result.errorCode !== "EREQUEST") {
                    res.json({ "status": "OK", "insertedId": result[0].id });
                } else {
                    res.status(500).json({
                        "error": "Ups! There was an internal server error, please try later",
                        "details": result
                    });
                }
            }
            sql += " SELECT @@identity as id";
            connection.query(sql, params, callback);
        } else {
            res.status(400).json({ "error": "Invalid Format: the email is not valid." });
        }
    } else {
        res.status(400).json({ "error": "Invalid Format: Name, Surname, Email, Username and Pass are required" });
    }
}
usersController.getUserById = async (req, res) => {
    var userId = req.params.id;
    var params = [];
    var sql = `
        SELECT name,surname,email,username,img_uri,acc_locked_until
        FROM users
        where id=@id
    `;
    connection.paramBuilder(params, 'id', TYPES.Int, userId);
    connection.query(sql, params, (result) => {
        if (result && result.errorCode !== "EREQUEST") {
            res.json({ "status": "OK", "result": result });
        } else {
            res.status(500).json({
                "error": "Ups! There was an internal server error, please try later",
                "details": result
            });
        }
    });

}
usersController.updateUserById = async (req, res) => {
    var userId = req.params.id;
    var params = [];
    connection.paramBuilder(params, "id", TYPES.Int, userId);
    var sql = "";
    const { name, surname, email, username, pass } = req.body;
    if (name && surname && email && username) {
        if (checkEmail(email)) {
            sql += `UPDATE users 
                SET name=@name,
                    surname=@surname,
                    email=@email,
                    username=@username
                    `;
            connection.paramBuilder(params, "name", TYPES.VarChar, name);
            connection.paramBuilder(params, "surname", TYPES.VarChar, surname);
            connection.paramBuilder(params, "email", TYPES.VarChar, email);
            connection.paramBuilder(params, "username", TYPES.VarChar, username);
        } else {
            res.status(400).json({ "error": "Invalid Format: the email is not valid." });
        }
    } else {
        res.status(400).json({ "error": "Invalid Format: Name, Surname, Email and Username are required" });
    }

    if (pass) {
        hashed_password = argon.hash(pass, argonOptions);
        sql += ", hashed_password=@hashed_password";
        connection.paramBuilder(params, "name", TYPES.VarChar, hashed_password);
    }
    sql += " WHERE id=@id";
    connection.paramBuilder(params, "id", TYPES.Int, userId);

    connection.query(sql, params, (result) => {
        if (result && result.errorCode !== "EREQUEST") {
            res.json({ "status": "OK" });
        } else {
            res.status(500).json({
                "error": "Ups! There was an internal server error, please try later",
                "details": result
            });
        }
    });
}
usersController.deleteUserById = (req, res) => {
    var userId = req.params.id;
    var sql = "DELETE FROM users WHERE id=@id";
    var params = [];
    if (userId) {
        connection.paramBuilder(params, "id", TYPES.Int, userId);
        var callback = (result) => {
            if (result && result.errorCode !== "EREQUEST") {
                res.json({ "status": "OK" });
            } else {
                res.status(500).json({
                    "error": "Ups! There was an internal server error, please try later",
                    "details": result
                });
            }
        }
        connection.query(sql, params, callback);
    } else {
        res.status(500).json({ "error": "Invalid Format: Id is required to complete this request." });
    }
}
function checkEmail(email) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

module.exports = usersController;