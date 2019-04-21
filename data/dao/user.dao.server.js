const userModel = require('../models/user/user.model.server');

createUser = (user) => userModel.create(user).then((user) => {
    return user
}).catch((e)=> e.errmsg);

updateUser = (userId, user) => userModel.update({_id:userId},{$set: user}).catch((e)=> e.errmsg);

deleteUser = (userId) => userModel.remove({_id:userId}).catch((e)=> e.errmsg);

findAllUsers = () => userModel.find();

findUsersById = (studentId) => userModel.findById(studentId);

findUsersByUsername = (username) => userModel.findOne({username: username});

findUserByEmail = (useremail) => userModel.findOne({email: useremail});

populateUsersSchema = () => {

    // Populate Users
    const alice = {
        _id: 123,
        firstName: "Alice",
        lastName: "Wonderland",
        username: "alice",
        password: "alice",
        image: "URL",
        email: "alice@wonderland.com"
    };
    const bob = {
        _id: 234,
        firstName: "Bob",
        lastName: "Builder",
        username: "bob",
        password: "bob",
        image: "URL",
        email: "bob@theBuilder.com"
    };
    createUser(alice);
    createUser(bob);

    return { "message": "Populated database successfully"};
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    findUsersById,
    findAllUsers,
    populateUsersSchema,
    findUsersByUsername
};
