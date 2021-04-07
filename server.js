const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());

const { getTodos, createTodo, removeTodo, updateTodo, toggleTodo } = require('./dao/todosDAO');

app.post('/add_todo', async (req, res) => {
  const createResult = await createTodo(req.body);

  if (createResult === 'Query Error') res.send(false);
  else {
    // 요청받은 이메일에 해당하는 유저가 있을때 유저 객체 응답
    const { insertId } = createResult;
    // console.log(inserId);
    const responseObj = { id: insertId, title: req.body.title, completed: false };
    res.send(responseObj);
  }
});

app.get('/fetch_todo', async (req, res) => {
  const [todos] = await getTodos();
  res.send(todos);
});

app.patch('/update_todo', async (req, res) => {
  const updateResult = await updateTodo(req.body);
  res.send(updateResult.affectedRows ? req.body : false);
});

app.patch('/toggle_todo', async (req, res) => {
  const toggleResult = await toggleTodo(req.body);
  const completed = !req.body.completed;
  res.send(toggleResult.affectedRows ? { ...req.body, completed } : false);
});

app.delete('/remove_todo', async (req, res) => {
  const removeResult = await removeTodo(req.body.id);
  res.send(removeResult ? true : false);
});

app.set('port', process.env.PORT || 3003);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
