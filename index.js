const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8080;
const pool = new Pool();
const cors = require("cors");

app.use(express.json());
app.use(cors());
/* app.get("/time", (req, res) => {
  pool
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows))
    .catch((err) => {
      console.log(e.message);
      res.sendStatus(500);
    });
}); */

app.get("/", (req, res) => {
  pool
    .query("SELECT * FROM recipes")
    .then((data) => res.send(data.rows))
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

app.post("/postrecipe", (req, res) => {
  const {
    title,
    description,
    ingredients,
    recipeimage,
    rating,
    instructions,
    category,
  } = req.body;
  pool
    .query(
      "INSERT INTO recipes (title, description, ingredients, recipeimage, rating, instructions, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        title,
        description,
        ingredients,
        recipeimage,
        rating,
        instructions,
        category,
      ]
    )
    .then((data) => res.json(data.rows[0]))
    .catch((e) => res.sendStatus(500));
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("DELETE FROM recipes WHERE id =$1", [id])
    .then((data) => res.send(data.rows))
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(500);
    });
});

app.all("*", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
