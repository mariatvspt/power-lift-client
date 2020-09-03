import React from "react";
import { Button} from "react-bootstrap";
import { MDBIcon } from 'mdbreact';
import "./AddButton.css";

export default function AddButton({
    type,
    setShowNewFields
}) {
  return (
    <Button
        key="AddButton"
        className="AddButton"
        size="lg"
        block
        variant="light"
        onClick={setShowNewFields}>
        <MDBIcon key="AddButtonPlusIcon" icon="plus"/>
        { (type == "set") ? '\t Add New Set'
          : (type == "workout") ? '\t Add New Workout'
          : "Add New"
        }
    </Button>
  );
}