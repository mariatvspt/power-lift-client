import React from "react";
import { Button, Form, NavLink } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import ErrorTooltip from "../components/ErrorTooltip.js";

export default function SetTab({
    workoutSetName,
    index,
    type = "display",
    // display (events)
    onSelectWorkoutSetTab,
    onClickDeleteSetButton,
    onClickEditSetButton,
    // edit (events)
    onChangeEditWorkoutSetName,
    confirmEditWorkoutSet,
    setShowEditSetFields,
    // tooltip
    setNameOverlayTarget,
    emptySetNameError,
    duplicateSetNameError
}) {
  return (
    <>
        { type == "display" &&
            <NavLink
                className="SetTab"
                onSelect={onSelectWorkoutSetTab}
                key={"set"+index}
                id={index}
                eventKey={index}>
                {workoutSetName}   
                <Button
                    className="ModifySetButton"
                    variant="outline-dark"
                    key={"DeleteSetButton"+index}
                    onClick={onClickDeleteSetButton}>
                    <MDBIcon key={"DeleteSetIcon"+index} icon="trash"/>
                </Button>
                <Button
                    className="ModifySetButton"
                    variant="outline-dark"
                    key={"EditSetButton"+index}
                    onClick={onClickEditSetButton}>
                    <MDBIcon key={"EditSetIcon"+index} icon="edit"/>
                </Button>
            </NavLink>
        }
        {
            type == "edit" &&
            <Form key={"SetForm"+index} className="form-inline EditSetForm">
                <Form.Control
                    ref={setNameOverlayTarget}
                    className="EditSetFormControl"
                    placeholder="Edit Set Name"
                    defaultValue={workoutSetName}
                    key={"SetFormControl"+index}
                    onChange={onChangeEditWorkoutSetName}/>
                <ErrorTooltip
                    key={"EmptySetNameTooltip"+index}
                    target={setNameOverlayTarget.current}
                    show={emptySetNameError}
                    placement="left"
                    type="empty"/>
                <ErrorTooltip
                    key={"DuplicateSetNameTooltip"+index}
                    target={setNameOverlayTarget.current}
                    show={duplicateSetNameError}
                    placement="left"
                    type="duplicate"/>
                <Button
                    disabled={emptySetNameError || duplicateSetNameError}
                    className="EditSetButtons"
                    variant="info"
                    key={"ConfirmEditSetButton"+index}
                    onClick={confirmEditWorkoutSet}>
                    <MDBIcon key={"ConfirmEditSetIcon"+index} icon="check"/>
                </Button>
                <Button
                    className="EditSetButtons"
                    variant="danger"
                    key={"CancelEditSetButton"+index}
                    onClick={setShowEditSetFields}>
                    <MDBIcon key={"CancelEditSetIcon"+index} icon="times"/>
                </Button>
            </Form>
        }
    </>
  );
}