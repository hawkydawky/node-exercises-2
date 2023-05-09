import express, { Request, Response } from "express";
import morgan from "morgan";
import "express-async-errors";
import Joi from "joi";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];

const planetSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
})

app.get("/", (req, res) => {
  res.status(200).json({ msg: "hello world" });
});

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));

  res.status(200).json(planet);
});

app.post("/api/planets", (req, res) => {
  const { error, value } = planetSchema.validate(req.body);

  if (error) {
    res.status(400).json({error: error.details[0].message});
    return;
  }

  const { id, name } = value;
  const newPlanet = { id, name };
  planets = [...planets, newPlanet];

  res.status(201).json({ msg: "planet is created" });
});

app.put("/api/planets/:id", (req, res) => {
  const { error, value } = planetSchema.validate(req.body);

  if (error) {
    res.status(400).json({error: error.details[0].message});
    return;
  }

  const {id} = req.params;
  const {name} = value;
  planets = planets.map(p => p.id === Number(id) ? ({...p, name}) : p)

  res.status(200).json({ msg: "the planet has updated"})
})

app.delete("/api/planets/:id", (req, res) => {
  const {id} = req.params;
  planets = planets.filter(p => p.id !== Number(id));

  res.status(200).json({msg: "planet deleted succesfully"})
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
