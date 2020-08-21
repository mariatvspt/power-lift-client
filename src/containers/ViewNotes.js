import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Dropdown, Card, Nav, Col, Row, TabContainer, TabContent, NavItem } from "react-bootstrap";
// controllers
import { confirmEditWorkoutSet, confirmDeleteWorkoutSet, onChangeEditWorkoutSetName, onClickEditSetButton, onClickDeleteSetButton, onSelectWorkoutSetTab } from "../controllers/DisplaySetsController.js";
import { cancelEditWorkout, confirmEditWorkout, confirmDeleteWorkout, onChangeEditWorkoutName, onChangeEditWorkoutMeasure, onClickEditWorkoutButton, onClickDeleteWorkoutButton, includes, onSelectWorkoutMeasureType } from "../controllers/DisplayWorkoutsController.js"
import { onChangeNewWorkoutName, onChangeNewWorkoutMeasure, onClickNewWorkoutDoneButton, onSelectNewWorkoutDropdown } from "../controllers/AddNewWorkoutController.js";
import { onChangeNewSetName, onClickNewSetDoneButton } from "../controllers/AddNewSetController.js";
// components
import WorkoutHeader from "../components/WorkoutHeader.js";
import WorkoutBody from "../components/WorkoutBody.js";
import SetTab from "../components/SetTab.js";
import AddButton from "../components/AddButton.js";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.js";

import "./ViewNotes.css"

export default function ViewNotes() {
    const [allSets, setAllSets] = useState([]);
    const [allData, setAllData] = useState({});
    const [key, setKey] = useState("");
    const [setSelected, setSetSelected] = useState(false);
    
    // edit set
    const [emptySetNameError, setEmptySetNameError] = useState(false);
    const [duplicateSetNameError, setDuplicateSetNameError] = useState(false);
    const [showEditSetFields, setShowEditSetFields] = useState(-1);
    const [updatedWorkoutSetName, setUpdatedWorkoutSetName] = useState("");

    // delete set
    const [deletedSet, setDeletedSet] = useState("");
    const [deletedSetLength, setDeletedSetLength] = useState(-1);

    // edit workout
    const [showEditWorkoutFields, setShowEditWorkoutFields] = useState(-1);
    const [editWorkoutUnits, setEditWorkoutUnits] = useState("");
    const [workoutMeasurePlaceholder, setWorkoutMeasurePlaceholder] = useState("");
    const [updatedWorkoutName, setUpdatedWorkoutName] = useState("");
    const [updatedWorkoutMeasure, setUpdatedWorkoutMeasure] = useState(0);
    const [updatedWorkoutMeasureType, setUpdatedWorkoutMeasureType] = useState("");
    const [emptyEditWorkoutNameError, setEmptyEditWorkoutNameError] = useState(false);
    const [emptyEditWorkoutMeasureError, setEmptyEditWorkoutMeasureError] = useState(false);
    
    // delete workout
    const [deletedWorkoutSetName, setDeletedWorkoutSetName] = useState("");
    const [deletedWorkoutName, setDeletedWorkoutName] = useState("");
    const [deletedWorkoutMeasureType, setDeletedWorkoutMeasureType] = useState("");
    const [deletedWorkoutMeasure, setDeletedWorkoutMeasure] = useState(0);
    const [deletedWorkoutIndex, setDeletedWorkoutIndex] = useState(-1);

    // show modal
    const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] = useState(false);
    const [showDeleteSetModal, setShowDeleteSetModal] = useState(false);

    // add new set
    const [showNewSetFields, setShowNewSetFields] = useState(false);
    const [newSetName, setNewSetName] = useState("");
    const [duplicateNewSetNameError, setDuplicateNewSetNameError] = useState(false);
    const [emptyNewSetNameError, setEmptyNewSetNameError] = useState(true);

    // add new workout
    const [showNewWorkoutFields, setShowNewWorkoutFields] = useState(false);
    const [newWorkoutMeasureType,setNewWorkoutMeasureType] = useState("Select Workout Measure");
    const [newWorkoutUnits, setNewWorkoutUnits] = useState("");
    const [newWorkoutName, setNewWorkoutName] = useState("");
    const [newWorkoutMeasure, setNewWorkoutMeasure] = useState("");
    const [newWorkoutMeasurePlaceholder, setNewWorkoutMeasurePlaceholder] = useState("");
    const [emptyNewWorkoutNameError, setEmptyNewWorkoutNameError] = useState(true);
    const [emptyNewWorkoutMeasureTypeError, setEmptyNewWorkoutMeasureTypeError] = useState(true);
    const [emptyNewWorkoutMeasureError, setEmptyNewWorkoutMeasureError] = useState(false);

    // tooltip overlay targets
    const setNameOverlayTarget = useRef(null);
    const newSetNameOverlayTarget = useRef(null);
    const workoutNameOverlayTarget = useRef(null);
    const workoutMeasureOverlayTarget = useRef(null);
    const newWorkoutNameOverlayTarget = useRef(null);
    const newWorkoutMeasureOverlayTarget = useRef(null);
    

    useEffect(() => {
        // Fetch all sets with view_all API
        async function fetchSets() {
          const viewAllResponse = await fetch('/view_all');
          const allData = await viewAllResponse.json();
          setAllData(allData.workoutSets);
          setAllSets(Object.keys(allData.workoutSets));
        }
        fetchSets();
    }, []);

    /*** DISPLAY SETS ***/

    function displayAllSets() {
        let allSetsArray = [];

        for(var i = 0; i < allSets.length; i++) {
            allSetsArray.push(
                <NavItem key={"set"+i}>
                    {   showEditSetFields == i
                        ? <> {displayEditSetFields(allSets[i], i)} </>
                        : <> {displayEachSet(allSets[i], i)} </>   
                    }
                </NavItem>
            );
        }

        return allSetsArray;
    }

    function displayEditSetFields(workoutSetName, i) {
        return (
            <SetTab
                workoutSetName={workoutSetName}
                index={i}
                type="edit"
                onChangeSetName={e => onChangeEditWorkoutSetName(e, allSets, i, setUpdatedWorkoutSetName, setEmptySetNameError, setDuplicateSetNameError)}
                confirmWorkoutSet={e => confirmEditWorkoutSet(allData, allSets, updatedWorkoutSetName, i, setShowEditSetFields, setAllSets, setAllData, setKey)}
                cancelWorkoutSet={e => setShowEditSetFields(-1)}
                setNameOverlayTarget={setNameOverlayTarget}
                emptySetNameError={emptySetNameError}
                duplicateSetNameError={duplicateSetNameError}/>
        );
    }

    function displayEachSet(workoutSetName, i) {
        return (
            <SetTab
                workoutSetName={workoutSetName}
                index={i}
                onSelectWorkoutSetTab={e => onSelectWorkoutSetTab(e, allSets, showEditSetFields, setKey, setSetSelected, setShowEditSetFields, setShowNewWorkoutFields)}
                onClickDeleteSetButton={e => onClickDeleteSetButton(allData, workoutSetName, setShowDeleteSetModal, setDeletedSet, setDeletedSetLength)}
                onClickEditSetButton={e => onClickEditSetButton(workoutSetName, i, setShowEditSetFields, setUpdatedWorkoutSetName)}/>
        );
    }

    /*** DISPLAY WORKOUT ***/

    function displayAllWorkouts(set) {
        let allWorkoutsArray = [];
        let workouts = allData[set];

        if(workouts.length == 0) {
            return (
                <p className="NoWorkoutToDisplayText"> No workouts have been added to this set. </p>
            );
        }

        for(var i=0; i < workouts.length; i++) {
            const workoutName = workouts[i].workoutName;
            let measureType = "";
            let workoutMeasure = "";

            if(workouts[i].workoutTime) {
                measureType = "workoutTime";
                workoutMeasure = workouts[i].workoutTime;
            }
            else if(workouts[i].workoutReps) {
                measureType = "workoutReps";
                workoutMeasure = workouts[i].workoutReps;
            }
            
            allWorkoutsArray.push(
                <>
                    <Card className="WorkoutCard" key={"WorkoutCardKey"+i}>
                        {
                            showEditWorkoutFields == i
                            ? <>
                                {displayEditWorkoutFields(set, workoutName, workoutMeasure, i)}
                            </>
                            : <>
                                {displayEachWorkout(set, workoutName, measureType, workoutMeasure, i)}
                            </>
                        }
                    </Card>
                </>
            );
        }


        return allWorkoutsArray;
    }

    function displayEditWorkoutFields(set, workoutName, workoutMeasure, i) {
        return (
            <>
                <WorkoutHeader
                    workoutName={workoutName}
                    index={i}
                    type="edit"
                    onChangeWorkoutName={e => onChangeEditWorkoutName(e, setUpdatedWorkoutName, setEmptyEditWorkoutNameError)}
                    workoutNameOverlayTarget={workoutNameOverlayTarget}
                    emptyWorkoutNameError={emptyEditWorkoutNameError}/>
                <WorkoutBody
                    workoutMeasure={workoutMeasure}
                    index={i}
                    type="edit"
                    emptyWorkoutNameError={emptyEditWorkoutNameError}
                    emptyWorkoutMeasureError={emptyEditWorkoutMeasureError}
                    workoutDropDownTitle={updatedWorkoutMeasureType}
                    workoutUnits={editWorkoutUnits}
                    workoutMeasurePlaceholder={workoutMeasurePlaceholder}
                    workoutMeasureOverlayTarget={workoutMeasureOverlayTarget}
                    onChangeEditWorkoutMeasure={e => onChangeEditWorkoutMeasure(e, setUpdatedWorkoutMeasure, setEmptyEditWorkoutMeasureError)}
                    onSelectWorkoutMeasureType={e => onSelectWorkoutMeasureType(e, setUpdatedWorkoutMeasureType, setWorkoutMeasurePlaceholder, setEditWorkoutUnits)}
                    confirmEditWorkout={e => confirmEditWorkout(allData, set, updatedWorkoutName, updatedWorkoutMeasureType, updatedWorkoutMeasure, i, setShowEditWorkoutFields, setAllData)}
                    cancelEditWorkout={e => cancelEditWorkout(setShowEditWorkoutFields, setEmptyEditWorkoutNameError, setEmptyEditWorkoutMeasureError)}/>
            </>
        );
    }

    function displayEachWorkout(set, workoutName, measureType, workoutMeasure, i) {
        return (
            <>
                <WorkoutHeader
                    workoutName={workoutName}
                    index={i}
                    onClickDeleteWorkoutButton={e => onClickDeleteWorkoutButton(set, workoutName, measureType, workoutMeasure, i, setShowDeleteWorkoutModal, setDeletedWorkoutSetName, setDeletedWorkoutName, setDeletedWorkoutMeasureType, setDeletedWorkoutMeasure, setDeletedWorkoutIndex)}
                    onClickEditWorkoutButton={e => onClickEditWorkoutButton(measureType, workoutName, workoutMeasure, i, setShowEditWorkoutFields, setUpdatedWorkoutName, setUpdatedWorkoutMeasure, setWorkoutMeasurePlaceholder, setEditWorkoutUnits, setUpdatedWorkoutMeasureType)}/>
                <WorkoutBody
                    measureType={measureType}
                    workoutMeasure={workoutMeasure}
                    index={i}/>
            </>
        );
    }

    /*** DISPLAY NEW SET & WORKOUT FIELDS ***/

    function addNewSet() {
        return (
            <>
                <AddButton type="set" setShowNewFields={e => setShowNewSetFields(!showNewSetFields)}/>
                { showNewSetFields &&
                    <SetTab
                        type="new"
                        onChangeSetName={e => onChangeNewSetName(e, allSets, setNewSetName, setEmptyNewSetNameError, setDuplicateNewSetNameError)}
                        setNameOverlayTarget={newSetNameOverlayTarget}
                        emptySetNameError={emptyNewSetNameError}
                        duplicateSetNameError={duplicateNewSetNameError}
                        confirmWorkoutSet={e => onClickNewSetDoneButton(allData, allSets, newSetName, setShowNewSetFields, setAllSets, setAllData)}
                        cancelWorkoutSet={e => setShowNewSetFields(false)}/>
                }
            </>
        );
    }

    function addNewWorkout(set) {
        return (
            <>
                <AddButton type="workout" setShowNewFields={e => setShowNewWorkoutFields(!showNewWorkoutFields)}/>
                { showNewWorkoutFields &&
                    <Card key="NewWorkoutCard">
                        <WorkoutHeader
                            type="new"
                            onChangeWorkoutName={e => onChangeNewWorkoutName(e, setNewWorkoutName, setEmptyNewWorkoutNameError)}
                            workoutNameOverlayTarget={newWorkoutNameOverlayTarget}
                            emptyWorkoutNameError={emptyNewWorkoutNameError}/>
                        <WorkoutBody
                            type="new"
                            emptyWorkoutNameError={emptyNewWorkoutNameError}
                            emptyWorkoutMeasureError={emptyNewWorkoutMeasureError}
                            workoutDropDownTitle={newWorkoutMeasureType}
                            workoutUnits={newWorkoutUnits}
                            workoutMeasurePlaceholder={newWorkoutMeasurePlaceholder}
                            emptyWorkoutMeasureTypeError={emptyNewWorkoutMeasureTypeError}
                            workoutMeasureOverlayTarget={newWorkoutMeasureOverlayTarget}
                            onSelectWorkoutMeasureType={e => onSelectNewWorkoutDropdown(e, emptyNewWorkoutMeasureTypeError, setNewWorkoutMeasureType, setEmptyNewWorkoutMeasureTypeError, setNewWorkoutUnits, setNewWorkoutMeasurePlaceholder, setEmptyNewWorkoutMeasureError)}
                            onChangeEditWorkoutMeasure={e => onChangeNewWorkoutMeasure(e, setNewWorkoutMeasure, setEmptyNewWorkoutMeasureError)}
                            confirmEditWorkout={e => onClickNewWorkoutDoneButton(allData, set, newWorkoutName, newWorkoutMeasureType, newWorkoutMeasure, setShowNewWorkoutFields, setAllData)}
                            cancelEditWorkout={e => setShowNewWorkoutFields(false)}/>
                    </Card>
                }       
            </>
        );
    }

  return (
    <div className="ViewNotes">
        <ConfirmDeleteModal
            type="set"
            showModal={showDeleteSetModal}
            hideModal={e => setShowDeleteSetModal(false)}
            modalTitle={deletedSet}
            deletedSetLength={deletedSetLength}
            cancelDelete={e => setShowDeleteSetModal(false)}/>
        <ConfirmDeleteModal
            type="workout"
            showModal={showDeleteWorkoutModal}
            hideModal={e => setShowDeleteWorkoutModal(false)}
            modalTitle={deletedWorkoutName}
            deletedWorkoutMeasureType={deletedWorkoutMeasureType}
            deletedWorkoutMeasure={deletedWorkoutMeasure}
            cancelDelete={e => setShowDeleteWorkoutModal(false)}
            confirmDelete={e => confirmDeleteWorkout(allData, deletedWorkoutSetName, deletedWorkoutIndex, setShowDeleteWorkoutModal, setAllData)}/>
        <TabContainer activeKey={key}>
            <Row>
                <Col sm={3}>
                    <h1>Sets</h1>
                    <Dropdown.Divider />
                    <Nav className="Nav" variant="pills" className="flex-column">
                        {displayAllSets()}
                        <Dropdown.Divider />
                        {/* <NavLink onSelect={e => setKey(e)} eventKey="AllWorkouts">View All</NavLink> */}
                        {addNewSet()}
                    </Nav>
                </Col>
                <Col sm={9}>
                    { setSelected &&
                        <>
                            <h2>Workouts</h2>
                            <Dropdown.Divider />
                        </>
                    }
                    <TabContent>
                        {includes(key, allSets) && displayAllWorkouts(key)}
                        {setSelected && addNewWorkout(key)}
                    </TabContent>
                </Col>
            </Row>
        </TabContainer>
    </div>
  );
}