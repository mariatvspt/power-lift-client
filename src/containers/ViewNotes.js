import React, { useRef, useState, useEffect } from "react";
import { Button, Dropdown, Card, Nav, Col, Row, Tab, TabContainer, TabContent, TabPane, NavItem, NavLink } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { selectInput } from "aws-amplify";
import "./ViewNotes.css"

export default function ViewNotes() {
    const [allSets, setAllSets] = useState({});
    const [allData, setAllData] = useState({});
    const [key, setKey] = useState("");

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
        console.log(workouts);

        if(workouts.length == 0) {
            return <p> No workouts have been added to this set. </p>
        }
        
        for(var i=0; i < workouts.length; i++) {
            const workoutName = workouts[i];
            const workoutMeasure = allData[set][workoutName];
            const measureType = Object.keys(workoutMeasure)[0];
            
            allWorkoutsArray.push(
                <Card className="Card" key={"CardKey"+i}>
                    <Card.Header className="CardHeader" key={"CardHeaderKey"+i}>
                        {workoutName}
                        <Button className="Button" variant="danger" size="sm">
                            Delete
                        </Button>
                        <Button className="Button" size="sm">
                            Edit
                        </Button>
                    </Card.Header>
                    <Card.Body key={"CardBodyKey"+i}>
                        { (measureType == "workoutTime") &&
                            <>
                                <Card.Title key={"CardTitle"+i}> Workout Time: </Card.Title>
                                <Card.Text key={"CardText"+i}> {workoutMeasure[measureType] + " seconds"} </Card.Text>
                            </>
                        }
                        { (measureType == "workoutReps") &&
                            <>
                                <Card.Title key={"CardTitle"+i}> Number of Reps: </Card.Title>
                                <Card.Text key={"CardText"+i}> {workoutMeasure[measureType] + " times"} </Card.Text>
                            </>
                        }
                    </Card.Body>
                </Card>
            );
        }

        return allWorkoutsArray;
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