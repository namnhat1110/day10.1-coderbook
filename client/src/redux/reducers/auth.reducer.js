import * as types from "../constants/auth.constants";

const isAuthenticated = !!localStorage.getItem("accessToken");
const facebookUser = JSON.parse(localStorage.getItem('facebookUser'));
const initialState = {
  loading: false,
  isAuthenticated,
  accessToken: localStorage.getItem("accessToken"),
  user: {
    name: facebookUser ? facebookUser.name : "",
    email: facebookUser ? facebookUser.email : "",
  },
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.LOGIN_REQUEST:
    case types.REGISTER_REQUEST:
    case types.VERIFY_EMAIL_REQUEST:
    case types.UPDATE_PROFILE_REQUEST:
    case types.GET_CURRENT_USER_REQUEST:
      return { ...state, loading: true };

    case types.LOGIN_FACEBOOK_REQUEST:
      return { ...state, loading: true };

    case types.REGISTER_SUCCESS:
      localStorage.setItem("accessToken", payload.accessToken)
      localStorage.setItem('facebookUser', JSON.stringify(payload.user));
      return {
        ...state,
        loading: false,
        isAuthenticated: true
      };

    case types.LOGIN_SUCCESS:
    case types.LOGIN_GOOGLE_SUCCESS:
    case types.VERIFY_EMAIL_SUCCESS:
    case types.LOGIN_FACEBOOK_SUCCESS:
      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem('facebookUser', JSON.stringify(payload.user));
      return {
        ...state,
        loading: false,
        user: payload.user,
        isAuthenticated: true,
        accessToken: payload.accessToken,
      };

    case types.LOGIN_FAILURE:
    case types.LOGIN_GOOGLE_FAILURE:
    case types.VERIFY_EMAIL_FAILURE:
    case types.LOGIN_FACEBOOK_FAILURE:
    case types.GET_CURRENT_USER_FAILURE:
      return { ...state, loading: false, isAuthenticated: false };

    case types.UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, user: { ...state.user, payload } };

    case types.REGISTER_FAILURE:
    case types.UPDATE_PROFILE_FAILURE:
      return { ...state, loading: false };

    case types.GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        loading: false,
        isAuthenticated: true,
      };

    case types.LOGOUT:
      localStorage.removeItem('accessToken');
      localStorage.removeItem('facebookUser');
      return {
        ...state,
        user: null,
        loading: false,
        accessToken: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
