const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let todos = [];

app.get('/', (req, res) => {
    res.render('index', { todos });
});

app.post('/todos/add', (req, res) => {
    const todo = req.body.todo;
    todos.push(todo);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
