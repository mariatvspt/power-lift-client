import React, { useRef, useState, useEffect } from "react";
import { Overlay, Tooltip, Modal, DropdownButton, Form, Button, Dropdown, Card, Nav, Col, Row, TabContainer, TabContent, NavItem, NavLink } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import { confirmEditWorkoutSet, confirmDeleteWorkoutSet, onChangeEditWorkoutSetName, onClickEditSetButton, onClickDeleteSetButton, onSelectWorkoutSetTab } from "../controllers/DisplaySetsController.js";
import { confirmEditWorkout, confirmDeleteWorkout, onChangeEditWorkoutName, onChangeEditWorkoutMeasure, onClickEditWorkoutButton, onClickDeleteWorkoutButton, includes, workoutMeasureFields } from "../controllers/DisplayWorkoutsController.js"
import { onChangeNewWorkoutName, onChangeNewWorkoutMeasure, onClickNewWorkoutDoneButton, onSelectNewWorkoutDropdown } from "../controllers/AddNewWorkoutController.js";
import { onChangeNewSetName, onClickNewSetDoneButton } from "../controllers/AddNewSetController.js";
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
    const [editWorkoutDropDownTitle, setEditWorkoutDropDownTitle] = useState("");
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
    const [duplicateNewSetNameError, setDuplicateNewSetNameError] = useState(true);
    const [emptyNewSetNameError, setEmptyNewSetNameError] = useState(true);

    // add new workout
    const [showNewWorkoutFields, setShowNewWorkoutFields] = useState(false);
    const [newWorkoutMeasureType,setNewWorkoutMeasureType] = useState("Select Workout Measure");
    const [disableNewWorkoutDropdown, setDisableNewWorkoutDropdown] = useState(true);
    const [disableNewWorkoutMeasure, setDisableNewWorkoutMeasure] = useState(true);
    const [disableNewWorkoutDoneButton, setDisableNewWorkoutDoneButton] = useState(true);
    const [newWorkoutUnits, setNewWorkoutUnits] = useState("");
    const [newWorkoutName, setNewWorkoutName] = useState("");
    const [newWorkoutMeasure, setNewWorkoutMeasure] = useState("");

    const setNameOverlayTarget = useRef(null);
    const newSetNameOverlayTarget = useRef(null);
    const editSetNameOverlayTarget = useRef(null);
    const editSetMeasureOverlayTarget = useRef(null);

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

    /*** DISPLAY TOOLTIP ***/

    function displaySetNameTooltip(overlayTarget, emptyError, duplicateError) {
        return (
            <>
                <Overlay target={overlayTarget.current} show={emptyError} placement="left">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        Please enter a non-empty set name.
                    </Tooltip>
                    )}
                </Overlay>
                <Overlay target={overlayTarget.current} show={duplicateError} placement="left">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        Please enter a non-existing set name.
                    </Tooltip>
                    )}
                </Overlay>
            </>
        );
    }

    function displayWorkoutTooltip(overlayTarget, emptyError) {
        return (
            <>
                <Overlay target={overlayTarget.current} show={emptyError} placement="right">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        This field cannot be empty.
                    </Tooltip>
                    )}
                </Overlay>
            </>
        );
    }

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
                    ref={setNameOverlayTarget}
                    className="EditSetFormControl"
                    placeholder="Edit Set Name"
                    defaultValue={workoutSetName}
                    key={"EditSetForm"+i}
                    onChange={e => onChangeEditWorkoutSetName(e, allSets, i, setUpdatedWorkoutSetName, setEmptySetNameError, setDuplicateSetNameError)}/>
                {displaySetNameTooltip(setNameOverlayTarget, emptySetNameError, duplicateSetNameError)}
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
                onSelect={e => onSelectWorkoutSetTab(e, allSets, showEditSetFields, setKey, setSetSelected, setShowEditSetFields, setShowNewWorkoutFields)}
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
                <Card.Header className="WorkoutHeader" key={"WorkoutCardHeader"+i}>
                    <Form.Control
                        ref={editSetNameOverlayTarget}
                        placeholder="Edit Workout Name"
                        defaultValue={workoutName}
                        key={"EditWorkoutForm"+i}
                        onChange={e => onChangeEditWorkoutName(e, setUpdatedWorkoutName, setEmptyEditWorkoutNameError)}/>
                    {displayWorkoutTooltip(editSetNameOverlayTarget, emptyEditWorkoutNameError)}
                </Card.Header>
                <Card.Body key={"CardBodyKey"+i}>
                    <DropdownButton
                        disabled={emptyEditWorkoutNameError}
                        size="lg"
                        variant="outline-dark"
                        onSelect={e => workoutMeasureFields(e, setEditWorkoutDropDownTitle, setWorkoutMeasurePlaceholder, setEditWorkoutUnits, setUpdatedWorkoutMeasureType)}
                        title={editWorkoutDropDownTitle}
                        key={"WorkoutMeasureTypeDropdown"+i}>
                        <Dropdown.Item
                            eventKey="workoutTime">
                                Workout Time
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="workoutReps">
                                Number of Reps
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        ref={editSetMeasureOverlayTarget}
                        disabled={emptyEditWorkoutNameError}
                        placeholder={workoutMeasurePlaceholder}
                        defaultValue={workoutMeasure}
                        key={"EditWorkoutMeasure"+i}
                        onChange={e => onChangeEditWorkoutMeasure(e, setUpdatedWorkoutMeasure, setEmptyEditWorkoutMeasureError)}/>
                        {displayWorkoutTooltip(editSetMeasureOverlayTarget, emptyEditWorkoutMeasureError)}
                        <p>{editWorkoutUnits}</p>
                        <Button
                            disabled={emptyEditWorkoutNameError || emptyEditWorkoutMeasureError}
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
                            onClick={e => setShowEditWorkoutFields(-1) & setEmptyEditWorkoutNameError(false) & setEmptyEditWorkoutMeasureError(false)}>
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

    /*** DISPLAY NEW SET & WORKOUT FIELDS ***/

    function addNewSet() {
        return (
            <>
                <Button key="NewSetButton" className="NewSetButton" size="lg" block variant="light" onClick={e => setShowNewSetFields(!showNewSetFields)}>
                    <MDBIcon key="NewWorkoutButtonIcon" icon="plus"/>
                    {'\t'} Add New Set
                </Button>
                { showNewSetFields &&
                    <Form className="form-inline EditSetForm">
                    <Form.Control
                        key="NewSetForm"
                        ref={newSetNameOverlayTarget}
                        className="EditSetFormControl"
                        placeholder="New Set Name"
                        onChange={e => onChangeNewSetName(e, allSets, setNewSetName, setEmptyNewSetNameError, setDuplicateNewSetNameError)}/>
                    {displaySetNameTooltip(newSetNameOverlayTarget, emptyNewSetNameError, duplicateNewSetNameError)}
                    <Button
                        disabled={emptyNewSetNameError || duplicateNewSetNameError}
                        key="NewSetDoneButton"
                        className="EditSetButtons"
                        variant="info"
                        onClick={e => onClickNewSetDoneButton(allData, allSets, newSetName, setShowNewSetFields, setAllSets, setAllData)}>
                        <MDBIcon icon="check"/>
                    </Button>
                    <Button key="CancelNewSetButton" className="EditSetButtons" variant="danger" onClick={e => setShowNewSetFields(false)}>
                        <MDBIcon icon="times"/>
                    </Button>
                </Form>
                }
            </>
        );
    }

    function addNewWorkout(set) {
        return (
            <>
                <Button key="NewWorkoutButton" className ="NewWorkoutButton" size="lg" block variant="light" onClick={e => setShowNewWorkoutFields(!showNewWorkoutFields)}>
                    <MDBIcon key="NewWorkoutButtonIcon" icon="plus"/>
                    {'\t'} Add New Workout
                </Button>
                { showNewWorkoutFields &&
                    <Card key="NewWorkoutCard">
                        <Card.Header key="NewWorkoutCardHeader" className="NewWorkoutHeader">
                            <Form.Control
                                key="NewWorkoutForm"
                                placeholder="New Workout Name"
                                onChange={e => onChangeNewWorkoutName(e, setNewWorkoutName, setDisableNewWorkoutDropdown)}/>
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
                                    onClick={e => onClickNewWorkoutDoneButton(allData, set, newWorkoutName, newWorkoutMeasureType, newWorkoutMeasure, setShowNewWorkoutFields, setAllData)}>
                                    Done
                                </Button>
                                <Button
                                    key="CancelNewWorkoutButton"
                                    className="CancelNewWorkoutButton"
                                    variant="danger"
                                    onClick={e => setShowNewWorkoutFields(false)}>
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