import { combineReducers } from 'redux'
import localStorage from './localStorage'
import vocabulariesStorage from './vocabulary'
import communityStorage from './community'

export default combineReducers({
    localStorage,
    vocabulariesStorage,
    communityStorage
})