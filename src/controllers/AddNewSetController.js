/*** ON CHANGE ***/
export function onChangeNewSetName(e, setNewWorkoutName, setDisableNewWorkoutDropdown) {
    setNewWorkoutName(e.target.value);
    
    if(e.target.value.length > 0) {
        setDisableNewWorkoutDropdown(false);
    }        
    else {
        setDisableNewWorkoutDropdown(true);
    }
}

export function onChangeNewWorkoutMeasure(e, setNewWorkoutMeasure, setDisableNewWorkoutDoneButton) {
    setNewWorkoutMeasure(e.target.value);

    if(e.target.value.length > 0) {
        setDisableNewWorkoutDoneButton(false);
    }
    else {
        setDisableNewWorkoutDoneButton(true);
    }
}

/*** ON CLICK ***/
export function onClickNewWorkoutDoneButton(allData, setName, workoutName, workoutMeasureType, workoutMeasure, setShowNewSetFields, setAllData) {
    setShowNewSetFields(false);
    rerenderAfterAddingNewWorkout(allData, setName, workoutName, workoutMeasureType, workoutMeasure, setAllData)

    let request = {};
    if(workoutMeasureType == "Number of Reps") {
        request = {
          method: "post",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            workoutSetName: setName,
            workoutName: workoutName,
            workoutReps: workoutMeasure
          })
        };
      }
      else if(workoutMeasureType == "Workout Time") {
        request = {
          method: "post",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            workoutSetName: setName,
            workoutName: workoutName,
            workoutTime: workoutMeasure
          })
        };
      }
  
      fetch('/new_workout', request).then(response => console.log(response));
}

/*** ON SELECT ***/
export function onSelectNewWorkoutDropdown(e, setNewWorkoutDropDownTitle, setDisableNewWorkoutMeasure, setNewWorkoutUnits) {
    setNewWorkoutDropDownTitle(e);
    setDisableNewWorkoutMeasure(false);

    if(e == "Number of Reps") {
        setNewWorkoutUnits("reps");
    }
    else if(e == "Workout Time") {
        setNewWorkoutUnits("seconds");
    }
}

/*** RERENDER ***/
function rerenderAfterAddingNewWorkout(allData, setName, workoutName, workoutMeasureType, workoutMeasure, setAllData) {
    let updatedData = {...allData};
    if(workoutMeasureType == "Number of Reps") {
        updatedData[setName].push({ workoutName: workoutName, workoutReps: workoutMeasure });
    }
    else if(workoutMeasureType == "Workout Time") {
        updatedData[setName].push({ workoutName: workoutName, workoutTime: workoutMeasure });
    }
    setAllData(updatedData);
}