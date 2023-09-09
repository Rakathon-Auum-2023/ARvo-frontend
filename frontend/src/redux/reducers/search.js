const initialState = "";

const updateSearch = (state = initialState, action) => {
    switch(action.type){
        case "SEARCH" : return state;
        default: return state;
    }
}

export default updateSearch;