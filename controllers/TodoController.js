const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
});

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.getAllTodos();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting todos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.getTodoById(id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting todo' });
  }
});

router.post('/', async (req, res) => {
  try {
    const title = req.body.title;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const newTodo = await Todo.createTodo(title);
    res.json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating todo' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const completed = req.body.completed;
    if (!title && !completed) return res.status(400).json({ message: 'Title or completed is required' });
    const updatedTodo = await Todo.updateTodo(id, title, completed);
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating todo' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Todo.deleteTodo(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

module.exports = router;