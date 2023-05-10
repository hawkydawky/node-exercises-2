import express from "express";
import morgan from "morgan";
import "express-async-errors";
import { getAll, getOneById, create, updateById, deleteById } from "./controllers/planets.js"

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());



app.get("/", (req, res) => {
  res.status(200).json({ msg: "hello world" });
});

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById)

app.delete("/api/planets/:id", deleteById)

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
