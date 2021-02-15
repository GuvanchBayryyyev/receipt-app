import {createStore, combineReducers} from 'redux';
import appReducer from './reducers';

const rootReducer = combineReducers({
  user: appReducer,
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
