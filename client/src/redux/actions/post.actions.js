import * as types from "../constants/post.constants";
import api from "../api";
import { routeActions } from "./route.actions";
import { toast } from "react-toastify";

const postsRequest = (
  pageNum = 1,
  limit = 10,
  query = null,
  ownerId = null,
  sortBy = null
) => async (dispatch) => {
  dispatch({ type: types.POST_REQUEST, payload: null });
  try {
    let queryString = "";
    if (query) {
      queryString = `&title[$regex]=${query}&title[$options]=i`;
    }
    if (ownerId) {
      queryString = `${queryString}&author=${ownerId}`;
    }
    let sortByString = "";
    if (sortBy?.key) {
      sortByString = `&sortBy[${sortBy.key}]=${sortBy.ascending}`;
    }
    const res = await api.get(
      `/posts?page=${pageNum}&limit=${limit}${queryString}${sortByString}`
    );
    dispatch({
      type: types.POST_REQUEST_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: types.POST_REQUEST_FAILURE, payload: error });
  }
};

const getSingleBlog = (blogId) => async (dispatch) => {
  dispatch({ type: types.GET_SINGLE_POST_REQUEST, payload: null });
  try {
    const res = await api.get(`/posts/${blogId}`);
    dispatch({
      type: types.GET_SINGLE_POST_REQUEST_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_SINGLE_POST_REQUEST_FAILURE, payload: error });
  }
};

const createReview = (blogId, reviewText) => async (dispatch) => {
  dispatch({ type: types.CREATE_REVIEW_REQUEST, payload: null });
  try {
    const res = await api.post(`/reviews/posts/${blogId}`, {
      content: reviewText,
    });
    dispatch({
      type: types.CREATE_REVIEW_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({ type: types.CREATE_REVIEW_FAILURE, payload: error });
  }
};

const createNewBlog = (title, content, images) => async (dispatch) => {
  dispatch({ type: types.CREATE_POST_REQUEST, payload: null });
  try {
    // For uploading file manually
    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("content", content);
    // if (images && images.length) {
    //   for (let index = 0; index < images.length; index++) {
    //     formData.append("images", images[index]);
    //   }
    // }
    // const res = await api.post("/posts", formData);

    // Upload images using cloudinary already
    const res = await api.post("/posts", { title, content, images });

    dispatch({
      type: types.CREATE_POST_SUCCESS,
      payload: res.data.data,
    });
    dispatch(routeActions.redirect("__GO_BACK__"));
    toast.success("New blog has been created!");
  } catch (error) {
    dispatch({ type: types.CREATE_POST_FAILURE, payload: error });
  }
};

const updateBlog = (blogId, title, content, images) => async (dispatch) => {
  dispatch({ type: types.UPDATE_POST_REQUEST, payload: null });
  try {
    // let formData = new FormData();
    // formData.set("title", title);
    // formData.set("content", content);
    const res = await api.put(`/posts/${blogId}`, { title, content, images });

    dispatch({
      type: types.UPDATE_POST_SUCCESS,
      payload: res.data.data,
    });
    dispatch(routeActions.redirect("__GO_BACK__"));
    toast.success("The blog has been updated!");
  } catch (error) {
    dispatch({ type: types.UPDATE_POST_FAILURE, payload: error });
  }
};

const deleteBlog = (blogId) => async (dispatch) => {
  dispatch({ type: types.DELETE_POST_REQUEST, payload: null });
  try {
    const res = await api.delete(`/posts/${blogId}`);
    console.log(res);
    dispatch({
      type: types.DELETE_POST_SUCCESS,
      payload: res.data,
    });
    dispatch(routeActions.redirect("__GO_BACK__"));
    toast.success("The blog has been deleted!");
  } catch (error) {
    dispatch({ type: types.DELETE_POST_FAILURE, payload: error });
  }
};

const sendEmojiReaction = (targetType, targetId, emoji) => async (dispatch) => {
  dispatch({ type: types.SEND_REACTION_REQUEST, payload: null });
  try {
    const res = await api.post(`/reactions`, { targetType, targetId, emoji });
    if (targetType === "Blog") {
      dispatch({
        type: types.POST_REACTION_SUCCESS,
        payload: res.data.data,
      });
    }
    if (targetType === "Review") {
      dispatch({
        type: types.REVIEW_REACTION_SUCCESS,
        payload: { reactions: res.data.data, reviewId: targetId },
      });
    }
  } catch (error) {
    dispatch({ type: types.SEND_REACTION_FAILURE, payload: error });
  }
};

export const postActions = {
  postsRequest,
  getSingleBlog,
  createReview,
  createNewBlog,
  updateBlog,
  deleteBlog,
  sendEmojiReaction,
};
