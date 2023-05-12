import { Request, Response } from "express";
import Joi from "joi";
import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:postgres@localhost:5432/video");

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;
    CREATE TABLE planets(
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);

};
setupDb();

// type Planet = {
//   id: number;
//   name: string;
// };

// type Planets = Planet[];

// let planets: Planets = [
//   { id: 1, name: "Earth" },
//   { id: 2, name: "Mars" },
// ];

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {

  const planets = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const planet = await db.oneOrNone(`SELECT * FROM planets WHERE id=$1`, Number(id));

  res.status(200).json(planet);
};

const create = async (req: Request, res: Response) => {
  const { error, value } = planetSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { name } = value;
  await db.none(`INSERT INTO planets (name) VALUES ($1)`, [name]);


  res.status(201).json({ msg: "planet is created" });
};

const updateById = async (req: Request, res: Response) => {
  const { error, value } = planetSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const { id } = req.params;
  const { name } = value;
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name])

  res.status(200).json({ msg: "the planet has updated" });
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  res.status(200).json({ msg: "planet deleted succesfully" });
};

export { getAll, getOneById, create, deleteById , updateById};
