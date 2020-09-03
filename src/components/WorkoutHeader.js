import React, { useRef } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import TooltipInfo from "../components/TooltipInfo.js";
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
    emptyWorkoutNameError
}) {
  const workoutNameOverlayTarget = useRef(null);

  return (
    <Card.Header className="WorkoutHeader" key={"CardHeaderKey"+index}>
        { type == "display" &&
          <>
            {workoutName}
            <TooltipInfo
              key={"ReorderWorkoutTooltip"+index}
              type="hover"
              placement="right"
              text="Click anywhere in this card to reorder the workout in this set."
              hoverButton={
                // <Button
                //   className="ModifyWorkoutButton"
                //   variant="light"
                //   key={"hoverButton"+index}>
                    <MDBIcon className="ReorderWorkoutIcon" key={"ReorderWorkoutIcon"+index} icon="bars"/>
              }/>
                  {/* </Button>}/> */}
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
            <TooltipInfo
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