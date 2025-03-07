import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({ where: { userId: req.userId } });
    res.json(todos);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

router.post("/", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ message: "Task is required" });
  }

  try {
    const todo = await prisma.todo.create({
      data: { task, userId: req.userId },
    });
    res.json(todo);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updateTodo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { completed: !!completed },
  });

  res.json(updateTodo);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await prisma.todo.delete({
    where: { id: parseInt(id), userId: req.userId },
  });
  res.json(deleteTodo);
});

export default router;
