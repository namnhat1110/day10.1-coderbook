import * as types from "../constants/post.constants";
import * as cTypes from "../constants/comment.constants";
import * as rTypes from "../constants/reaction.constants";

const initialState = {
  posts: [],
  totalPageNum: 1,
  selectedBlog: null,
  loading: false,
};

const postReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.POST_REQUEST:
    case types.CREATE_POST_REQUEST:
    case types.UPDATE_POST_REQUEST:
    case types.DELETE_POST_REQUEST:
    case types.GET_SINGLE_POST_REQUEST:
      return { ...state, loading: true };

    case cTypes.UPDATE_COMMENT_REQUEST:
    case cTypes.DELETE_COMMENT_REQUEST:
    case cTypes.CREATE_COMMENT_REQUEST:
      return { ...state, loading: true };

    case rTypes.UPDATE_REACTION_REQUEST:
    case rTypes.DELETE_REACTION_REQUEST:
    case rTypes.CREATE_REACTION_REQUEST:
      return { ...state, loading: true };

    case types.POST_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: payload.posts,
        totalPageNum: payload.totalPages,
      };

    case types.GET_SINGLE_POST_REQUEST_SUCCESS:
      return { ...state, selectedBlog: payload, loading: false };

    case types.UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedBlog: payload,
      };

    case cTypes.UPDATE_COMMENT_SUCCESS:
      const idw = state.posts.findIndex((p) => p._id === payload.post);
      const newidw = state.posts[idw].comments.findIndex(
        (comment) => comment._id === payload._id
      );
      state.posts[idw].comments[newidw] = payload;
      return {
        ...state,
        submitLoading: false,
        posts: [...state.posts],
      };

    case rTypes.UPDATE_REACTION_SUCCESS:
      const idy = state.posts.findIndex(
        (p) => p._id === payload.reactionableId
      );
      const newidy = state.posts[idy].reactions.findIndex(
        (reaction) => reaction._id === payload._id
      );
      state.posts[idy].reactions[newidy] = payload;
      return {
        ...state,
        submitLoading: false,
        posts: [...state.posts],
      };

    case types.CREATE_POST_FAILURE:
    case types.UPDATE_POST_FAILURE:
    case types.DELETE_POST_FAILURE:
    case types.POST_REQUEST_FAILURE:
    case types.GET_SINGLE_POST_REQUEST_FAILURE:
      return { ...state, loading: false };

    case cTypes.UPDATE_COMMENT_FAILURE:
    case cTypes.DELETE_COMMENT_FAILURE:
    case cTypes.CREATE_COMMENT_FAILURE:
      return { ...state, loading: false };

    case rTypes.UPDATE_REACTION_FAILURE:
    case rTypes.DELETE_REACTION_FAILURE:
    case rTypes.CREATE_REACTION_FAILURE:
      return { ...state, loading: false };



    case types.CREATE_POST_SUCCESS:
      const newPosts = [payload, ...state.posts]
      console.log({ newPosts })
      return {
        ...state,
        posts: newPosts,
        submitLoading: false,
      };

    case types.DELETE_POST_SUCCESS:
      state.posts = state.posts.filter((p) => p._id !== payload._id);
      return {
        ...state,
        submitLoading: false,
        selectedBlog: {},
        posts: [...state.posts]
      };

    case cTypes.DELETE_COMMENT_SUCCESS:
      const idu = state.posts.findIndex((p) => p._id === payload.post);
      state.posts[idu].comments = state.posts[idu].comments.filter(
        (comment) => comment._id !== payload._id
      );

      return {
        ...state,
        submitLoading: true,
        posts: [...state.posts],
      };

    case rTypes.DELETE_REACTION_SUCCESS:
      const postIdx = state.posts.findIndex(
        (p) => p._id === payload.reactionableId
      );

      let reactionIdx = state.posts[postIdx].reactions.findIndex(
        (reaction) => reaction._id === payload._id
      );

      state.posts[postIdx].reactions.splice(reactionIdx, 1);

      return {
        ...state,
        loading: true,
        posts: [...state.posts],
      };

    case types.GET_USER_POSTS_SUCCESS:
      return { ...state, loading: false, posts: [...state.posts] };

    case types.SEND_REACTION_REQUEST:
    case types.CREATE_REVIEW_REQUEST:
      return { ...state, submitLoading: true };

    case cTypes.CREATE_COMMENT_SUCCESS:
      const idx = state.posts.findIndex((p) => p._id === payload._id)
      console.log({ idx, hi: state.posts })
      state.posts[idx] = payload

      return {
        ...state,
        posts: [...state.posts],
        submitLoading: false,
      };

    case rTypes.CREATE_REACTION_SUCCESS:
      const idz = state.posts.findIndex((p) => p._id === payload._id)
      state.posts[idz] = payload;

      return {
        ...state,
        posts: [...state.posts],
        submitLoading: false
      };

    case types.CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        submitLoading: false,
        selectedBlog: {
          ...state.selectedBlog,
          reviews: [...state.selectedBlog.reviews, payload],
        },
      };

    case types.POST_REACTION_SUCCESS:
      return {
        ...state,
        submitLoading: false,
        selectedBlog: { ...state.selectedBlog, reactions: payload },
      };

    case types.REVIEW_REACTION_SUCCESS:
      return {
        ...state,
        selectedBlog: {
          ...state.selectedBlog,
          reviews: [
            ...state.selectedBlog.reviews.map((review) => {
              if (review._id !== payload.reviewId) return review;
              return { ...review, reactions: payload.reactions };
            }),
          ],
        },
        submitLoading: false,
      };

    case types.SEND_REACTION_FAILURE:
    case types.CREATE_REVIEW_FAILURE:
      return { ...state, submitLoading: false };
    default:
      return state;
  }
};

export default postReducer;
