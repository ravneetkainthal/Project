//IMPORTING MODULES

const express = require('express');
const app = express();
const port = 8000;


//CONNECTION TO  ATLAS DB
//INTIALIZING ALL IMPORTED MODULES
//LOADING SETTING VIEWS

app.get('/', (req, res) => {
  res.send('WELCOME TO PHASE 0 OF FINAL PROJECT');
});

//SETTING VIEWS

//DEFINING ALL CRUD ROUTES

//CREATE MOVIES
app.post('/api/Movies',  (req, res) => {
   //try catch or promise
  });

//GET MOVIES
app.get('/api/Movies',  (req, res) => {
    //try catch or promise
   });

//GET MOVIES BY ID
app.get('/api/Movies/:id',  (req, res) => {
    //try catch or promise
   });

//UPDATE MOVIES
app.put('/api/Movies/:id',  (req, res)=>{
});
 
//DELETE MOVIES
app.delete('/api/Movies/:id', async (req, res) => {
});


//WE WILL TRY TO ADD MORE ROUTES AFTER COMPLETING ABOVE ONES

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
