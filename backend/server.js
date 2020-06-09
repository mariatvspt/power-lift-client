const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// Returns a json to save from the received post_workout API request
function setWorkoutRequest(req, allSets) {
  
  var requestSent = {}; 
  var workoutSetName = req.body.workoutSetName;
  var workoutName = req.body.workoutName;

  // workoutTime or workoutReps
  if (req.body.workoutReps != null) {
  requestSent[workoutName] = { workoutReps: req.body.workoutReps }
  }
  else {
    requestSent[workoutName] = { workoutTime: req.body.workoutTime }
  }

  // adding to existing set
  allSets = JSON.parse(allSets);
  allSets.workoutSets[workoutSetName][workoutName] = requestSent[workoutName];

  return allSets;
}

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/view_sets', (req, res) => {
  if(!fs.existsSync('./notes/posted_workout.json')) {
    fs.writeFileSync('./notes/posted_workout.json', '');
  }

  var allSets = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
  allSets = JSON.parse(allSets);
  var workoutSets = {
    workoutSets: Object.keys(allSets.workoutSets)
  }
  
  res.send(workoutSets);
});

app.post('/new_set', (req,res) => {
  try {
    var allSets = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
    allSets = JSON.parse(allSets);

    if(allSets.length == 0) {
      const newSet = {}
      newSet[req.body.workoutSetName] = {}
      allSets = {
        workoutSets: newSet
      };
    }
    else {
      allSets.workoutSets[req.body.workoutSetName] = {};
    }

    fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(allSets));

    return res.status(200).json({
      status: 200,
      message: 'Sucessfully created a new workout set!',
      data:  req.body
    })
  }
  catch(e){
    res.status(400).json({
      status: 400,
      error: e.message
    });
  }
});

// Post a workout with time or rep in a given set
app.post('/new_workout', (req, res) => {
    try {
      var allSets = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
     
      var updatedSets = setWorkoutRequest(req, allSets);

      fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(updatedSets));
      return res.status(200).json({
          status: 200,
          message: 'Sucessfully posted a workout!',
          data:  req.body
      })
    }
    catch(e){
        res.status(400).json({
          status: 400,
          error: e.message
        });
    }
});