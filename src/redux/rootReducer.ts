import { combineReducers } from 'redux';
import authReducer from './auth/authSlice';
import authBookingReducer from './auth/authbookingsSlice';
import  authUserReducer from './auth/authusersslice'

const rootReducer = combineReducers({
  auth: authReducer,
  authBooking: authBookingReducer,
  authUser: authUserReducer, 
 
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
