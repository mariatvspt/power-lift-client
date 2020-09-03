import React, { useRef } from "react";
import { Button, Form, NavLink } from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import TooltipInfo from "../components/TooltipInfo.js";
import "./SetTab.css"

export default function SetTab({
    workoutSetName,
    index,
    type = "display",
    // display (events)
    onSelectWorkoutSetTab,
    onClickDeleteSetButton,
    onClickEditSetButton,
    // edit (events)
    onChangeSetName,
    confirmWorkoutSet,
    cancelWorkoutSet,
    // tooltip
    emptySetNameError,
    duplicateSetNameError
}) {
    const setNameOverlayTarget = useRef(null);
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
                (type == "edit" || type =="new") &&
                <Form key={"SetForm"+index} className="form-inline SetForm">
                    <Form.Control
                        ref={setNameOverlayTarget}
                        className="EditSetFormControl"
                        placeholder= {type == "edit" ? "Edit Set Name" : "New Set Name"}
                        defaultValue={workoutSetName}
                        key={"SetFormControl"+index}
                        onChange={onChangeSetName}/>
                    <TooltipInfo
                        key={"EmptySetNameTooltip"+index}
                        target={setNameOverlayTarget}
                        show={emptySetNameError}
                        placement="left"
                        type="empty"/>
                    <TooltipInfo
                        key={"DuplicateSetNameTooltip"+index}
                        target={setNameOverlayTarget}
                        show={duplicateSetNameError}
                        placement="left"
                        type="duplicate"/>
                    <Button
                        disabled={emptySetNameError || duplicateSetNameError}
                        className="EditSetButtons"
                        variant="info"
                        key={"ConfirmEditSetButton"+index}
                        onClick={confirmWorkoutSet}>
                        <MDBIcon key={"ConfirmEditSetIcon"+index} icon="check"/>
                    </Button>
                    <Button
                        className="EditSetButtons"
                        variant="danger"
                        key={"CancelEditSetButton"+index}
                        onClick={cancelWorkoutSet}>
                        <MDBIcon key={"CancelEditSetIcon"+index} icon="times"/>
                    </Button>
                </Form>
            }
        </>
    );
}