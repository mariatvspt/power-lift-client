import React from "react";
import { Button, Card, Dropdown, DropdownButton, Form } from "react-bootstrap";
import ErrorTooltip from "../components/ErrorTooltip.js";

export default function WorkoutBody({
    workoutMeasure,
    index,
    type = "display",
    // display workout body
    measureType,
    // edit workout body
    emptyEditWorkoutNameError,
    emptyEditWorkoutMeasureError,
    editWorkoutDropDownTitle,
    editWorkoutUnits,
    workoutMeasurePlaceholder,
    // tooltip
    editSetMeasureOverlayTarget,
    // events
    onChangeEditWorkoutMeasure,
    workoutMeasureFields,
    confirmEditWorkout,
    cancelEditWorkout

}) {
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
            type == "edit" && <>
                <DropdownButton
                    disabled={emptyEditWorkoutNameError}
                    size="lg"
                    variant="outline-dark"
                    onSelect={workoutMeasureFields}
                    title={editWorkoutDropDownTitle}
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
                    ref={editSetMeasureOverlayTarget}
                    disabled={emptyEditWorkoutNameError}
                    placeholder={workoutMeasurePlaceholder}
                    defaultValue={workoutMeasure}
                    key={"EditWorkoutMeasure"+index}
                    onChange={onChangeEditWorkoutMeasure}/>
                <ErrorTooltip
                    target={editSetMeasureOverlayTarget.current}
                    show={emptyEditWorkoutMeasureError}
                    placement="right"
                    type="empty"
                    key={"WorkoutBodyTooltip"+index}/>
                <p>{editWorkoutUnits}</p>
                <Button
                    disabled={emptyEditWorkoutNameError || emptyEditWorkoutMeasureError}
                    className="DoneEditWorkoutButton"
                    variant="secondary"
                    key={"DoneWorkoutButton"+index}
                    value={index}
                    onClick={confirmEditWorkout}>
                    Done
                </Button>
                <Button
                    className="CancelEditWorkoutButton"
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