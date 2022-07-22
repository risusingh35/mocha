var express = require('express');
var lowdb = require('lowdb');
var filesync = require('lowdb/adapters/FileSync');
var { v4: uuidv4 } = require('uuid');
var bodyParser = require('body-parser');
var app = express();
var adapter = new filesync('db.json');
var db = lowdb(adapter);
// db.defaults({
//     posts: [],
// }).write();
app.use(bodyParser.json());
app.get('/addTask', function(req, res){
  console.log('/addTask');
  var title = 'This IS TITLE FOR UNIT TESTING';
  res.send(title);
   var id = uuidv4();
   if (!title || title === undefined){
    console.log('/addTask Error ');
     res.status(400)
   }
   else{
    db.get('posts').push({ id, title }).write();
    console.log('POST ADDED');
       return res.status(200)
   }
});

app.get('/', function(req, res){
  return res.end('Welcome to Task');
});
//Listing all tasks
app.get('/tasks', function(req, res){
  return res.json(db.getState());
});

//Listing a particular task
  app.get('/tasks/:id', function(req,res){
    var id = req.params.id;
    let a = db.get('posts').find({ id: id });
    if (a) {
        return res.json(a);
      }
      return res.status(404).end();
});


//Update a task
app.put('/tasks/:id', function(req,res){
    var update = req.body.title;
    if (!update || update === undefined){
      res.status(400).end()
    }
    else{
      db.get('posts').find({id : req.params.id}).assign({title : update}).write();
      return res.status(200).end();
    }
    
})

// Delete task
app.delete('/tasks/:id', function(req,res){
    db.get('posts').remove({ id : req.params.id}).write();
    return res.status(200).end();
})

// API server listing port 3000
app.listen(3000, function() {
    console.log('API up and running at http//localhost:3000');
  });

module.exports = app;
