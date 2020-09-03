import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./ConfirmDeleteModal.css";

export default function ConfirmDeleteModal({
    type,
    showModal,
    hideModal,
    modalTitle,
    // set
    deletedSetLength,
    // workout
    deletedWorkoutMeasureType,
    deletedWorkoutMeasure,
    // events
    cancelDelete,
    confirmDelete
}) {
  return (
    <Modal
        show={showModal}
        onHide={hideModal}
        style={{opacity:1}}>
        <Modal.Header closeButton>
            <Modal.Title>
                Are you sure you want to delete this {type}?
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="ModalTitle">
                {modalTitle}
            </p>
            { type == "set" &&
                <p className="SetLengthInModal">
                    Total workouts: {deletedSetLength}
                </p>
            }
            { type == "workout" &&
                <>
                    {deletedWorkoutMeasureType == "workoutReps" && 
                    <>
                        <p className="WorkoutTypeInModal">Number of Reps:</p>
                        <p className="WorkoutMeasureInModal">{deletedWorkoutMeasure} reps</p>
                    </>
                    }   
                    {deletedWorkoutMeasureType == "workoutTime" &&
                        <>
                            <p className="WorkoutTypeInModal">Workout Time:</p>
                            <p className="WorkoutMeasureInModal">{deletedWorkoutMeasure} seconds</p>
                        </>
                    }
                </>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={cancelDelete} variant="secondary">
                Cancel
            </Button>
            <Button onClick={confirmDelete} variant="danger">
                Delete
            </Button>
        </Modal.Footer>
    </Modal>
  );
}