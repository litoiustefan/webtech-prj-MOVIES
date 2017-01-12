var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = new express();
app.use(bodyParser.json());
app.use(cors());
// include static files in the admin folder
app.use('/admin', express.static('admin'));

app.listen(process.env.PORT);

/*
var data = [{id:1},{id:2},{id:3}];

//CREATE new resource
app.post('/filme', function(request, response) {
response.status(201).send(request.body);
});

//READ all 
app.get('/filme', function(request, response) {
response.status(200).send(data);
});

//READ one by id
app.get('/filme/:id', function(request, response) {
response.status(200).send(data[0]);
});

//UPDATE one by id
app.put('/filme/:id', function(request, response) {
response.status(201).send(request.body);
});

//DELETE one by id
app.delete('/filme/:id', function(request, response) {
response.status(201).send('Deleted' + request.params.id);
});
*/

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));
var Sequelize = require("sequelize");
// init sequelize connexion
var sequelize = new Sequelize('movie', 'stefan1070', '', {
   dialect: 'mysql',
   host: '127.0.0.1',
   port: 3306
});

var Movie = sequelize.define('movies', {
  name: {
    type: Sequelize.STRING,
    field: 'name'
  },
  year: {
    type: Sequelize.STRING,
    field: 'year'
  },
  genre: {
    type: Sequelize.STRING,
    field: 'genre'
  },
  rating: {
    type: Sequelize.STRING,
    field: 'rating'
  },
  duration: {
    type: Sequelize.STRING,
    field: 'duration'
  }
}, {
  timestamps: false
});


// create a movie
app.post('/movies', function(request,response) {
  Movie.create(request.body).then(function(movie) {
      Movie.findById(movie.id).then(function(movie) {
          response.status(201).send(movie);
      });
  });
});


app.get('/movies', function(request,response){
    
    Movie.findAll().then(function(movies){
        response.status(200).send(movies);
    });
});

app.get('/movies/:id', function(request,response){
    Movie.findById(request.params.id).then(function(movie){
        if(movie) {
            response.status(200).send(movie);
        } else {
            response.status(404).send();
        }
    });
});


app.put('/movies/:id', function(request,response){
    Movie
        .findById(request.params.id)
        .then(function(movie){
            if(movie) {
                movie
                    .updateAttributes(request.body)
                    .then(function(){
                        response.status(200).send('updated');
                    })
                    .catch(function(error){
                        console.warn(error);
                        response.status(500).send('server error');
                    });
            } else {
                response.status(404).send();
            }
        });
});

// delete an article by id
app.delete('/movies/:id', function(req,res){
    Movie
        .findById(req.params.id)
        .then(function(movie){
            if(movie) {
                movie
                    .destroy()
                    .then(function(){
                        res.status(204).send();
                    })
                    .catch(function(error){
                        console.warn(error);
                        res.status(500).send('server error');
                    });
            } else {
                res.status(404).send();
            }
        });
});


