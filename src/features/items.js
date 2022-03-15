// type
export const SET_ITEM = 'SET_ITEM';

// action
export const setItem = (item) => {
	return {
		type: SET_ITEM,
        item
	}
}

// reducer
const selectedVideo = [];

const itemReducer = (state = selectedVideo, action) => {
	switch(action.type){
		case SET_ITEM: return action.item
		default: return state
	}
}

export default itemReducer