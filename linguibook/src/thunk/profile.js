import { updateUserData } from "../actions";
import { axiosWithAuthToken as authAxios } from "../utils/interceptors";

export const updateProfile = (profileUrl, bio, userId) => {
  return async (dispatch) => {
    let payload = {
      profile: profileUrl,
      bio: bio,
      userId: userId,
    };
    try {
      const result = await authAxios.post("/api/profile/update", payload);
      if (result?.data?.ok) {
        await dispatch(updateUserData({ profileUrl, bio }));
      }
    } catch (err) {
      // handle error message
    } finally {
      //   await dispatch(setLoader({ isAiMsgLoading: false }));
    }
  };
};