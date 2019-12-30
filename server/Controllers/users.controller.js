const dbContext = require('../../models/db.context');
const argon = require('@phc/argon2');

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
usersController.login = async (req, res) => {
    const { username, email, pass } = req.body;

    dbContext.user.findAll({
        attributes: ['id', 'hashed_password', 'acc_locked_until'],
        where: {
            [Op.or]: [{ email: email }, { username: username }]
        }
    })
        .then( async data => {
            if (data.length > 0) {
                const check = await argon.verify(data[0].hashed_password, pass)
                if (check) {
                    req.session.userId = data[0].id;
                    res.status(200).json({ "statusMsg": "ok" }).redirect('/home');
                } else {
                    res.status(403).json({ "statusMsg": "Wrong login data" }).redirect('/users/login');
                }
            } else {
                res.status(403).json({ "statusMsg": "Wrong login data" }).redirect('/users/login');
            }
        })
        .catch(err => {
            res.status(500).json({ "statusMsg": "An unexpected error has occurred. Please, contact our support team to get help." });
        });
}

usersController.logout = (req, res) => {
    try {
        res.session.destroy();
        res.status(200).redirect('/users/login');
    } catch (e) {
        res.json({ "status": "failed", "errDet": e });
    }
}

usersController.createNewUser = async (req, res) => {

    const { name, surname, email, username, pass, img_uri } = req.body;

    if (name && surname && email && pass && username) {
        if (checkEmail(email)) {
            var hashed_password = await argon.hash(pass);
            dbContext.user.create({
                name: name,
                surname: surname,
                email: email,
                username: username,
                hashed_password: hashed_password,
                sign_up_date: dbContext.sequelize.fn('GETDATE'),
                acc_locked_until: null,
                img_uri: img_uri,
                salt: generateRandomSalt()
            },
                {
                    fields: ['name','surname','email','username','hashed_password', 'sign_up_date', 'acc_locked_until', 'img_uri', 'salt']
                })
                .then(user => {
                    res.status(200).json({
                        "status":"OK",
                        "userId": user.id
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: "ERROR",
                        errMsg: `An unexpected error has occurred. Please, contact our support team. Error Info: ${err}`,
                        errInfo: err
                    });
                });

        } else {
            res.status(400).json({ "error": "Invalid Format: the email is not valid." });
        }
    } else {
        res.status(400).json({ "error": "Invalid Format: Name, Surname, Email, Username and Pass are required" });
    }
}
usersController.getUserById = async (req, res) => {
    var userId = req.params.id;
    dbContext.user.findAll({
        where: {
            id: userId
        }
    })
        .then(data => {
            res.json({
                status: "OK",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: "ERROR",
                errMsg: `An unexpected error has occurred. Please, contact our support team. Error Info: ${err}`,
                errInfo: err
            });
        });
}
usersController.updateUserById = async (req, res) => {
    var userId = req.params.id;
    
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
function generateRandomSalt() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < 30; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
module.exports = usersController;