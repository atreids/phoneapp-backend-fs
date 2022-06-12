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

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => res.json(error.message));
});

// app.get("/info", (req, res) => {
//   const currentDate = new Date();
//   const phonebookLength = phonebook.length;
//   res.send(
//     `<p>Phonebook has info on ${phonebookLength} people</p>
//     <p>${currentDate}</p>`
//   );
// });

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.send(204).end();
  });
});

app.post("/api/persons/", (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  // if (phonebook.find((person) => person.name === newPerson.name)) {
  //   return res.status(400).json({
  //     error: "name already exists in phonebook",
  //   });
  // }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
