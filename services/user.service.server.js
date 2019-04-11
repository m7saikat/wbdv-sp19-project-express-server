module.exports = app => {

    const dao = require('../data/dao/user.dao.server');

    app.post('/api/populate', (req, res)=> {
        res.send(dao.populateUsersSchema())
    });

    //User Schema CRUD operations
    app.get('/api/student', (req, res) => {
        console.log("finding users");
        dao.findAllUsers().then(users => res.send(users))
    });

    app.get('/api/student/:id', (req, res) => {
        const studentId = req.params.id;
        dao.findUsersById(studentId).then(student => res.send(student))
    });

    app.post('/api/student', (req, res) => {
        const student = req.body;
        dao.createUser(student).then(student => res.send(student))
    });

    app.put('/api/student/:id', (req, res) => {
        const student = req.body;
        const studentId = req.params.id;
        dao.updateUser(studentId,student).then(status => res.send(status))
    });

    app.delete('/api/student/:id', (req, res) => {
        const studentId = req.params.id;
        dao.deleteUser(studentId).then(status => res.send(status));
    });
};