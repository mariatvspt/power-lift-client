import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import ErrorTooltip from "../components/ErrorTooltip.js";

export default function WorkoutHeader({
    workoutName,
    index,
    type="display",
    // display workout header (events)
    onClickDeleteWorkoutButton,
    onClickEditWorkoutButton,
    // edit workout header (events)
    onChangeEditWorkoutName,
    // tooltip
    editSetNameOverlayTarget,
    emptyEditWorkoutNameError
}) {
  return (
    <Card.Header className="WorkoutHeader" key={"CardHeaderKey"+index}>
        { type == "display" && <>
            {workoutName}
            <Button
              className="ModifyWorkoutButton"
              variant="danger"
              key={"DeleteWorkoutButton"+index}
              onClick={onClickDeleteWorkoutButton}>
              Delete Workout
              <MDBIcon key={"DeleteWorkoutIcon"+index} icon="trash" className="ml-2"/>
            </Button>
            <Button
                className="ModifyWorkoutButton"
                variant="primary"
                key={"EditWorkoutButton"+index}
                onClick={onClickEditWorkoutButton}>
                Edit Workout
                <MDBIcon key={"EditWorkoutIcon"+index} icon="edit" className="ml-2"/>
            </Button>
          </>
        }
        { type == "edit" && <>
            <Form.Control
              ref={editSetNameOverlayTarget}
              placeholder="Edit Workout Name"
              defaultValue={workoutName}
              key={"EditWorkoutForm"+index}
              onChange={onChangeEditWorkoutName}/>
            <ErrorTooltip
              key={"WorkoutHeaderTooltip"+index}
              target={editSetNameOverlayTarget}
              show={emptyEditWorkoutNameError}
              placement="right"
              type="empty"/>
          </>
        }
    </Card.Header>
  );
}