import React, { useState, useEffect } from "react";
import { Dropdown, Card, Nav, Col, Row, TabContainer, TabContent, NavItem } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router-dom";
import { MDBIcon } from 'mdbreact';
// controllers
import { confirmEditWorkoutSet, confirmDeleteWorkoutSet, onChangeEditWorkoutSetName, onClickEditSetButton, onClickDeleteSetButton, onSelectWorkoutSetTab } from "../controllers/DisplaySetsController.js";
import { cancelEditWorkout, confirmEditWorkout, confirmDeleteWorkout, onChangeEditWorkoutName, onChangeEditWorkoutMeasure, onClickEditWorkoutButton, onClickDeleteWorkoutButton, includes, onSelectWorkoutMeasureType } from "../controllers/DisplayWorkoutsController.js"
import { onChangeNewWorkoutName, onChangeNewWorkoutMeasure, onClickNewWorkoutDoneButton, onSelectNewWorkoutDropdown } from "../controllers/AddNewWorkoutController.js";
import { onChangeNewSetName, onClickNewSetDoneButton } from "../controllers/AddNewSetController.js";
import { onDragEnd } from "../controllers/ReorderWorkouts.js";
// components
import WorkoutHeader from "../components/WorkoutHeader.js";
import WorkoutBody from "../components/WorkoutBody.js";
import SetTab from "../components/SetTab.js";
import AddButton from "../components/AddButton.js";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.js";

import "./Home.css"

export default function Home() {
    const history = useHistory();
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
                <Draggable key={"WorkoutCardDraggable"+i} draggableId={i.toString()} index={i}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <Card
                                border={snapshot.isDragging && "dark"}
                                className="WorkoutCard"
                                key={"WorkoutCardKey"+provided["draggableProps"]["data-rbd-draggable-id"]}>
                                {
                                    showEditWorkoutFields == provided["draggableProps"]["data-rbd-draggable-id"]
                                    ? <> {displayEditWorkoutFields(set, workoutName, workoutMeasure, provided["draggableProps"]["data-rbd-draggable-id"])} </>
                                    : <> {displayEachWorkout(set, workoutName, measureType, workoutMeasure, provided["draggableProps"]["data-rbd-draggable-id"])} </>
                                }
                            </Card>
                        </div>
                    )}
                </Draggable>
            );
        }

        return (
            <DragDropContext onDragEnd={e => onDragEnd(e, set, allData, setAllData)}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                            {allWorkoutsArray}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }

    function displayEditWorkoutFields(set, workoutName, workoutMeasure, i) {
        return (
            <>
                <WorkoutHeader
                    workoutName={workoutName}
                    index={i}
                    type="edit"
                    onChangeWorkoutName={e => onChangeEditWorkoutName(e, setUpdatedWorkoutName, setEmptyEditWorkoutNameError)}
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
                            emptyWorkoutNameError={emptyNewWorkoutNameError}/>
                        <WorkoutBody
                            type="new"
                            emptyWorkoutNameError={emptyNewWorkoutNameError}
                            emptyWorkoutMeasureError={emptyNewWorkoutMeasureError}
                            workoutDropDownTitle={newWorkoutMeasureType}
                            workoutUnits={newWorkoutUnits}
                            workoutMeasurePlaceholder={newWorkoutMeasurePlaceholder}
                            emptyWorkoutMeasureTypeError={emptyNewWorkoutMeasureTypeError}
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
            cancelDelete={e => setShowDeleteSetModal(false)}
            confirmDelete={e => confirmDeleteWorkoutSet(allData, deletedSet, setShowDeleteSetModal, setAllData, setAllSets)}/>
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
                    <Nav variant="pills" className="flex-column">
                        {displayAllSets()}
                        <Dropdown.Divider />
                        {/* <NavLink onSelect={e => setKey(e)} eventKey="AllWorkouts">View All</NavLink> */}
                        {addNewSet()}
                    </Nav>
                </Col>
                <Col sm={9}>
                    { setSelected &&
                        <>
                            <h2>
                                {'Workouts \t'}
                                <MDBIcon far icon="play-circle" type="button" onClick={e => history.push(`/play/${key}`)}/>
                            </h2>
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