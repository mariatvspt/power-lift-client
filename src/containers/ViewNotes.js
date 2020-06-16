import React, { useRef, useState, useEffect } from "react";
import { DropdownButton, Form, Button, Dropdown, Card, Nav, Col, Row, TabContainer, TabContent, NavItem, NavLink } from "react-bootstrap";
import { MDBBtn, MDBIcon } from 'mdbreact';
import LoaderButton from "../components/LoaderButton";
import { selectInput } from "aws-amplify";
import "./ViewNotes.css"

export default function ViewNotes() {
    const [allSets, setAllSets] = useState({});
    const [allData, setAllData] = useState({});
    const [key, setKey] = useState("");
    const [EditWorkoutField, setEditWorkoutField] = useState(-1);
    const [updatedWorkoutName, setUpdatedWorkoutName] = useState("");
    const [DropDownTitle, setDropDownTitle] = useState("");
    const [workoutMeasurePlaceholder, setWorkoutMeasurePlaceholder] = useState("");
    const [units, setUnits] = useState("");

    useEffect(() => {
        // fetch all sets with view_all API
        async function fetchSets() {
          const viewAllResponse = await fetch('/view_all');
          const allData = await viewAllResponse.json();
          setAllData(allData.workoutSets);
          setAllSets(Object.keys(allData.workoutSets));
        }
        fetchSets();
      }, []);

    // check if target element is in an array
    function includes(target, array) {
        for(var i=0; i<array.length; i++) {
            if(array[i] == target) {
                return true;
            }
        }
        return false;
    }

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
    }

    // display all sets as NavItem
    function viewSets() {
        let allSetsArray = [];

        for(var i = 0; i < allSets.length; i++) {
            allSetsArray.push(<NavItem key={"set"+i}>
                <NavLink onSelect={e => setKey(e)} key={"set"+i} eventKey={allSets[i]}>{allSets[i]}</NavLink>
            </NavItem>);
        }

        return allSetsArray;
    }

    // display all workouts in a set as Card
    function viewWorkouts(set) {
        let allWorkoutsArray = [];
        let workouts = Object.keys(allData[set]);

        if(workouts.length == 0) {
            return <p className="NoWorkoutToDisplayText"> No workouts have been added to this set. </p>
        }
        
        for(var i=0; i < workouts.length; i++) {
            const workoutName = workouts[i];
            const workoutMeasure = allData[set][workoutName];
            const measureType = Object.keys(workoutMeasure)[0];
            
            allWorkoutsArray.push(
                <Card className="WorkoutCard" key={"WorkoutCardKey"+i}>
                    <Card.Header className="WorkoutHeader" key={"CardHeaderKey"+i}>
                        {console.log(EditWorkoutField + " " + i)}
                        { EditWorkoutField == i
                            ? <>
                                <Form.Control placeholder="Edit Workout Name" defaultValue={workoutName} key={"EditWorkoutForm"+i} onChange={e => setUpdatedWorkoutName(e.target.value)}/>
                                </>
                            : <>
                            {workoutName}
                                <Button className="ModifyWorkoutButton" variant="danger" key={"DeleteButton"+i}> Delete Workout
                                    <MDBIcon icon="trash" className="ml-2"/>
                                </Button>
                                <Button className="ModifyWorkoutButton" variant="primary" key={"EditButton"+i} value={i} onClick={e => editWorkout(set, measureType, e.target.value)}>
                                    Edit Workout
                                    <MDBIcon icon="edit" className="ml-2"/>
                                </Button>
                            </>
                        }
                    </Card.Header>
                    <Card.Body key={"CardBodyKey"+i}>
                        { EditWorkoutField == i
                                ? <>
                                    <DropdownButton size="lg" variant="outline-dark" onSelect={e => workoutMeasureFields(e)} title={DropDownTitle} key = "">
                                        <Dropdown.Item
                                            eventKey="workoutTime">
                                                Workout Time
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="workoutReps">
                                                Number of Reps
                                        </Dropdown.Item>
                                    </DropdownButton>
                                    <Form.Control placeholder={workoutMeasurePlaceholder} defaultValue={workoutMeasure[measureType]} key="EditWorkoutMeasure"/>
                                    <p>{units}</p>
                                    <Button className="DoneEditButton" variant="secondary" key={"DoneButton"+i}>
                                        Done
                                    </Button>
                                    <Button className="CancelEditButton" variant="danger" key={"CancelButton"+i} onClick={e => setEditWorkoutField(-1)}>
                                        Cancel
                                    </Button>
                                </>
                                : <>
                                    { (measureType == "workoutTime") &&
                                        <>
                                            <Card.Title key={"WorkoutCardTitle"+i}> Workout Time: </Card.Title>
                                            <Card.Text key={"WorkoutMeasure"+i}> {workoutMeasure[measureType] + " seconds"} </Card.Text>
                                        </>
                                    }
                                    { (measureType == "workoutReps") &&
                                        <>
                                            <Card.Title key={"WorkoutCardTitle"+i}> Number of Reps: </Card.Title>
                                            <Card.Text key={"WorkoutMeasure"+i}> {workoutMeasure[measureType] + " times"} </Card.Text>
                                        </>
                                    }
                                </>
                        }
                    </Card.Body>
                </Card>
            );
        }

        return allWorkoutsArray;
    }

    function editWorkout(set, type, num) {
        setEditWorkoutField(num);
        workoutMeasureFields(type);

        let request = {
            method: "post",
            headers: {
              "Content-Type":"application/json"
            },
            body: JSON.stringify({
              workoutSetName: set,
              workoutNumber: num,
              workoutName: updatedWorkoutName
            })
        };
      
        console.log(request);
        // fetch
    }

  return (
    <div className="ViewNotes">
        <form>
            <TabContainer activeKey={key}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            {viewSets()}
                            <Dropdown.Divider />
                            <NavLink onSelect={e => setKey(e)} eventKey="AllWorkouts">View All</NavLink>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <TabContent>
                            { includes(key, allSets) && viewWorkouts(key) }
                        </TabContent>
                    </Col>
                </Row>
            </TabContainer>
        </form>
    </div>
  );
}