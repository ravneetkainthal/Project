//IMPORTING MODULES
require("dotenv").config();
// Importing the Movie model

const movies = require('./models/movies');

const express = require('express');
const cors = require('cors');
const exphbs  = require('express-handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars'); 
const path = require("path");
const app = express();
const port = 8000;

// Import mongoose
const mongoose = require("mongoose");
const { error } = require("console");


//CONNECTION TO  ATLAS DB
mongoose.connect(process.env.url);
let db = mongoose.connection;

// Check connection
db.once("open", function () {
  console.log("Connected to MongoDB Atlas");
});

// Check for DB errors
db.on("error", function (err) {
  console.log("Error While Connecting!!");
});

// Use the CORS middleware
app.use(cors());

// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Set Handlebars as the view engine
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: "main" ,
  handlebars: allowInsecurePrototypeAccess(Handlebars)
 }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home');
});



//DEFINING ALL CRUD ROUTES

//GET MOVIES
app.get('/api/Movies', function(req, res) {
  // Query movies and Show only first 100 only

  movies.find().limit(100)
    .then(movie => {
      // Render the view with the retrieved movies
      res.render('partials/allmovies', { movie: movie });
    })
    .catch(error => {
      // Handle errors
      res.status(500).send(`Server Error ${error}`);
    });
});



//GET MOVIES BY ID
app.get('/api/Movies/:id', (req, res) => {
  const movieid = req.params.id;
  movies.findById(movieid)
  .then(movie => {
      if (!movie) {
          return res.status(404).send("No Movie with that ID");
      }
      res.render('partials/moviesbyID', { movie: movie });
  })
  .catch(error => {
      res.status(500).send(`Server Error ${error}`); // error status
  });
});

   

//UPDATE MOVIES
app.put('/api/Movies/:id',  (req, res)=>{

  const movieid = req.params.id;
  const updatedData= req.body;

  movies.findByIdAndUpdate(movieid, updatedData, {new: true})
   .then((updatedMovie) =>{
    if(!updatedMovie){
        return res.status(404).send("No Movie with that id exist");
    }
   res.status(200).send("Movie updated successfully");
   })
   .catch((err) =>{
    console.error("Server Error", error);
    res.status(500).send("Internal Server Error");
   });

});
 
//DELETE MOVIES
app.delete('/api/Movies/:id',  (req, res)=>{

  const movieid = req.params.id;
  
  movies.findByIdAndDelete(movieid)
   .then((deletedMovie) =>{
    if(!deletedMovie){
        return res.status(404).send("No Movie with that id exist");
    }
   res.status(200).send("Movie Deleted successfully");
   })
   .catch((err) =>{
    console.error("Server Error", error);
    res.status(500).send("Internal Server Error");
   });

});


//CREATE MOVIES
app.post('/api/Movies',  (req, res) => {
 
  const{title,plot, genres,cast,imbd,runtime, director, year} = req.body;

  //creting new movie object
  const  newMovie=new movies({
      title: title ,
      plot : plot ,
      genres :genres,
      cast : cast ,
      imbd : imbd ,
      runtime : runtime ,
      director:director,
      year:year
  });
  //saving the new movie to database
  newMovie.save()
  .then(()=>{
    res.status(201).send("Movie Created and added to database");
  } )
  .catch (error =>{
    console.error("Server Error: ", error);
    res.status(500).send("Internal Server Error")
  });
 });

//WE WILL TRY TO ADD MORE ROUTES AFTER COMPLETING ABOVE ONES



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
