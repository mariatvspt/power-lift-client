import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel, Tab, Tabs, DropdownButton, MenuItem } from "react-bootstrap";
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
  const [allSets, setAllSets] = useState({});
  const [showInputSetName, setShowInputSetName] = useState(false);
  const [placeholder, setPlaceholder] = useState("Select");
  const [confirmSetSelection, setConfirmSetSelection] = useState(false);
  const [showInputWorkout, setShowInputWorkout] = useState(false);
  
  // const [noteResponse, setNoteResponse] = useState("");
  // useEffect(() => {
  //   createWorkout().then((noteResponse) => {
  //     setNoteResponse(noteResponse);
  //     console.log(noteResponse);
  //   });
  // });

  function validateSetForm() {
    return workoutSetName.length > 0
  }

  function validateWorkoutForm() {
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

  // call new_workout API to create a new workout
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
    fetch('/new_workout', request).then(response => console.log(response));
  }

  // call view_sets API and display on page
  function viewSets() {
    fetch('/view_sets').then(response => response.json().then(allSets => setAllSets(allSets.workoutSets)));
    const allSetsArray = [];

    for(var i = 0; i < allSets.length; i++) {
      allSetsArray.push(<MenuItem
        onSelect={e => setWorkoutSetName(e) & setShowInputSetName(false) & setConfirmSetSelection(true) & setShowInputWorkout(true)}
        value={allSets[i]}
        eventKey={allSets[i]}
        key={"key" + i}>
          {allSets[i]}
        </MenuItem>
      );
    }

    return allSetsArray;
  }

  // call new_set API to reate a new set
  function createSet(set, event) {
    event.preventDefault();

    var request = {
      method: "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        workoutSetName: set
      })
    };

    console.log(request);
    return fetch('/new_set', request);
  }

  return (
    <div className="NewNote">
      <form>
        <FormGroup id="workoutSetName">
          <ControlLabel> Workout set: </ControlLabel>
          <div></div>
          <DropdownButton id="dropdown" onSelect={e => setPlaceholder(e)} title={placeholder}>
            {viewSets()}
            <hr />
            <MenuItem
              as="button"
              eventKey="Create a new set"
              onSelect={e => setWorkoutSetName("") & setShowInputSetName(true) & setConfirmSetSelection(false) & setShowInputWorkout(false)}>
                Create a new set
            </MenuItem>
          </DropdownButton>
          { showInputSetName &&
            <div>
              <ControlLabel> Set Name: </ControlLabel>
              <FormControl
                value={workoutSetName}
                id="inputWorkoutSetName"
                componentClass="textarea"
                onChange={e => setWorkoutSetName(e.target.value)}
              />
              <LoaderButton
                block
                type="submit"
                bsSize="large"
                bsStyle="primary"
                disabled={!validateSetForm()}
                onClick={e => createSet(workoutSetName, e).then(response => console.log(response) & setShowInputWorkout(true) & setConfirmSetSelection(true) & setShowInputSetName(false) & setPlaceholder(workoutSetName)) }
              >
                Create
              </LoaderButton>
            </div>
          }
          { confirmSetSelection && 
            <p>
              You've selected the workout set {workoutSetName}.
            </p>
          }
        </FormGroup>

        { showInputWorkout && 
          <div>
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
              disabled={!validateWorkoutForm()}
              onClick={handleSubmit}
            >
              Create
            </LoaderButton>
          </div>
        }
      </form>
    </div>
  );
}