var Todo = require('../models/TodoSchema');

module.exports = function (app) {
    app.get('/todos', (req, res) => {
        Todo.find(function (err, todos) {
            if (err) return console.error(err);
            res.send(JSON.stringify(todos));
        })
    });

    app.post('/todos', (req, res) => {
        var todo = new Todo({ text: req.body.text });
        todo.save();
        res.sendStatus(200);
    });

    app.put('/todos', (req, res) => {
        Todo.findById(req.body.id, function (err, todo) {
            if (err) throw err;
            if (req.body.text != undefined)
                todo.text = req.body.text;
            if (req.body.done != undefined)
                todo.done = req.body.done;
            todo.save(function (err) {
                if (err) throw err;
                res.sendStatus(200);
            });
        });
    });

    app.delete('/todos', (req, res) => {
        Todo.deleteOne({ _id: req.body.id }, function (err) {
            if (err) return handleError(err);
            res.sendStatus(200);
        });
    });
}