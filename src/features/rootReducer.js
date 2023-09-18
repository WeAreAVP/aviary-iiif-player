import { combineReducers } from 'redux';
import itemReducer from './items';


const rootReducer = combineReducers({
	selectedItem: itemReducer
})

export default rootReducer;
