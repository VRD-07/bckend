require('dotenv').config()
const express = require("express");
const app = express();
const now = new Date();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

const Person = require('./models/person')

app.get("/", (request, response) => {
  response.send("<h1> HWLLO </h1>");
});

app.get("/api/data", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<p> There are ${
      data.length
    } persons in the list. </p><br><p> ${now.toString()} </p>`
  );
});

app.get("/api/data/:id", (request, response) => {
  Person.findById(request.params.id).then(person =>{
    response.json(person)
  })
});

app.delete("/api/data/:id", (request, response) => {
  const id = request.params.id;
  data = data.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/data", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content(name or number) missing",
    });
  }

  // if (data.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedNote => response.json(savedNote))

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SERVER PORT : ${PORT}`);
});
