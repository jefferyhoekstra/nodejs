// intializations
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const Cake = require("./models/cake");
const methodOverrider = require("method-override");
require("dotenv").config()
const port = 3000;
const { DB_URI } = process.env;

console.log(DB_URI);

// middleware
server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverrider("_method"));

// connection
mongoose
  .connect(DB_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connect to Database\nServer is listening on port ${port}`);
    })
  )
  .catch((error) => console.log(error));

                  // ----- ROUTES ----- //

// index route (show all cakes)
server.get("/cakes", async (request, response) => {
  try {
    const cakes = await Cake.find();
    response.render("cakesIndexPage", { cakes });
  } catch {
    response.status(500).send("Data not found!");
  }
});

// new route (show form to create new cake)
server.get("/cakes/new", (request, response) => {
  response.render("cakeNewPage");
});

// show route (show one cake by _id)
server.get("/cakes/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const cake = await Cake.findById(id);
    response.render("cakeShowPage", { cake });
  } catch {
    response.status(500).send(`Cake with ID ${id} cannot be found`);
  }
});

// post route (create new cake)
server.post("/cakes", async (request, response) => {
  // console.log(request.body);
  const newCake = new Cake({
    name: request.body.name,
    type: request.body.type,
    price: {
      "8 inch": request.body["8 inch"],
      "10 inch": request.body["10 inch"],
      "12 inch": request.body["12 inch"],
    },
    image: request.body.image,
  });
  try {
    await newCake.save();
    response.send("Cake is added successfully to Database")
  } catch (error) {
    response.status(500).send("Cannot add cake to Database");
  }
});

// DELETE route (delete a cake by _id)
server.delete("/cakes/:id", async (request, response) => {
  const {id} = request.params;
  try {
  await Cake.findByIdAndDelete(id)
  response.redirect("/cakes");
  } catch (error) {
    response.status(500).send(`Cannot delete cake with ID ${id}`);
  }
});

// edit page route
server.get("/cakes/:id/edit", async (request, response) => {
  const { id } = request.params;
  try {
    const editCake = await Cake.findById(id);
    response.render("cakeEditPage", { editCake });
  } catch (error) {
    response.status(500).send("Cannot find cake");
  }
});

// patch route
server.patch("/cakes/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Cake.findByIdAndUpdate(id, {
      name: request.body.name,
      type: request.body.type,
      price: {
        "8 inch": request.body["8 inch"],
        "10 inch": request.body["10 inch"],
        "12 inch": request.body["12 inch"],
      },
      image: request.body.image,
    });
    response.redirect(`/cakes/${id}`);
  } catch (error) {
    response.status(500).send("Cannot patch cake");
  }
});