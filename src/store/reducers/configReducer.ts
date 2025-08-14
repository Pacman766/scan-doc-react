import { ConfigActions, ConfigActionsType, ConfigState, initialState } from "../../types/config"

export const configReducer = (state = initialState, action: ConfigActionsType): ConfigState => {
    switch (action.type){
        case ConfigActions.GET_CONFIG:
            return {config: action.payload, error: null}
        case ConfigActions.GET_CONFIG_ERROR:
            return {config: null, error: action.payload}
        case ConfigActions.SAVE_CONFIG:
            return  {config: state.config, error: null}
        case ConfigActions.SAVE_CONFIG_ERROR:
            return  {config: null, error: action.payload}
        default:
            return state;
    }
}