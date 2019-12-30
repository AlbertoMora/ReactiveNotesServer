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
            [dbContext.Sequelize.Op.or]: [{ email: email?email:null }, { username: username?username:null }]
        }
    })
        .then(async data => {
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
            res.status(500).json({ "statusMsg": `An unexpected error has occurred. Please, contact our support team to get help. errDet: ${err}` });
        });
}

usersController.logout = (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({"status":"ok", "statusMsg":"Session has been destroyed successfully."});
    } catch (e) {
        res.status(500).json({ "status": "failed", "errDet": e });
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
                    fields: ['name', 'surname', 'email', 'username', 'hashed_password', 'sign_up_date', 'acc_locked_until', 'img_uri', 'salt']
                })
                .then(user => {
                    res.status(200).json({
                        "status": "OK",
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
    const userId = req.params.id;
    const { name, surname, email, username, pass, img_uri } = req.body;
    let values;
    let fields;
    if (pass) {
        const hashed_password = await argon.hash(pass);
        values = {
            name,
            surname,
            email,
            username,
            hashed_password,
            img_uri
        };
        fields = ['name', 'surname', 'email', 'username', 'hashed_password', 'img_uri'];
    } else {
        values = {
            name,
            surname,
            email,
            username,
            img_uri
        }
        fields = ['name', 'surname', 'email', 'username', 'img_uri'];
    }

    dbContext.user.update(values,
        {
            fields,
            where: { id: userId }
        })
        .then(result => {
            res.status(200).json({ "status": "OK", "msg": "User has been updated successfully." })
        })
        .catch(err => {
            res.status(500).json({
                status: "ERROR",
                errMsg: `An unexpected error has occurred. Please, contact our support team. Error Info: ${err}`,
                errInfo: err
            });
        });
}
usersController.deleteUserById = (req, res) => {
    var userId = req.params.id;
    if (userId) {
        dbContext.user.destroy({ where: { id: userId } })
            .then(result => {
                res.status(200).json({
                    "status": "OK",
                    "msg": "User has been deleted successfully."
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
        res.status(500).json({ "error": "Invalid Format: Id is required to complete this request." });
    }
}

//Generic Funcs
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