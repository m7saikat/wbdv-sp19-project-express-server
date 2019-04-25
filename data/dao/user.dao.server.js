const userModel = require('../models/user/user.model.server');

createUser = (user) => userModel.create(user).then((user) => {
    return user
}).catch((e)=> e.errmsg);

updateUser = (userId, user) => userModel.update({_id:userId},{$set: user}).catch((e)=> e.errmsg);

deleteUser = (userId) => userModel.remove({_id:userId}).catch((e)=> e.errmsg);

findAllUsers = () => userModel.find();

findUsersById = (userId) => userModel.findById(userId);

findUsersByEmail = (email) =>
{
    // console.log("from DB -->", userModel.findOne({email: email}));
    return userModel.findOne({email: email}).catch(e => e.errmsg);
};

findUsersByUsername = (username) =>
{
    // console.log("dao-->", username);
    return userModel.findOne({username: username}).catch(e => e.errmsg);
};

findUserByEmail = (useremail) => userModel.findOne({email: useremail});

populateUsersSchema = () => {

    // Populate Users
    const admin = {
        username: "admin",
        password: "admin",
        email: "admin@xyz.com",
        role: "ADMIN"
    };
    createUser(admin);

    return { "message": "Populated database successfully"};
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    findUsersById,
    findAllUsers,
    populateUsersSchema,
    findUsersByUsername,
    findUsersByEmail,
    findUserByEmail
};
