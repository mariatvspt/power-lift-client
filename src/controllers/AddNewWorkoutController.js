/*** ON CHANGE ***/
export function onChangeNewWorkoutName(e, setNewWorkoutName, setEmptyNewWorkoutNameError) {
    setNewWorkoutName(e.target.value);
    
    if(e.target.value.length == 0) {
      setEmptyNewWorkoutNameError(true);
    }        
    else {
      setEmptyNewWorkoutNameError(false);
    }
}

export function onChangeNewWorkoutMeasure(e, setNewWorkoutMeasure, setEmptyNewWorkoutMeasureError) {
    setNewWorkoutMeasure(e.target.value);

    if(e.target.value.length == 0) {
      setEmptyNewWorkoutMeasureError(true);
    }
    else {
      setEmptyNewWorkoutMeasureError(false);
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
export function onSelectNewWorkoutDropdown(e, emptyNewWorkoutMeasureTypeError, setNewWorkoutMeasureType, setEmptyNewWorkoutMeasureTypeError, setNewWorkoutUnits, setNewWorkoutMeasurePlaceholder, setEmptyNewWorkoutMeasureError) {
    if(emptyNewWorkoutMeasureTypeError) {
      setEmptyNewWorkoutMeasureError(true);
      setEmptyNewWorkoutMeasureTypeError(false);
    }    

    if(e == "workoutTime") {
      setNewWorkoutMeasureType("Workout Time");
      setNewWorkoutMeasurePlaceholder("Enter workout time");
      setNewWorkoutUnits("seconds");
    }
    else if(e == "workoutReps") {
      setNewWorkoutMeasureType("Number of Reps");
      setNewWorkoutMeasurePlaceholder("Enter number of reps");
      setNewWorkoutUnits("reps")
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