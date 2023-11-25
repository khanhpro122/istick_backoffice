import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter';
import authReducer from './features/auth';
import userReducer from './features/user';
import eventReducer from './features/event';
import researchReducer from './features/research';
import packageReducer from './features/package';
import jobReducer from './features/job';
import companyReducer from './features/company';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    user: userReducer,
    event: eventReducer,
    research: researchReducer,
    package: packageReducer,
    job: jobReducer,
    company: companyReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
