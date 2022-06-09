const { response } = require("express");
const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>hello</h1>");
});

app.get("/api/persons/", (req, res) => {
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((n) => n.id === id);
  if (!person) {
    return res.send(404, "Person does not exist");
  } else {
    res.send(200, person);
  }
});

app.get("/info", (req, res) => {
  const currentDate = new Date();
  const phonebookLength = phonebook.length;
  res.send(
    `<p>Phonebook has info on ${phonebookLength} people</p>
    <p>${currentDate}</p>`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  phonebook = phonebook.filter((n) => n.id !== id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons/", (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  if (phonebook.find((person) => person.name === newPerson.name)) {
    return res.status(400).json({
      error: "name already exists in phonebook",
    });
  }

  const person = {
    id: generateId(),
    name: newPerson.name,
    number: newPerson.number,
  };

  phonebook = phonebook.concat(person);
  res.send(204).end();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
