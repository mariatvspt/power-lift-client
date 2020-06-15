import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormGroup, FormControl, FormLabel, DropdownButton, Dropdown } from "react-bootstrap";
import { Tab, Tabs } from 'react-bootstrap-tabs';
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
  const [allSets, setAllSets] = useState([]);
  const [showInputSetName, setShowInputSetName] = useState(false);
  const [placeholder, setPlaceholder] = useState("Select");
  const [confirmSetSelection, setConfirmSetSelection] = useState(false);
  const [confirmSetCreation, setConfirmSetCreation] = useState(false);
  const [showInputWorkout, setShowInputWorkout] = useState(false);
  
  useEffect(() => {
    async function fetchSets() {
      const viewSetsResponse = await fetch('/view_sets');
      const sets = await viewSetsResponse.json();
      setAllSets(sets.workoutSets);
    }
    fetchSets();
  }, []);

  function validateSetForm() {
    return workoutSetName.length > 0;
  }

  function validateWorkoutForm() {
    const validateWorkoutRepsInput = workoutReps.length > 0 && !isNaN(workoutReps);
    const validateWorkoutTimeInput = workoutTime.length > 0 && !isNaN(workoutTime);
    return workoutName.length > 0 && ( validateWorkoutRepsInput || validateWorkoutTimeInput );
  }

  function onSelectSet(e) {
    setWorkoutSetName(e);
    setShowInputSetName(false);
    setConfirmSetSelection(true);
    setShowInputWorkout(true);
    setConfirmSetCreation(false);
  }

  function onSelectCreateNewSet(e) {
    setWorkoutSetName("");
    setShowInputSetName(true);
    setConfirmSetSelection(false);
    setShowInputWorkout(false);
  }

  function onClickCreateSetButton(e) {
    createSet(workoutSetName, e).then(response => console.log(response));
    setShowInputWorkout(true);
    setConfirmSetSelection(false);
    setShowInputSetName(false);
    setConfirmSetCreation(true);
    setPlaceholder(workoutSetName);
    
    // update allSets for DropdownButton
    let updatedSets = [...allSets];
    updatedSets.push(workoutSetName);
    setAllSets(updatedSets);
  }

  // handle "Add" button when submitted
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
    let request = {};

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

    fetch('/new_workout', request).then(response => console.log(response));
  }

  // display all sets on page
  function viewSets() {
    let allSetsArray = [];
    for(var i = 0; i < allSets.length; i++) {
      allSetsArray.push(
        <Dropdown.Item
          className="DropdownItem"
          onSelect={e => onSelectSet(e)}
          value={allSets[i]}
          eventKey={allSets[i]}
          key={"key" + i}>
            {allSets[i]}
          </Dropdown.Item>
      );
    }
    return allSetsArray;
  }

  // call new_set API to create a new set
  function createSet(set, event) {
    event.preventDefault();

    let request = {
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
        <FormGroup className="workoutSetName">
          <FormLabel className="FormLabel"> Workout set: </FormLabel>
          
          {/* Inputting Set Information */}
          <DropdownButton size="lg" variant="outline-dark" title={placeholder} onSelect={e => setPlaceholder(e)}>
            {viewSets()}
            <Dropdown.Divider />
            <Dropdown.Item
              className="DropdownItem"
              eventKey="Create a new set"
              onSelect={e => onSelectCreateNewSet(e)}>
                Create a new set
            </Dropdown.Item>
          </DropdownButton>
          
          {/* Inputting information for creating a new set */}
          { showInputSetName &&
            <>
              <FormLabel className="FormLabel"> Set Name: </FormLabel>
              <FormControl
                className = "FormControl"
                size="lg"
                value={workoutSetName}
                id="inputWorkoutSetName"
                as="textarea"
                onChange={e => setWorkoutSetName(e.target.value)}
              />
              <LoaderButton
                type="submit"
                disabled={!validateSetForm()}
                onClick={e => onClickCreateSetButton(e)}
              >
                Create
              </LoaderButton>
            </>
          }
          { confirmSetSelection && 
            <Form.Text>
              You've selected the workout set: {workoutSetName}.
            </Form.Text>
          }
          { confirmSetCreation &&
            <Form.Text>
              You've created and selected the workout set: {workoutSetName}.
            </Form.Text>
          }
        </FormGroup>

        {/* Inputting Workout Information */}
        { showInputWorkout && 
          <>
            <FormGroup controlId="workoutName">

              {/* Inputting Workout Name */}
              <FormLabel className="FormLabel"> Workout Name: </FormLabel>
              <FormControl
                className = "FormControl"
                value={workoutName}
                as="textarea"
                onChange={e => setWorkoutName(e.target.value)}
              />
            </FormGroup>
            
            {/* Inputting Workout Measure */}
            <Tabs
              id="chooseTimeMeasure"
              defaultActiveKey="time"
            >
              <Tab eventKey="time" label="Time">
                <FormGroup controlId="workoutTime">
                  <FormLabel className="FormLabel"> Workout Time (secs): </FormLabel>
                  <FormControl
                    value={workoutTime}
                    as="textarea"
                    onChange={e => setWorkoutTime(e.target.value) & setWorkoutReps(0)}
                  />
                </FormGroup>
              </Tab>
              <Tab eventKey="reps" label="Reps">
                <FormGroup controlId="workoutReps">
                  <FormLabel className="FormLabel"> Reps: </FormLabel>
                  <FormControl
                    value={workoutReps}
                    as="textarea"
                    onChange={e => setWorkoutReps(e.target.value) & setWorkoutTime(0)}
                  />
                </FormGroup>
              </Tab>
            </Tabs>
            <LoaderButton
              block
              type="submit"
              isLoading={isLoading}
              disabled={!validateWorkoutForm()}
              onClick={handleSubmit}
            >
              Add
            </LoaderButton>
          </>
        }
      </form>
    </div>
  );
}