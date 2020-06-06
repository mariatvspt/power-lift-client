import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel, Tab, Tabs } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewNote.css";

export default function NewNote() {

  const history = useHistory();
  const [workoutSetName, setWorkoutSetName] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutTime, setWorkoutTime] = useState(0);
  const [workoutReps, setWorkoutReps] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('time');
  
  // const [noteResponse, setNoteResponse] = useState("");
  // useEffect(() => {
  //   createWorkout().then((noteResponse) => {
  //     setNoteResponse(noteResponse);
  //     console.log(noteResponse);
  //   });
  // });

  function validateForm() {
    return workoutName.length > 0 && ((workoutReps.length > 0 && !isNaN(workoutReps)) || (workoutTime.length > 0 && !isNaN(workoutTime)));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await createWorkout(workoutSetName, workoutName, workoutTime, workoutReps);

      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function createWorkout(set, name, time, reps) {

    var request = {}
    if(time == 0) {
      request = {
        method: "post",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          workoutSetName: set,
          workoutName: name,
          workoutReps: reps
        })
      };
    }
    else {
      request = {
        method: "post",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          workoutSetName: set,
          workoutName: name,
          workoutTime: time
        })
      };
    }

    console.log(request);
    fetch('/post_workout', request).then(response => console.log(response));
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="workoutSetName">
          <ControlLabel> Workout Set: </ControlLabel>
          <FormControl
            value={workoutSetName}
            componentClass="textarea"
            onChange={e => setWorkoutSetName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="workoutName">
          <ControlLabel> Workout Name: </ControlLabel>
          <FormControl
            value={workoutName}
            componentClass="textarea"
            onChange={e => setWorkoutName(e.target.value)}
          />
        </FormGroup>
        <Tabs
          id="chooseTimeMeasure"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="time" title="Time">
            <FormGroup controlId="workoutTime">
              <ControlLabel> Workout Time (secs): </ControlLabel>
              <FormControl
                value={workoutTime}
                componentClass="textarea"
                onChange={e => setWorkoutTime(e.target.value) & setWorkoutReps(0)}
              />
            </FormGroup>
          </Tab>
          <Tab eventKey="reps" title="Reps">
            <FormGroup controlId="workoutReps">
              <ControlLabel> Reps: </ControlLabel>
              <FormControl
                value={workoutReps}
                componentClass="textarea"
                onChange={e => setWorkoutReps(e.target.value) & setWorkoutTime(0)}
              />
            </FormGroup>
          </Tab>
        </Tabs>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}