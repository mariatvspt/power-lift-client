/*** HELPER FUNCTIONS ***/

function checkDuplicates(target, array) {
    for(var i=0; i<array.length; i++) {
        if(array[i] == target) {
            return true;
        }
    }
    return false;
}

/*** ON CHANGE ***/
export function onChangeNewSetName(e, allSets, setNewSetName, setEmptyNewSetNameError, setDuplicateNewSetNameError) {
    setNewSetName(e.target.value);

    if(e.target.value == "") {
        setEmptyNewSetNameError(true);
    }
    else {
        setEmptyNewSetNameError(false);
    }

    if(checkDuplicates(e.target.value, allSets)) {
        setDuplicateNewSetNameError(true);
    }
    else {
        setDuplicateNewSetNameError(false);
    }
}

/*** ON CLICK ***/
export function onClickNewSetDoneButton(allData, allSets, newSetName, setShowNewSetFields, setAllSets, setAllData) {
    setShowNewSetFields(false);
    rerenderAfterAddingNewSet(allData, allSets, newSetName, setAllSets, setAllData);

    let request = {
        method: "post",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          workoutSetName: newSetName
        })
      };
  
    fetch('/new_set', request).then(response => console.log(response));
}

/*** RERENDER ***/
function rerenderAfterAddingNewSet(allData, allSets, newSetName, setAllSets, setAllData) {
    let updatedSets = [...allSets];
    updatedSets.push(newSetName);
    setAllSets(updatedSets);

    let updatedData = {...allData};
    updatedData[newSetName] = [];
    setAllData(updatedData);
}