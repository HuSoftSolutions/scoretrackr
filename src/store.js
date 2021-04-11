import React, { createContext, useContext, useReducer } from "react";

const StoreContext = createContext();
const INITIAL_STATE = {
  allPlayers: null,
  activePlayers: [""],
  activeLayout: 18,
  activeScorecard: null,
};

const reducer = (state, action) => {

  switch (action.type) {
    case "fetch-all-players":
      console.log("[ALL_PLAYERS LOADED]", action);
      return {
        ...state,
        ...action.allPlayers,
      };

    case "update-active-players":
      console.log("[ACTIVE_PLAYER UPDATED]", action);
      return {
        ...state,
        activePlayers: action.activePlayers,
      };
    case "add-active-players":
      console.log("[ACTIVE_PLAYER ADDED]", action);
      return {
        ...state,
        activePlayers: [...state.activePlayers, action.newPlayer],
      };
    case "remove-active-players":
      console.log("[ACTIVE_PLAYER REMOVED]", action);
      return {
        ...state,
        activePlayers: action.activePlayers,
      };

    case "update-active-layout":
      console.log("[ACTIVE_LAYOUT UPDATED]", action);
      return {
        ...state,
        activeLayout: action.activeLayout,
      };
    case "update-active-scorecard":
      console.log("[ACTIVE_SCORECARD UPDATED]", action);
      return {
        ...state,
        activeScorecard: action.scorecard,
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
