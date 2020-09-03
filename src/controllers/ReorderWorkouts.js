function rerenderAfterReorderWorkout(startIndex, endIndex, allData, set, setAllData) {
  let updatedAllData = {...allData};
  const workoutList = [...allData[set]];
  const [removed] = workoutList.splice(startIndex, 1);
  workoutList.splice(endIndex, 0, removed);
  updatedAllData[set] = workoutList;

  setAllData(updatedAllData);
}

export function onDragEnd(result, set, allData, setAllData) {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    rerenderAfterReorderWorkout(startIndex, endIndex, allData, set, setAllData);

    // fetch
    let request = {
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            workoutSetName: set,
            startIndex: startIndex,
            endIndex: endIndex
        })
    };

    fetch('/reorder_workout', request).then(response => console.log(response));
}