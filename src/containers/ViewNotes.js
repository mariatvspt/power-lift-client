import React, { useRef, useState, useEffect } from "react";
import { OverlayTrigger, Modal, DropdownButton, Form, Button, Dropdown, Card, Nav, Col, Row, TabContainer, TabContent, NavItem, NavLink } from "react-bootstrap";
import { MDBBtn, MDBIcon } from 'mdbreact';
import LoaderButton from "../components/LoaderButton";
import { selectInput } from "aws-amplify";
import "./ViewNotes.css"

export default function ViewNotes() {
    const [allSets, setAllSets] = useState([]);
    const [allData, setAllData] = useState({});
    const [key, setKey] = useState("");
    const [showEditWorkoutFields, setShowEditWorkoutFields] = useState(-1);
    const [updatedWorkoutName, setUpdatedWorkoutName] = useState("");
    const [updatedWorkoutMeasure, setUpdatedWorkoutMeasure] = useState(0);
    const [updatedWorkoutMeasureType, setUpdatedWorkoutMeasureType] = useState("");
    const [deletedWorkoutSetName, setDeletedWorkoutSetName] = useState("");
    const [deletedWorkoutName, setDeletedWorkoutName] = useState("");
    const [deletedWorkoutMeasureType, setDeletedWorkoutMeasureType] = useState("");
    const [deletedWorkoutMeasure, setDeletedWorkoutMeasure] = useState(0);
    const [deletedWorkoutIndex, setDeletedWorkoutIndex] = useState(-1);
    const [DropDownTitle, setDropDownTitle] = useState("");
    const [workoutMeasurePlaceholder, setWorkoutMeasurePlaceholder] = useState("");
    const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] = useState(false);
    const [onMouseShowModifySetButtons, setOnMouseShowModifySetButtons] = useState(-1);
    const [onSelectShowModifySetButtons, setOnSelectShowModifySetButtons] = useState(-1);
    const [workoutSetIndex, setWorkoutSetIndex] = useState(-1);
    const [units, setUnits] = useState("");

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

    // Check if target element is in an array
    function includes(target, array) {
        for(var i=0; i<array.length; i++) {
            if(array[i] == target) {
                return true;
            }
        }
        return false;
    }

    // Set state of the workout measure fields
    function workoutMeasureFields(e) {
        if(e == "workoutTime") {
            setDropDownTitle("Workout Time");
            setWorkoutMeasurePlaceholder("Edit workout time");
            setUnits("seconds");
        }
        else if(e == "workoutReps") {
            setDropDownTitle("Number of Reps");
            setWorkoutMeasurePlaceholder("Edit number of reps");
            setUnits("reps")
        }
        setUpdatedWorkoutMeasureType(e);
    }

    function displayModifySetButtons(i) {
        return (
            <>
                {console.log(onMouseShowModifySetButtons, onSelectShowModifySetButtons)}
                {(onMouseShowModifySetButtons == i || onSelectShowModifySetButtons == i) &&
                    <>
                        <Button className="ModifySetButton" variant="outline-dark" key={"DeleteSetButton"+i} value={i}>
                            <MDBIcon icon="trash"/>
                        </Button>
                        <Button className="ModifySetButton" variant="outline-dark" key={"EditSetButton"+i} value={i}>
                            <MDBIcon icon="edit"/>
                        </Button>
                    </>
                }  
            </>
        );
    }

    // Display all sets as NavItem
    function displayAllSets() {
        let allSetsArray = [];

        for(var i = 0; i < allSets.length; i++) {
            allSetsArray.push(
                <NavItem key={"set"+i}>
                    <NavLink
                    onMouseEnter={e => setOnMouseShowModifySetButtons(e.target.id)}
                    onMouseLeave={e => setOnMouseShowModifySetButtons(-1)}
                    onSelect={e => setKey(allSets[e]) & setOnSelectShowModifySetButtons(e)}
                    key={"set"+i}
                    id={i}
                    eventKey={i}>
                        {allSets[i]}   
                        {displayModifySetButtons(i)}   
                    </NavLink>
                </NavItem>
            );
        }

        return allSetsArray;
    }

    // Display workout name as a card header
    function displayWorkoutName(set, workoutName, measureType, workoutMeasure, i) {
        return <Card.Header className="WorkoutHeader" key={"CardHeaderKey"+i}>
            { showEditWorkoutFields == i
                ? <>
                    <Form.Control placeholder="Edit Workout Name" defaultValue={workoutName} key={"EditWorkoutForm"+i} onChange={e => setUpdatedWorkoutName(e.target.value)}/>
                </>
                : <>
                {workoutName}
                    <Button className="ModifyWorkoutButton" variant="danger" key={"DeleteWorkoutButton"+i} value={i} onClick={e => onClickDeleteWorkoutButton(set, workoutName, measureType, workoutMeasure, i)}> Delete Workout
                        <MDBIcon icon="trash" className="ml-2"/>
                    </Button>
                    <Button className="ModifyWorkoutButton" variant="primary" key={"EditWorkoutButton"+i} value={i} onClick={e => onClickEditWorkoutButton(set, measureType, workoutName, workoutMeasure, i)}>
                        Edit Workout
                        <MDBIcon icon="edit" className="ml-2"/>
                    </Button>
                </>
            }
        </Card.Header>;
    }

    // Display workout measure as a card body
    function displayWorkoutMeasure(set, measureType, workoutMeasure, i) {
        return (
            <Card.Body key={"CardBodyKey"+i}>
                { showEditWorkoutFields == i
                        ? <>
                            <DropdownButton size="lg" variant="outline-dark" onSelect={e => workoutMeasureFields(e)} title={DropDownTitle} key={"WorkoutMeasureTypeDropdown"+i}>
                                <Dropdown.Item
                                    eventKey="workoutTime">
                                        Workout Time
                                </Dropdown.Item>
                                <Dropdown.Item
                                    eventKey="workoutReps">
                                        Number of Reps
                                </Dropdown.Item>
                            </DropdownButton>
                            <Form.Control placeholder={workoutMeasurePlaceholder} defaultValue={workoutMeasure} key={"EditWorkoutMeasure"+i} onChange={e => setUpdatedWorkoutMeasure(e.target.value)}/>
                            <p>{units}</p>
                            <Button className="DoneEditButton" variant="secondary" key={"DoneButton"+i} value={i} onClick={e => submitEditWorkout(set, e.target.value)}>
                                Done
                            </Button>
                            <Button className="CancelEditButton" variant="danger" key={"CancelButton"+i} onClick={e => setShowEditWorkoutFields(-1)}>
                                Cancel
                            </Button>
                        </>
                        : <>
                            { (measureType == "workoutTime") &&
                                <>
                                    <Card.Title key={"WorkoutCardTitle"+i}> Workout Time: </Card.Title>
                                    <Card.Text key={"WorkoutMeasure"+i}> {workoutMeasure + " seconds"} </Card.Text>
                                </>
                            }
                            { (measureType == "workoutReps") &&
                                <>
                                    <Card.Title key={"WorkoutCardTitle"+i}> Number of Reps: </Card.Title>
                                    <Card.Text key={"WorkoutMeasure"+i}> {workoutMeasure + " times"} </Card.Text>
                                </>
                            }
                        </>
                }
            </Card.Body>
        );
    }

    // Display all workouts in a set as Card
    function viewWorkouts(set) {
        let allWorkoutsArray = [];
        let workouts = allData[set];

        if(workouts.length == 0) {
            return <p className="NoWorkoutToDisplayText"> No workouts have been added to this set. </p>
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
                    {displayWorkoutName(set, workoutName, measureType, workoutMeasure, i)}
                    {displayWorkoutMeasure(set, measureType, workoutMeasure, i)}
                </Card>
            );
        }

        return allWorkoutsArray;
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
                    <Button onClick={e => confirmedDeleteWorkout(deletedWorkoutSetName, deletedWorkoutIndex)} variant="danger">Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }


    function onClickDeleteWorkoutButton(setName, workoutName, workoutMeasureType, workoutMeasure, index) {
        setShowDeleteWorkoutModal(true);
        setDeletedWorkoutName(workoutName);
        setDeletedWorkoutMeasureType(workoutMeasureType);
        setDeletedWorkoutMeasure(workoutMeasure);
        setDeletedWorkoutSetName(setName);
        setDeletedWorkoutIndex(index);
    }

    // Rerender page after finish deleting
    function rerenderAfterDeletingWorkout(set, index) {
        let updatedWorkouts = {...allData};
        updatedWorkouts[set].splice(index, 1);
        setAllData(updatedWorkouts);
    }

    // When deleting a workout is confirmed
    function confirmedDeleteWorkout(set, index) {
        setShowDeleteWorkoutModal(false);
        rerenderAfterDeletingWorkout(set, index);

        let request = {
            method: "post",
            headers: {
            "Content-Type":"application/json"
            },
            body: JSON.stringify({
            workoutSetName: set,
            workoutIndex: index,
            })
        };

        fetch('/delete_workout', request).then(response => console.log(response));
    }

    // "Edit workout" button is clicked
    function onClickEditWorkoutButton(set, type, name, measure, index) {
        setShowEditWorkoutFields(index);
        setUpdatedWorkoutName(name);
        setUpdatedWorkoutMeasure(measure);
        workoutMeasureFields(type); 
    }

    // Rerender page after finish editing
    function rerenderAfterEditingWorkout(set, index) {
        let updatedWorkouts = {...allData};
        let updatedWorkout = {};

        if(updatedWorkoutMeasureType == "workoutReps")
        updatedWorkout = {
            workoutName: updatedWorkoutName,
            workoutReps: updatedWorkoutMeasure
        }
        else if(updatedWorkoutMeasureType == "workoutTime")
        updatedWorkout = {
            workoutName: updatedWorkoutName,
            workoutTime: updatedWorkoutMeasure
        }

        updatedWorkouts[set].splice(index, 1); // delete original workout
        updatedWorkouts[set].splice(index, 0, updatedWorkout); // insert new workout

        setShowEditWorkoutFields(-1);
        setAllData(updatedWorkouts);
    }

    // Calls edit_workout API when user done editing
    function submitEditWorkout(set, index) {
        rerenderAfterEditingWorkout(set, index);
        
        let request = {};
        if(updatedWorkoutMeasureType == "workoutReps") {
            request = {
                method: "post",
                headers: {
                "Content-Type":"application/json"
                },
                body: JSON.stringify({
                workoutSetName: set,
                workoutIndex: index,
                workoutName: updatedWorkoutName,
                workoutReps: updatedWorkoutMeasure
                })
            };
        }
        else if(updatedWorkoutMeasureType == "workoutTime") {
            request = {
                method: "post",
                headers: {
                "Content-Type":"application/json"
                },
                body: JSON.stringify({
                workoutSetName: set,
                workoutIndex: index,
                workoutName: updatedWorkoutName,
                workoutTime: updatedWorkoutMeasure
                })
            };
        }
      
        console.log(request);
        fetch('/edit_workout', request).then(response => console.log(response));
    }

  return (
    <div className="ViewNotes">
        {displayDeleteWorkoutModal()}
        <form>
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
                            {includes(key, allSets) && viewWorkouts(key)}
                        </TabContent>
                    </Col>
                </Row>
            </TabContainer>
        </form>
    </div>
  );
}