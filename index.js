require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

const Person = require("./models/person");

app.get("/", (request, response) => {
  response.send("<h1> HWLLO </h1>");
});

app.get("/api/data", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>There are ${count} persons in the list.</p><br><p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get("/api/data/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/data/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send("person not found");
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/data", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content(name or number) missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedNote) => response.json(savedNote)).catch(error=> next(error));
});

app.put("/api/data/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.status(404).send('Error finding person in db');
  }

  person.name = name;
  person.number = number

  return person.save().then((updatedPerson)=>{
    response.json(updatedPerson)
  })

  }).catch(error=> next(error))

});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  else if(error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SERVER PORT : ${PORT}`);
});
