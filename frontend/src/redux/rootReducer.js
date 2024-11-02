import { combineReducers } from 'redux';
import { reducer as authReducer } from './auth';
import { reducer as crudReducer } from './crud';
import { reducer as erpReducer } from './erp';

const rootReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  erp: erpReducer,
});

export default rootReducer;
