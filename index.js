const express = require('express');
const app = express();
const now = new Date();
app.use(express.json());
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

let data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1> HWLLO </h1>");
});

app.get("/api/data", (request, response) => {
  response.json(data);
});

app.get('/info', (request,response)=>{
    response.send(`<p> There are ${data.length} persons in the list. </p><br><p> ${now.toString()} </p>`)
})

app.get('/api/data/:id',(request,response)=>{
    const id = request.params.id
    const person = data.find(person => person.id == id)
    
    if(person){
    response.json(person)
}
    else{
        response.status(404).end();
    }

})

app.delete('/api/data/:id',(request,response)=>{
  const id = request.params.id;
  data = data.filter(person => person.id !== id)

  response.status(204).end();
})

app.post('/api/data', (request, response) => {
  const body = request.body
  const id = Math.floor(Math.random() * 9999).toString();

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content(name or number) missing' 
    })
  }

  if(data.find(person => person.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  data = data.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`SERVER PORT : ${PORT}`)
})
