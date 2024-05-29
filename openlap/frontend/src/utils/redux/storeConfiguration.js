import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./sagas/rootSaga";
import rootReducer from "./reducers/reducer";
import iscReducer from "./reducers/iscReducer";
import editorReducer from "./reducers/editor";
import csvxapiReducer from "./reducers/csvxapiReducer";
import indicatorEditorReducer from "./reducers/indicatorEditor";
import compositeEditorReducer from "./reducers/compositeEditor";
import gqiEditorReducer from "./reducers/gqiEditor";
import multiLevelEditorReducer from "./reducers/multiLevelEditor";
import errorMessagesReducer from "./reducers/errorMessages";

const reducer = combineReducers({
  rootReducer,
  editorReducer,
  iscReducer,
  csvxapiReducer,
  indicatorEditorReducer,
  gqiEditorReducer,
  compositeEditorReducer,
  multiLevelEditorReducer,
  errorMessagesReducer
});

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

sagaMiddleware.run(watcherSaga);

export default store;
