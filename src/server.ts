import fastify from "fastify";
import { uuid } from "uuidv4";

const app = fastify();

interface ITasks {
  id: string;
  title: string;
  description: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string | null;
}

let tasks: ITasks[] = [
  {
    id: uuid(),
    title: "Dance",
    description: "Need dance",
    completed_at: "15/12/2023",
    created_at: "12/12/2023",
    updated_at: null,
  },
];

app.get("/tasks", (req, res) => {
  const { title, description } = req.query as Pick<
    ITasks,
    "description" | "title"
  >;

  if (title && !description) {
    const tasksFiltered = tasks.filter((item) =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );

    res.send(tasksFiltered);
  }

  if (description && !title) {
    const tasksFiltered = tasks.filter((item) =>
      item.description.toLowerCase().includes(description.toLowerCase())
    );

    res.send(tasksFiltered);
  }

  if (description && title) {
    const tasksFiltered = tasks.filter(
      (item) =>
        item.description.toLowerCase().includes(description.toLowerCase()) &&
        item.title.toLowerCase().includes(title.toLowerCase())
    );

    res.send(tasksFiltered);
  }

  return res.send(tasks);
});

app.post("/tasks", (req, res) => {
  const { description, title } = req.body as Pick<
    ITasks,
    "description" | "title"
  >;

  tasks.push({
    id: uuid(),
    completed_at: null,
    created_at: new Date().toLocaleDateString(),
    description,
    title,
    updated_at: null,
  });

  return res.send("Task created!");
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params as { id: string };
  const { description, title } = req.body as Pick<
    ITasks,
    "description" | "title"
  >;

  const task = tasks.find((item) => item.id === id);

  if (!task) res.status(400).send("This task does not exist");

  task!.description = !!description ? description : task!.description;
  task!.title = !!title ? title : task!.title;
  task!.updated_at = new Date().toLocaleDateString();

  return res.send(task);
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params as { id: string };
  const taskFiltered = tasks.filter((item) => item.id !== id);

  if (tasks.length === taskFiltered.length)
    res.status(400).send("This task does not exist");

  tasks = taskFiltered;
  res.send(tasks);
});

app.patch("/tasks/:id/complete", (req, res) => {
  const { id } = req.params as { id: string };

  const tasksCopied = [...tasks];
  const task = tasksCopied.find((item) => item.id === id);

  if (!task) res.status(400).send("This task does not exist");

  task!.completed_at = !task!.completed_at
    ? new Date().toLocaleDateString()
    : null;

  tasks = tasksCopied;
  return res.send(tasksCopied);
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running!");
  });
