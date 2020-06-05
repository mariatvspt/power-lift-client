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

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// post route
app.post('/post_workout', (req, res) => {
    try {
        fs.writeFileSync('./notes/posted_workout.json', JSON.stringify(req.body));
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