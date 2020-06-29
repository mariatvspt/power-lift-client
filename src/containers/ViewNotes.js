import React, { useRef, useState, useEffect } from "react";
import { Overlay, Tooltip, Modal, DropdownButton, Form, Button, Dropdown, Card, Nav, Col, Row, TabContainer, TabContent, NavItem, NavLink } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import { confirmEditWorkoutSet, confirmDeleteWorkoutSet, onChangeEditWorkoutSetName, onClickEditSetButton, onClickDeleteSetButton, onSelectWorkoutSetTab } from "../controllers/DisplaySetsController.js";
import { confirmEditWorkout, confirmDeleteWorkout, onClickEditWorkoutButton, onClickDeleteWorkoutButton, includes, workoutMeasureFields } from "../controllers/DisplayWorkoutsController.js"
import { onChangeNewSetName, onChangeNewWorkoutMeasure, onClickNewWorkoutDoneButton, onSelectNewWorkoutDropdown } from "../controllers/AddNewSetController.js";
import "./ViewNotes.css"

export default function ViewNotes() {
    const [allSets, setAllSets] = useState([]);
    const [allData, setAllData] = useState({});
    const [key, setKey] = useState("");
    const [setSelected, setSetSelected] = useState(false);
    const [emptySetNameError, setEmptySetNameError] = useState(false);
    const [duplicateSetNameError, setDuplicateSetNameError] = useState(false);
    const [showEditWorkoutFields, setShowEditWorkoutFields] = useState(-1);
    const [showEditSetFields, setShowEditSetFields] = useState(-1);
    const [updatedWorkoutSetName, setUpdatedWorkoutSetName] = useState("");
    const [updatedWorkoutName, setUpdatedWorkoutName] = useState("");
    const [updatedWorkoutMeasure, setUpdatedWorkoutMeasure] = useState(0);
    const [updatedWorkoutMeasureType, setUpdatedWorkoutMeasureType] = useState("");
    const [deletedSet, setDeletedSet] = useState("");
    const [deletedSetLength, setDeletedSetLength] = useState(-1);
    const [deletedWorkoutSetName, setDeletedWorkoutSetName] = useState("");
    const [deletedWorkoutName, setDeletedWorkoutName] = useState("");
    const [deletedWorkoutMeasureType, setDeletedWorkoutMeasureType] = useState("");
    const [deletedWorkoutMeasure, setDeletedWorkoutMeasure] = useState(0);
    const [deletedWorkoutIndex, setDeletedWorkoutIndex] = useState(-1);
    const [editWorkoutUnits, setEditWorkoutUnits] = useState("");
    const [editWorkoutDropDownTitle, setEditWorkoutDropDownTitle] = useState("");
    const [workoutMeasurePlaceholder, setWorkoutMeasurePlaceholder] = useState("");
    const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] = useState(false);
    const [showDeleteSetModal, setShowDeleteSetModal] = useState(false);

    // add new set
    const [showNewSetFields, setShowNewSetFields] = useState(false);
    const [newWorkoutMeasureType,setNewWorkoutMeasureType] = useState("Select Workout Measure");
    const [disableNewWorkoutMeasure, setDisableNewWorkoutMeasure] = useState(true);
    const [disableNewWorkoutDropdown, setDisableNewWorkoutDropdown] = useState(true);
    const [disableNewWorkoutDoneButton, setDisableNewWorkoutDoneButton] = useState(true);
    const [newWorkoutUnits, setNewWorkoutUnits] = useState("");
    const [newWorkoutName, setNewWorkoutName] = useState("");
    const [newWorkoutMeasure, setNewWorkoutMeasure] = useState("");

    const emptySetNameOverlayTarget = useRef(null);

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

    /*** DISPLAY MODALS ***/

    function displayDeleteSetModal() {
        return (
            <Modal show={showDeleteSetModal} onHide={e => setShowDeleteSetModal(false)} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete this set? </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="SetNameInModal">{deletedSet}</p>
                    <p className="SetLengthInModal"> Total workouts: {deletedSetLength}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={e => setShowDeleteSetModal(false)} variant="secondary">Cancel</Button>
                    <Button onClick={e => confirmDeleteWorkoutSet(allData, deletedSet, setShowDeleteSetModal, setAllData, setAllSets)} variant="danger">Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }

     // Display modal to confirm the deletion of a specific workout
     function displayDeleteWorkoutModal() {
        return (
            <Modal show={showDeleteWorkoutModal} onHide={e => setShowDeleteWorkoutModal(false)} style={{opacity:1}}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete this workout? </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="WorkoutNameInModal">{deletedWorkoutName}</p>
                    {deletedWorkoutMeasureType == "workoutReps" && 
                        <>
                            <p className="WorkoutTypeInModal">Number of Reps:</p>
                            <p className="WorkoutMeasureInModal">{deletedWorkoutMeasure} reps</p>
                        </>
                    }
                    {deletedWorkoutMeasureType == "workoutTime" &&
                        <>
                            <p className="WorkoutTypeInModal">Workout Time:</p>
                            <p className="WorkoutMeasureInModal">{deletedWorkoutMeasure} seconds</p>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={e => setShowDeleteWorkoutModal(false)} variant="secondary">Cancel</Button>
                    <Button onClick={e => confirmDeleteWorkout(allData, deletedWorkoutSetName, deletedWorkoutIndex, setShowDeleteWorkoutModal, setAllData)} variant="danger">Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /*** DISPLAY SETS ***/

    // Display all sets as NavItem
    function displayAllSets() {
        let allSetsArray = [];

        for(var i = 0; i < allSets.length; i++) {
            allSetsArray.push(
                <NavItem key={"set"+i}>
                    {   showEditSetFields == i
                        ? <>
                            {displayEditSetFields(allSets[i], i)}
                        </>
                        :<>
                            {displayEachSet(allSets[i], i)}
                        </>   
                    }
                </NavItem>
            );
        }

        return allSetsArray;
    }

    function displayEditSetFields(workoutSetName, i) {
        return (
            <Form className="form-inline EditSetForm">
                <Form.Control
                    ref={emptySetNameOverlayTarget}
                    className="EditSetFormControl"
                    placeholder="Edit Set Name"
                    defaultValue={workoutSetName}
                    key={"EditSetForm"+i}
                    onChange={e => onChangeEditWorkoutSetName(e, allSets, i, setUpdatedWorkoutSetName, setEmptySetNameError, setDuplicateSetNameError)}/>
                <Overlay target={emptySetNameOverlayTarget.current} show={emptySetNameError} placement="left">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        Please enter a non-empty set name.
                    </Tooltip>
                    )}
                </Overlay>
                <Overlay target={emptySetNameOverlayTarget.current} show={duplicateSetNameError} placement="left">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        Please enter a non-existing set name.
                    </Tooltip>
                    )}
                </Overlay>
                <Button
                    disabled={emptySetNameError || duplicateSetNameError}
                    className="EditSetButtons"
                    variant="info"
                    key={"ConfirmEditSetButton"+i}
                    onClick={e => confirmEditWorkoutSet(allData, allSets, updatedWorkoutSetName, i, setShowEditSetFields, setAllSets, setAllData, setKey)}>
                    <MDBIcon icon="check"/>
                </Button>
                <Button className="EditSetButtons" variant="danger" key={"CancelEditSetButton"+i} onClick={e => setShowEditSetFields(-1)}>
                    <MDBIcon icon="times"/>
                </Button>
            </Form>
        );
    }

    function displayEachSet(workoutSetName, i) {
        return (
            <NavLink
                className="SetTab"
                onSelect={e => onSelectWorkoutSetTab(e, allSets, showEditSetFields, setKey, setSetSelected, setShowEditSetFields)}
                key={"set"+i}
                id={i}
                eventKey={i}>
                {workoutSetName}   
                <Button className="ModifySetButton" variant="outline-dark" key={"DeleteSetButton"+i} onClick={e => onClickDeleteSetButton(allData, workoutSetName, setShowDeleteSetModal, setDeletedSet, setDeletedSetLength)}>
                    <MDBIcon icon="trash"/>
                </Button>
                <Button
                    className="ModifySetButton"
                    variant="outline-dark"
                    key={"EditSetButton"+i}
                    onClick={e => onClickEditSetButton(workoutSetName, i, setShowEditSetFields, setUpdatedWorkoutSetName)}>
                    <MDBIcon icon="edit"/>
                </Button>
            </NavLink>
        );
    }

    /*** DISPLAY WORKOUT ***/

    // Display all workouts in a set as Card
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
            );
        }

        return allWorkoutsArray;
    }

    function displayEditWorkoutFields(set, workoutName, workoutMeasure, i) {
        return (
            <>
                <Card.Header className="WorkoutHeader" key={"WorkoutCardHeader"+i}>
                    <Form.Control
                        placeholder="Edit Workout Name"
                        defaultValue={workoutName}
                        key={"EditWorkoutForm"+i}
                        onChange={e => setUpdatedWorkoutName(e.target.value)}/>
                </Card.Header>
                <Card.Body key={"CardBodyKey"+i}>
                    <DropdownButton
                        size="lg"
                        variant="outline-dark"
                        onSelect={e => workoutMeasureFields(e, setEditWorkoutDropDownTitle, setWorkoutMeasurePlaceholder, setEditWorkoutUnits, setUpdatedWorkoutMeasureType)}
                        title={editWorkoutDropDownTitle}
                        key={"WorkoutMeasureTypeDropdown"+i}>
                        <Dropdown.Item
                            eventKey="Workout Time">
                                Workout Time
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="Number of Reps">
                                Number of Reps
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        placeholder={workoutMeasurePlaceholder}
                        defaultValue={workoutMeasure}
                        key={"EditWorkoutMeasure"+i}
                        onChange={e => setUpdatedWorkoutMeasure(e.target.value)}/>
                        <p>{editWorkoutUnits}</p>
                        <Button
                        className="DoneEditWorkoutButton"
                        variant="secondary"
                        key={"DoneWorkoutButton"+i}
                        value={i}
                        onClick={e => confirmEditWorkout(allData, set, updatedWorkoutName, updatedWorkoutMeasureType, updatedWorkoutMeasure, i, setShowEditWorkoutFields, setAllData)}>
                        Done
                    </Button>
                    <Button
                        className="CancelEditWorkoutButton"
                        variant="danger"
                        key={"CancelWorkoutButton"+i}
                        onClick={e => setShowEditWorkoutFields(-1)}>
                        Cancel
                    </Button>
                </Card.Body>
            </>
        );
    }

    function displayEachWorkout(set, workoutName, measureType, workoutMeasure, i) {
        return (
            <>
                <Card.Header className="WorkoutHeader" key={"CardHeaderKey"+i}>
                    {workoutName}
                    <Button
                        className="ModifyWorkoutButton"
                        variant="danger"
                        key={"DeleteWorkoutButton"+i}
                        onClick={e => onClickDeleteWorkoutButton(set, workoutName, measureType, workoutMeasure, i, setShowDeleteWorkoutModal, setDeletedWorkoutSetName, setDeletedWorkoutName, setDeletedWorkoutMeasureType, setDeletedWorkoutMeasure, setDeletedWorkoutIndex)}>
                        Delete Workout
                        <MDBIcon icon="trash" className="ml-2"/>
                    </Button>
                    <Button
                        className="ModifyWorkoutButton"
                        variant="primary"
                        key={"EditWorkoutButton"+i}
                        onClick={e => onClickEditWorkoutButton(measureType, workoutName, workoutMeasure, i, setShowEditWorkoutFields, setUpdatedWorkoutName, setUpdatedWorkoutMeasure, workoutMeasureFields, setEditWorkoutDropDownTitle, setWorkoutMeasurePlaceholder, setEditWorkoutUnits, setUpdatedWorkoutMeasureType)}>
                        Edit Workout
                        <MDBIcon icon="edit" className="ml-2"/>
                    </Button>
                </Card.Header>
                <Card.Body key={"CardBodyKey"+i}>
                    {(measureType == "workoutTime") &&
                        <>
                            <Card.Title key={"WorkoutCardTitle"+i}> Workout Time: </Card.Title>
                            <Card.Text key={"WorkoutMeasure"+i}> {workoutMeasure + " seconds"} </Card.Text>
                        </>
                    }
                    {(measureType == "workoutReps") &&
                        <>
                            <Card.Title key={"WorkoutCardTitle"+i}> Number of Reps: </Card.Title>
                            <Card.Text key={"WorkoutMeasure"+i}> {workoutMeasure + " reps"} </Card.Text>
                        </>
                    }
                </Card.Body>
            </>
        );
    }

    /*** DISPLAY NEW WORKOUT FIELDS ***/

    function addNewWorkout(set) {
        return (
            <>
                <Button key="NewWorkoutButton" size="lg" block variant="light" onClick={e => setShowNewSetFields(!showNewSetFields)}>
                    <MDBIcon key="NewWorkoutButtonIcon" icon="plus"/>
                    {'\t'} Add New Workout
                </Button>
                { showNewSetFields &&
                    <Card key="NewWorkoutCard">
                        <Card.Header key="NewWorkoutCardHeader" className="NewWorkoutHeader">
                            <Form.Control
                                key="NewWorkoutForm"
                                placeholder="New Workout Name"
                                onChange={e => onChangeNewSetName(e, setNewWorkoutName, setDisableNewWorkoutDropdown)}/>
                        </Card.Header>
                        <Card.Body key="NewWorkoutCardBody">
                            <DropdownButton
                                disabled={disableNewWorkoutDropdown}
                                key="NewWorkoutMeasureTypeDropdown"
                                size="lg"
                                variant="outline-dark"
                                onSelect={e => onSelectNewWorkoutDropdown(e, setNewWorkoutMeasureType, setDisableNewWorkoutMeasure, setNewWorkoutUnits)}
                                title={newWorkoutMeasureType}>
                                <Dropdown.Item
                                    key="newWorkoutDropdownWorkoutTime"
                                    eventKey="Workout Time">
                                        Workout Time
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key="newWorkoutDropdownWorkoutReps"
                                    eventKey="Number of Reps">
                                        Number of Reps
                                </Dropdown.Item>
                            </DropdownButton>
                            <Form.Control
                                key="NewWorkoutMeasure"
                                disabled={disableNewWorkoutMeasure}
                                placeholder={workoutMeasurePlaceholder}
                                onChange={e => onChangeNewWorkoutMeasure(e, setNewWorkoutMeasure, setDisableNewWorkoutDoneButton)}/>
                                <p>{newWorkoutUnits}</p>
                                <Button
                                    disabled={disableNewWorkoutDoneButton}
                                    className="DoneNewWorkoutButton"
                                    variant="secondary"
                                    key="DoneNewWorkoutButton"
                                    onClick={e => onClickNewWorkoutDoneButton(allData, set, newWorkoutName, newWorkoutMeasureType, newWorkoutMeasure, setShowNewSetFields, setAllData)}>
                                    Done
                                </Button>
                                <Button
                                    key="CancelNewWorkoutButton"
                                    className="CancelNewWorkoutButton"
                                    variant="danger"
                                    onClick={e => setShowNewSetFields(false)}>
                                    Cancel
                                </Button>
                        </Card.Body>
                    </Card>
                }       
            </>
        );
    }

  return (
    <div className="ViewNotes">
        {displayDeleteWorkoutModal()}
        {displayDeleteSetModal()}
        <TabContainer activeKey={key}>
            <Row>
                <Col sm={3}>
                    <Nav className="Nav" variant="pills" className="flex-column">
                        {displayAllSets()}
                        <Dropdown.Divider />
                        <NavLink onSelect={e => setKey(e)} eventKey="AllWorkouts">View All</NavLink>
                    </Nav>
                </Col>
                <Col sm={9}>
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