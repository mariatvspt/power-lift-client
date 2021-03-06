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
  
  let newWorkout = {}; 
  let workoutSetName = req.body.workoutSetName;
  let workoutName = req.body.workoutName;
  allSets = JSON.parse(allSets);

  if (req.body.workoutReps) {
    newWorkout = { 
      workoutName: workoutName,
      workoutReps: req.body.workoutReps
    };
  }
  else if(req.body.workoutTime) {
    newWorkout = { 
      workoutName: workoutName,
      workoutTime: req.body.workoutTime
    };
  }
  allSets.workoutSets[workoutSetName].push(newWorkout);

  return allSets;
}

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// Retrieves all the existing sets
app.get('/view_sets', (req, res) => {
  if(!fs.existsSync('./notes/posted_workout.json')) {
    fs.writeFileSync('./notes/posted_workout.json', '');
  }

  let allSets = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
  allSets = JSON.parse(allSets);
  let workoutSets = {
    workoutSets: Object.keys(allSets.workoutSets)
  }
  
  res.send(workoutSets);
});

// Retrieves all workouts in a given set
app.get('/view_workouts', (req, res) => {
  if(!fs.existsSync('./notes/posted_workout.json')) {
    fs.writeFileSync('./notes/posted_workout.json', '');
  }

  let allSets = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
  allSets = JSON.parse(allSets);

  res.send(allSets.workoutSets[req.query.set]);
})

// Retrieves the whole data
app.get('/view_all', (req,res) => {
  if(!fs.existsSync('./notes/posted_workout.json')) {
    fs.writeFileSync('./notes/posted_workout.json', '');
  }

  let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
  
  res.send(allData)  
});

// Post a new set
app.post('/new_set', (req,res) => {
  try {
    let allSets = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
    allSets = JSON.parse(allSets);

    if(allSets.length == 0) {
      const newSet = {};
      newSet[req.body.workoutSetName] = [];
      allSets = {
        workoutSets: newSet
      };
    }
    else {
      allSets.workoutSets[req.body.workoutSetName] = [];
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

function renameKey(data, oldKey, newKey) {
  let newMap = {};

  for (key in data) {
    if(key == oldKey) {
      newMap[newKey] = data[oldKey];
    }
    else {
      newMap[key] = data[key];
    }
  }

  return newMap;
}

// Edit an existing set
app.post('/edit_set', (req,res) => {
  try {
    let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
    allData = JSON.parse(allData);
    const originalWorkoutSetName = req.body.originalWorkoutSetName;
    const updatedWorkoutSetName = req.body.updatedWorkoutSetName;

    allSets = renameKey(allData.workoutSets, originalWorkoutSetName, updatedWorkoutSetName);
    allData.workoutSets = allSets;

    fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(allData));

    return res.status(200).json({
      status: 200,
      message: 'Sucessfully created edited the workout set!',
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

// Edit an existing set
app.post('/delete_set', (req,res) => {
  try {
    let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
    allData = JSON.parse(allData);
    const deletedWorkoutSetName = req.body.deletedWorkoutSetName;

    delete allData.workoutSets[deletedWorkoutSetName];

    fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(allData));

    return res.status(200).json({
      status: 200,
      message: 'Sucessfully deleted the workout set!',
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
      let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
     
      let updatedData = setWorkoutRequest(req, allData);

      fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(updatedData));
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

app.post('/edit_workout', (req, res) => {
    try {
      let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
      allData = JSON.parse(allData);

      let workoutSetName = req.body.workoutSetName;
      let workoutIndex = req.body.workoutIndex;
      let workoutName = req.body.workoutName;
      let updatedWorkout = {};
      
      if(req.body.workoutReps) {
        updatedWorkout = {
          workoutName: workoutName,
          workoutReps: req.body.workoutReps
        }
      }
      else if(req.body.workoutTime) {
        updatedWorkout = {
          workoutName: workoutName,
          workoutTime: req.body.workoutTime
        }
      }

      allData.workoutSets[workoutSetName].splice(workoutIndex, 1); // delete original workout
      allData.workoutSets[workoutSetName].splice(workoutIndex, 0, updatedWorkout); // insert new workout

      fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(allData));
      return res.status(200).json({
          status: 200,
          message: 'Sucessfully edited a workout!',
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

app.post('/delete_workout', (req, res) => {
  try {
    let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
    allData = JSON.parse(allData);

    let workoutSetName = req.body.workoutSetName;
    let workoutIndex = req.body.workoutIndex;

    allData.workoutSets[workoutSetName].splice(workoutIndex, 1); // delete original workout

    fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(allData));
    return res.status(200).json({
        status: 200,
        message: 'Sucessfully deleted a workout!',
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

app.post('/reorder_workout', (req, res) => {
  try {
    let allData = fs.readFileSync('./notes/posted_workout.json', {encoding:'utf8', flag:'r'});
    allData = JSON.parse(allData);

    const workoutSetName = req.body.workoutSetName;
    const startIndex = req.body.startIndex;
    const endIndex = req.body.endIndex;

    const workoutList = [...allData.workoutSets[workoutSetName]];
    const [removed] = workoutList.splice(startIndex, 1);
    workoutList.splice(endIndex, 0, removed);
    allData.workoutSets[workoutSetName] = workoutList;

    fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(allData));
    return res.status(200).json({
        status: 200,
        message: 'Sucessfully reordered a workout!',
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