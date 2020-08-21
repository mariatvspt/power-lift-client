/*** HELPER FUNCTIONS ***/

// Check if target element is in an array
export function includes(target, array) {
    for(var i=0; i<array.length; i++) {
        if(array[i] == target) {
            return true;
        }
    }
    return false;
}

 // Set state of the workout measure fields
export function onSelectWorkoutMeasureType(e, setUpdatedWorkoutMeasureType, setWorkoutMeasurePlaceholder, setUnits) {
    if(e == "workoutTime") {
        setUpdatedWorkoutMeasureType("Workout Time");
        setWorkoutMeasurePlaceholder("Edit workout time");
        setUnits("seconds");
    }
    else if(e == "workoutReps") {
        setUpdatedWorkoutMeasureType("Number of Reps");
        setWorkoutMeasurePlaceholder("Edit number of reps");
        setUnits("reps");
    }
}

/*** ON CHANGE ***/
export function onChangeEditWorkoutName(e, setUpdatedWorkoutName, setEmptyEditWorkoutNameError) {
    setUpdatedWorkoutName(e.target.value);

    if(e.target.value.length == 0) {
        setEmptyEditWorkoutNameError(true);
    }
    else {
        setEmptyEditWorkoutNameError(false);
    }
}

export function onChangeEditWorkoutMeasure(e, setUpdatedWorkoutMeasure, setEmptyEditWorkoutMeasureError) {
    setUpdatedWorkoutMeasure(e.target.value);

    if(e.target.value.length == 0) {
        setEmptyEditWorkoutMeasureError(true);
    }
    else {
        setEmptyEditWorkoutMeasureError(false);
    }
}

/*** ON CLICK ***/

// "Edit workout" button is clicked
export function onClickEditWorkoutButton(workoutMeasureType, workoutName, workoutMeasure, index, setShowEditWorkoutFields, setUpdatedWorkoutName, setUpdatedWorkoutMeasure, setWorkoutMeasurePlaceholder, setUnits, setUpdatedWorkoutMeasureType) {
    setShowEditWorkoutFields(index);
    setUpdatedWorkoutName(workoutName);
    setUpdatedWorkoutMeasure(workoutMeasure);
    onSelectWorkoutMeasureType(workoutMeasureType, setUpdatedWorkoutMeasureType, setWorkoutMeasurePlaceholder, setUnits); 
}

// "Delete workout" button is clicked
export function onClickDeleteWorkoutButton(workoutSetName, workoutName, workoutMeasureType, workoutMeasure, index, setShowDeleteWorkoutModal, setDeletedWorkoutSetName, setDeletedWorkoutName, setDeletedWorkoutMeasureType, setDeletedWorkoutMeasure, setDeletedWorkoutIndex) {
    setShowDeleteWorkoutModal(true);
    setDeletedWorkoutSetName(workoutSetName);
    setDeletedWorkoutName(workoutName);
    setDeletedWorkoutMeasureType(workoutMeasureType);
    setDeletedWorkoutMeasure(workoutMeasure);
    setDeletedWorkoutIndex(index);
}

/*** CANCEL ***/
export function cancelEditWorkout(setShowEditWorkoutFields, setEmptyEditWorkoutNameError, setEmptyEditWorkoutMeasureError) {
    setShowEditWorkoutFields(-1);
    setEmptyEditWorkoutNameError(false);
    setEmptyEditWorkoutMeasureError(false);
}

/*** CONFIRM ***/

// Calls edit_workout API when user done editing
export function confirmEditWorkout(allData, set, updatedWorkoutName, updatedWorkoutMeasureType, updatedWorkoutMeasure, index, setShowEditWorkoutFields, setAllData) {
    rerenderAfterEditingWorkout(allData, set, updatedWorkoutName, updatedWorkoutMeasureType, updatedWorkoutMeasure, index, setShowEditWorkoutFields, setAllData);
    
    let request = {};
    if(updatedWorkoutMeasureType == "Number of Reps") {
        request = {
            method: "post",
            headers: {
            "Content-Type":"application/json"
            },
            body: JSON.stringify({
            workoutSetName: set,
            workoutIndex: index,
            workoutName: updatedWorkoutName,
            workoutReps: updatedWorkoutMeasure
            })
        };
    }
    else if(updatedWorkoutMeasureType == "Workout Time") {
        request = {
            method: "post",
            headers: {
            "Content-Type":"application/json"
            },
            body: JSON.stringify({
            workoutSetName: set,
            workoutIndex: index,
            workoutName: updatedWorkoutName,
            workoutTime: updatedWorkoutMeasure
            })
        };
    }
  
    fetch('/edit_workout', request).then(response => console.log(response));
}

    // When deleting a workout is confirmed
    export function confirmDeleteWorkout(allData, set, index, setShowDeleteWorkoutModal, setAllData) {
        // Rerender page after finish deleting workout
        setShowDeleteWorkoutModal(false);
        let updatedWorkouts = {...allData};
        updatedWorkouts[set].splice(index, 1);
        setAllData(updatedWorkouts);

        // fetcn
        let request = {
            method: "post",
            headers: {
            "Content-Type":"application/json"
            },
            body: JSON.stringify({
            workoutSetName: set,
            workoutIndex: index,
            })
        };

        fetch('/delete_workout', request).then(response => console.log(response));
    }

/*** RERENDER ***/

// Rerender page after finish editing workout
function rerenderAfterEditingWorkout(allData, set, updatedWorkoutName, updatedWorkoutMeasureType, updatedWorkoutMeasure, index, setShowEditWorkoutFields, setAllData) {
    let updatedWorkouts = {...allData};
    let updatedWorkout = {};

    if(updatedWorkoutMeasureType == "Number of Reps")
    updatedWorkout = {
        workoutName: updatedWorkoutName,
        workoutReps: updatedWorkoutMeasure
    }
    else if(updatedWorkoutMeasureType == "Workout Time")
    updatedWorkout = {
        workoutName: updatedWorkoutName,
        workoutTime: updatedWorkoutMeasure
    }

    updatedWorkouts[set].splice(index, 1); // delete original workout
    updatedWorkouts[set].splice(index, 0, updatedWorkout); // insert new workout
    
    setShowEditWorkoutFields(-1);
    setAllData(updatedWorkouts);
}