import { configureStore } from '@reduxjs/toolkit';
import vumarkReducer from '../features/vumarkSlice';

const store = configureStore({
  reducer: {
    vumark: vumarkReducer,
  },
});

export default store;


