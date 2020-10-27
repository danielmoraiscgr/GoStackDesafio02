const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const { isUuid } = require('uuidv4')

const app = express();

app.use(express.json());

app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
    return response.json(repositories);      
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = { id: uuid(), title, url, techs , likes: 0};

  repositories.push(repository);
   
  console.log(repository); 

  return response.json(repository);

});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params; 
  
  const { title, url, techs } = request.body; 

  if (!isUuid(id)){
    return response.status(400).json({ error: 'Id inválido'});}

  const repositoryIndex = repositories.findIndex( rep => rep.id == id);

  if(repositoryIndex<0){
    return response.status(400).json({ error: 'Não localizado '});
  }

  const repository = { 
                   id, 
                   title , 
                   url, 
                   techs,
                   likes : repositories[repositoryIndex].likes };

  repositories[repositoryIndex] = repository; 

  return response.json(repository);
  
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: 'Id inválido'});}

  const repositoryIndex = repositories.findIndex( rep=> rep.id = id);

  if(repositoryIndex == -1){    
    return response.status(404).json({ error: 'Repositorio não encontrado'});
  }

  repositories.splice(repositoryIndex); 

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex( rep => rep.id == id);

  if(repositoryIndex == -1){    
    return response.status(400).json({ error: 'Repositorio não encontrado'});
  }

  repositories[repositoryIndex].likes+=1; 

  return response.json(repositories[repositoryIndex]);

});


module.exports = app;
