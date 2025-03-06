import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`);
    const todos = getTodos.all(req.userId);
    res.json(todos);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

router.post("/", (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: "Task is required" });
  }

  try {
    const addTodo = db.prepare(
      `INSERT INTO todos (user_id, task) VALUES (?, ?)`
    );
    const result = addTodo.run(req.userId, task);
    res.json({ id: result.lastInsertRowid, task, complted: 0 });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const { page } = req.query;

  const updateTodo = db.prepare(
    `UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?`
  );
  updateTodo.run(completed, id, req.userId);
  res.json({ message: "Todo updated" });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  const deleteTodo = db.prepare(
    `DELETE FROM todos WHERE id = ? AND user_id = ?`
  );
  deleteTodo.run(id, req.userId);
  res.json({ message: "Todo deleted" });
});

export default router;
