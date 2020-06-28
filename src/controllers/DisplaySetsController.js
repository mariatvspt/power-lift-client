/*** HELPER FUNCTIONS ***/

// check there is a duplicate in an array at a given index
function checkDuplicates(target, array, index) {
    for(var i=0; i<array.length; i++) {
        console.log(array[i], target);
        if(i != index && array[i] == target) {
            return true;
        }
    }
    return false;
}

/*** ON CHANGE ***/

// When user is editing the workout set name
export function onChangeEditWorkoutSetName(e, allSets, index, setUpdatedWorkoutSetName, setEmptySetNameError, setDuplicateSetNameError) {
    setUpdatedWorkoutSetName(e.target.value);

    // cannot change to an empty set name
    if(e.target.value == "") {
        setEmptySetNameError(true);
    }
    else {
        setEmptySetNameError(false);
    }

    // cannot change to an existing set name
    if(checkDuplicates(e.target.value, allSets, index)) {
        setDuplicateSetNameError(true);
    }
    else {
        setDuplicateSetNameError(false);
    }
}

/*** ON CLICK ***/

// Edit set icon is clicked
export function onClickEditSetButton(workoutSetName, i, setShowEditSetFields, setUpdatedWorkoutSetName) {
    setShowEditSetFields(i);
    setUpdatedWorkoutSetName(workoutSetName);
}

// Delete set icon is clicked
export function onClickDeleteSetButton(allData, workoutSetName, setShowDeleteSetModal, setDeletedSet, setDeletedSetLength) {
    setShowDeleteSetModal(true);
    setDeletedSet(workoutSetName);
    setDeletedSetLength(allData[workoutSetName].length);
}

/*** ON SELECT ***/

// When user select a workout set tab
export function onSelectWorkoutSetTab(e, allSets, showEditSetFields, setKey, setShowEditSetFields) {
    setKey(allSets[e]);

    // reset classname for enabling/disabling hover for the icons
    const elements = document.getElementsByClassName("SetTab");
    for (let element of elements) {
        element.className = element.className.split(' ').filter(word => word !== "SelectedTab").join(' ');
    }
    document.getElementById(e).className += " SelectedTab";

    // if user select another set while editing another set, the edit is cancelled
    if(showEditSetFields!= -1 && e!=showEditSetFields) {
        setShowEditSetFields(-1);
    }
}

/*** CONFIRM ***/

// When user clicks the "check" icon to submit set name edit
export function confirmEditWorkoutSet(allData, allSets, updatedWorkoutSetName, index, setShowEditSetFields, setAllSets, setAllData, setKey) {
    let workoutSetName = allSets[index];
    setShowEditSetFields(-1);
    if(workoutSetName != updatedWorkoutSetName) {
        rerenderAfterEditingSetName(allData, allSets, workoutSetName, updatedWorkoutSetName, index, setAllSets, setAllData, setKey);
    }
    
    let request = {
        method: "post",
        headers: {
        "Content-Type":"application/json"
        },
        body: JSON.stringify({
        originalWorkoutSetName: workoutSetName,
        updatedWorkoutSetName: updatedWorkoutSetName
        })
    };

    fetch('/edit_set', request).then(response => console.log(response));
}

// When user confirms to delete a set
export function confirmDeleteWorkoutSet(allData, deletedSet, setShowDeleteSetModal, setAllData, setAllSets) {
    setShowDeleteSetModal(false);
    rerenderAfterDeletingSetName(allData, deletedSet, setAllData, setAllSets)

    let request = {
        method: "post",
        headers: {
        "Content-Type":"application/json"
        },
        body: JSON.stringify({
        deletedWorkoutSetName: deletedSet
        })
    };

    fetch('/delete_set', request).then(response => console.log(response));
}

/*** RERENDER ***/

// Rerender page after finish editing set name
function rerenderAfterEditingSetName(allData, allSets, workoutSetName, updatedWorkoutSetName, index, setAllSets, setAllData, setKey) {
    let updatedSets = [...allSets];
    updatedSets[index] = updatedWorkoutSetName;
    setAllSets(updatedSets);

    // rename key
    let updatedData = {...allData};
    updatedData[updatedWorkoutSetName] = updatedData[workoutSetName];
    delete updatedData[workoutSetName];
    console.log(updatedData);
    setAllData(updatedData);
    setKey(updatedWorkoutSetName); // remove i think
}

// Rerender page after finish deleting set name
function rerenderAfterDeletingSetName(allData, deletedSet, setAllData, setAllSets) {
    let updatedData = {...allData}
    delete updatedData[deletedSet];
    setAllData(updatedData);
    setAllSets(Object.keys(updatedData));
}