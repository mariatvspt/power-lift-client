import React, { useRef } from "react";
import { Button, Card, Dropdown, DropdownButton, Form } from "react-bootstrap";
import TooltipInfo from "../components/TooltipInfo.js";
import "./WorkoutBody.css";

export default function WorkoutBody({
    workoutMeasure,
    index,
    type = "display",
    // display workout body
    measureType,
    // edit workout body
    emptyWorkoutNameError,
    emptyWorkoutMeasureError,
    workoutDropDownTitle,
    workoutUnits,
    workoutMeasurePlaceholder,
    // new workout body
    emptyWorkoutMeasureTypeError,
    // events
    onSelectWorkoutMeasureType,
    onChangeEditWorkoutMeasure,
    confirmEditWorkout,
    cancelEditWorkout

}) {
    const workoutMeasureOverlayTarget = useRef(null);

    return (
        <Card.Body key={"CardBodyKey"+index}>
            { type == "display" && <>
                { measureType == "workoutTime" &&
                    <>
                        <Card.Title key={"WorkoutCardTitle"+index}> Workout Time: </Card.Title>
                        <Card.Text key={"WorkoutMeasure"+index}> {workoutMeasure + " seconds"} </Card.Text>
                    </>
                }
                { measureType == "workoutReps" &&
                    <>
                        <Card.Title key={"WorkoutCardTitle"+index}> Number of Reps: </Card.Title>
                        <Card.Text key={"WorkoutMeasure"+index}> {workoutMeasure + " reps"} </Card.Text>
                    </>
                }
                </>
            }
            {
                (type == "edit" || type == "new") && <>
                    <DropdownButton
                        disabled={emptyWorkoutNameError}
                        size="lg"
                        variant="outline-dark"
                        onSelect={onSelectWorkoutMeasureType}
                        title={workoutDropDownTitle}
                        key={"WorkoutMeasureTypeDropdown"+index}>
                        <Dropdown.Item
                            key={"WorkoutTimeDropdownItem"+index}
                            eventKey="workoutTime">
                                Workout Time
                        </Dropdown.Item>
                        <Dropdown.Item
                            key={"WorkoutRepsDropdownItem"+index}
                            eventKey="workoutReps">
                                Number of Reps
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        ref={workoutMeasureOverlayTarget}
                        disabled={emptyWorkoutNameError || emptyWorkoutMeasureTypeError}
                        placeholder={workoutMeasurePlaceholder}
                        defaultValue={workoutMeasure}
                        key={"EditWorkoutMeasure"+index}
                        onChange={onChangeEditWorkoutMeasure}/>
                    <TooltipInfo
                        target={workoutMeasureOverlayTarget}
                        show={emptyWorkoutMeasureError}
                        placement="right"
                        type="empty"
                        key={"WorkoutBodyTooltip"+index}/>
                    <p>{workoutUnits}</p>
                    <Button
                        disabled={emptyWorkoutNameError || emptyWorkoutMeasureTypeError || emptyWorkoutMeasureError}
                        className="DoneWorkoutButton"
                        variant="secondary"
                        key={"DoneWorkoutButton"+index}
                        value={index}
                        onClick={confirmEditWorkout}>
                        Done
                    </Button>
                    <Button
                        className="CancelWorkoutButton"
                        variant="danger"
                        key={"CancelWorkoutButton"+index}
                        onClick={cancelEditWorkout}>
                        Cancel
                    </Button>
                </>
            }
        </Card.Body>
    );
}