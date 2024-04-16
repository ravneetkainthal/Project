//IMPORTING MODULES
require("dotenv").config();
// Importing the Movie model

const movies = require('./models/movies');
const User = require('./models/user'); 
const authMovies= require('./routes/movies');
const {requireAuth, checkUser}= require('./middleware/moviesMiddleware');

const express = require('express');
const cors = require('cors');
const exphbs  = require('express-handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars'); 
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const bcrypt= require('bcrypt');
const cookieParser= require('cookie-parser');
const jwt = require('jsonwebtoken');



const port = 8000;


//middleware
app.use(cookieParser());
app.use(express.json());

// Parse JSON bodies
app.use(bodyParser.json());

// Import mongoose
const mongoose = require("mongoose");
const { error } = require("console");


//CONNECTION TO  ATLAS DB
mongoose.connect(process.env.MONGODB_URI);
let db = mongoose.connection;




mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true  
});




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
//APLYING MIDDLEWARE FOR CHECK USER
app.get('*', checkUser);
// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



// Set views directory
// app.set('views', path.join(__dirname, 'views'));

app.set('views', [
  path.join(__dirname, 'views', 'layouts'),
  path.join(__dirname, 'views', 'partials'),
  path.join(__dirname, 'views')
]);


// Set Handlebars as the view engine
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: "main" ,
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
 }));
app.set('view engine', 'hbs');//SETTING TEMPLATE ENGINE


//ROUTE FOR HOME PAGE
app.get('/', requireAuth,(req, res) => {
    res.render('home');
});



//DEFINING ALL CRUD ROUTES

//GET MOVIES
app.get('/api/Movies', requireAuth, (req, res) =>{
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


// // Register Handlebars helper function to check if the page is the current page
// Handlebars.registerHelper('isCurrentPage', function(pageNumber, currentPage) {
//   return pageNumber === currentPage ? 'active' : '';
// });
// //PAGINATION ROUTE

// app.get('/api/Movies', (req, res) => {
//   // Initialize empty query object
//   let query = {};

//   // Extract pagination and title filter parameters+
//   const { page = 1, perPage = 10, title } = req.query;

//   // If title is provided, construct title filter for MongoDB query
//   if (title) {
//       // Case-insensitive search for movie titles containing provided string
//       query = { title: { $regex: title, $options: 'i' } };
//   }

//   // Create promises for counting total documents and fetching movies
//   let totalCountPromise = movies.countDocuments(query);
//   let moviesPromise = movies.find(query)
//       .skip((parseInt(page) - 1) * parseInt(perPage))
//       .limit(parseInt(perPage));

//   // Execute promises concurrently
//   Promise.all([totalCountPromise, moviesPromise])
//       .then(([totalCount, moviesList]) => {
//           // Calculate pagination metadata
//           const totalPages = Math.ceil(totalCount / perPage);
//           const currentPage = parseInt(page);
//  // Log moviesList to verify data
//  console.log('Movies List:', moviesList);

//           // Render the Handlebars template with pagination metadata and movie list
//           res.render('pagination', {
//               currentPage,
//               perPage: parseInt(perPage),
//               totalPages,
//               totalCount,
//               movies: moviesList
//           });
//         //   res.json({
//         //     currentPage,
//         //     perPage: parseInt(perPage),
//         //     totalPages,
//         //     totalCount,
//         //     movies: moviesList
//         // });
//       })
//       .catch(error => {
//           // Handle errors
//           console.error("Server Error", error);
//           // Send 500 Internal Server Error response
//           res.status(500).send("Internal Server Error");
//       });
// });

//pagination ends
app.use(authMovies);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
