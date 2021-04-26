import React, { createContext, useContext, useReducer } from "react";

const StoreContext = createContext();
const INITIAL_STATE = {
  allPlayers: null,
  activeLayout: 18,
  activeScorecard: [],
  roundStarted: false,
  createNewScorecard: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "fetch-all-players":
      console.log("[ALL_PLAYERS LOADED]", action);
      return {
        ...state,
        ...action.allPlayers,
      };
    case "update-active-layout":
      console.log("[ACTIVE_LAYOUT UPDATED]", action, state);
      return {
        ...state,
        activeLayout: action.activeLayout,
      };
    case "update-active-scorecard":
      console.log("[ACTIVE_SCORECARD UPDATED]", action, state);
      return {
        ...state,
        activeScorecard: action.scorecard,
      };
    case "start-round":
      console.log("[ROUND_STARTED]", action, state);
      return {
        ...state,
        roundStarted: action.roundStarted,
      };
    case "create-new-scorecard":
      console.log("[CREATE_NEW_SCORECARD]", action, state);
      return {
        ...state,
        createNewScorecard: action.createNewScorecard,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
