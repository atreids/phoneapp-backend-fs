require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>hello</h1>");
});

app.get("/api/persons/", (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.json(people);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const currentDate = new Date();
  Person.find({}).then((phonebook) => {
    const phonebookLength = phonebook.length;
    res.send(
      `<p>Phonebook has info on ${phonebookLength} people</p>
      <p>${currentDate}</p>`
    );
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.send(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (req, res, next) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  Person.find({ name: newPerson.name })
    .then((personArray) => {
      const [person] = personArray;
      if (person) {
        return res.status(400).json({
          personid: person.id,
        });
      } else {
        const person = new Person({
          name: newPerson.name,
          number: newPerson.number,
        });

        person
          .save()
          .then((savedPerson) => {
            res.json(savedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));

  // return res.status(400).json({
  //   error: "name already exists in phonebook",
  //   existId:
  // });

  // const person = new Person({
  //   name: newPerson.name,
  //   number: newPerson.number,
  // });

  // person.save().then((savedPerson) => {
  //   res.json(savedPerson);
  // });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  } else if (error.name === "ValidatorError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
