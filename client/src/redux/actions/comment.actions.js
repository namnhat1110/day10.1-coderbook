import * as types from "../constants/comment.constants";
import api from "../api";
// import { routeActions } from "./route.actions";
// import { toast } from "react-toastify";

const createComment = (body, postId) => async (dispatch) => {
  dispatch({ type: types.CREATE_COMMENT_REQUEST, payload: null });
  try {
    const res = await api.post(`/posts/${postId}/comments`, { body });
    dispatch({
      type: types.CREATE_COMMENT_SUCCESS,
      payload: res.data.data.post,
    });
  } catch (error) {
    dispatch({ type: types.CREATE_COMMENT_FAILURE, payload: error });
  }
}

const deleteComment = (commentId, postId) => async (dispatch) => {
  dispatch({ type: types.DELETE_COMMENT_REQUEST, payload: null });
  try {
    const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
    dispatch({ type: types.DELETE_COMMENT_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: types.DELETE_COMMENT_FAILURE, payload: null });
  }
};

const updateComment = (commentId, postId, bodyComment) => async (dispatch) => {
  dispatch({ type: types.UPDATE_COMMENT_REQUEST, payload: null });
  try {
    const res = await api.patch(`/posts/${postId}/comments/${commentId}`, {
      body: bodyComment,
    });
    dispatch({ type: types.UPDATE_COMMENT_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: types.UPDATE_COMMENT_FAILURE, payload: null });
    console.log(error);
  }
};


export const commentActions = {
  createComment,
  deleteComment,
  updateComment
};
