import { axiosInstance as axios } from '../utils/interceptors';
import { updateAppLoad, updateContextData, updateUserAuth, updateUserData, updateVocabularies } from '../actions';
import { setAccessToken } from '../utils/token';
import { getContextDetials, getVocDetials } from './ctxtVoc';
import { getCommunities } from './community';

export const fetchRefreshToken = async () => {
    const response = await axios.post(`/api/auth/refresh`, {}, { withCredentials: true });
    const { accessToken, user } = response.data.data;
    setAccessToken(accessToken);
    return { user, token: accessToken }
}  

/** @Note remove when its no longer needed */
export function wait(duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Resolve the Promise after the specified duration
      }, duration);
    });
  }

// thunk action creator
export const checkUserAuth = () => {
    return async (dispatch, getState) => {
        try {
            await dispatch(updateUserAuth({ isLogged: false, isLoading: true }));
            await wait(500);
            const { user } = await fetchRefreshToken();
            const { activeContextId, contextData } = await getContextDetials();
            const { vocabularies } = await getVocDetials({ contextId: activeContextId });
            await dispatch(getCommunities());

            await dispatch(updateContextData({ id: activeContextId, data: contextData }));
            await dispatch(updateVocabularies({ vocabularies }));

            await dispatch(updateUserData(user));
            await dispatch(updateUserAuth({ isLogged: true, isLoading: false }));
            return true;
        } catch (error) {
            console.log(error, "error");
            await dispatch(updateUserAuth({ isLogged: false, isLoading: false }));
            return false;
        } finally {
            await dispatch(updateAppLoad({ isLoading: false, loadPercent: 0 }));
        }
    };
};

export const handleLogin = (userName, password) => {
    return async (dispatch, getState) => {
        try {
            await dispatch(updateUserAuth({ isLogged: false, isLoading: true }));
            const response = await axios.post(`/api/auth/login`, { userName, password });
            const { accessToken, user } = response.data.data;
            setAccessToken(accessToken);
            const { activeContextId, contextData } = await getContextDetials();
            const { vocabularies } = await getVocDetials({ contextId: activeContextId });
            await dispatch(getCommunities());

            await dispatch(updateContextData({ id: activeContextId, data: contextData }));
            await dispatch(updateVocabularies({ vocabularies }));
            await dispatch(updateUserData(user));
            await dispatch(updateUserAuth({ isLogged: true, isLoading: false }));
            return true;
        } catch (error) {
            await dispatch(updateUserAuth({ isLogged: false, isLoading: false }));
            return false;
        } finally {
        }
    };
};

export const handleSignUp = (userName, password) => {
    return async (dispatch, getState) => {
        try {
            await dispatch(updateUserAuth({ isLogged: false, isLoading: true }));
            const response = await axios.post(`/api/auth/signup`, {
                userName, password
            });
            // Process response if needed
            return true;
        } catch (error) {
            return false;
        } finally {
            await dispatch(updateUserAuth({ isLogged: false, isLoading: false }));
        }
    };
};

export const handleLogOut = () => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`/api/auth/logout`);
            await dispatch(updateUserAuth({ isLogged: false, isLoading: false }));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
};
