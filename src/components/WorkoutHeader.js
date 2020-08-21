import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import ErrorTooltip from "../components/ErrorTooltip.js";
import "./WorkoutHeader.css";

export default function WorkoutHeader({
    workoutName,
    index,
    type="display",
    // display workout header (events)
    onClickDeleteWorkoutButton,
    onClickEditWorkoutButton,
    // edit workout header (events)
    onChangeWorkoutName,
    // tooltip
    workoutNameOverlayTarget,
    emptyWorkoutNameError
}) {
  return (
    <Card.Header className="WorkoutHeader" key={"CardHeaderKey"+index}>
        { type == "display" &&
          <>
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
        { (type == "edit" || type == "new") &&
          <>
            <Form.Control
              ref={workoutNameOverlayTarget}
              placeholder={type == "edit" ? "Edit Workout Name" : "Enter Workout Name"}
              defaultValue={workoutName}
              key={"EditWorkoutForm"+index}
              onChange={onChangeWorkoutName}/>
            <ErrorTooltip
              key={"WorkoutHeaderTooltip"+index}
              target={workoutNameOverlayTarget}
              show={emptyWorkoutNameError}
              placement="right"
              type="empty"/>
          </>
        }
    </Card.Header>
  );
}