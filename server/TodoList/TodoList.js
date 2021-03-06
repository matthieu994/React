var Todo = require("../models/TodoSchema");
var tools = require("../Auth/Tools");

module.exports = function(app) {
    app.get("/todos", (req, res) => {
        tools.getUser(req.headers.authorization, res, "todos").then(user => {
            if (!user.todos) return;
            let todosArray = [];
            var promises = user.todos.map((el, index) => {
                return Todo.findOne(el).then(todo => {
                    todosArray[index] = todo;
                });
            });
            Promise.all(promises).then(function(results) {
                res.send(todosArray);
            });
        });
    });

    app.post("/todos", (req, res) => {
        tools.getUser(req.headers.authorization, res).then(user => {
            var todo = new Todo({ text: req.body.text });
            user.todos.push(todo);
            todo.save();
            user.save();
            res.sendStatus(200);
        });
    });

    app.put("/todos", (req, res) => {
        Todo.findById(req.body.id, function(err, todo) {
            if (err) throw err;
            if (req.body.text != undefined) todo.text = req.body.text;
            if (req.body.done != undefined) todo.done = req.body.done;
            todo.save(function(err) {
                if (err) throw err;
                res.sendStatus(200);
            });
        });
    });

    app.delete("/todos", (req, res) => {
        Todo.deleteOne({ _id: req.body.id }, function(err) {
            if (err) return handleError(err);
            res.sendStatus(200);
        });
    });
};
