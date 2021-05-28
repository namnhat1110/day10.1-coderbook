import * as types from "../constants/post.constants";

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

    case types.CREATE_POST_FAILURE:
    case types.UPDATE_POST_FAILURE:
    case types.DELETE_POST_FAILURE:
    case types.POST_REQUEST_FAILURE:
    case types.GET_SINGLE_POST_REQUEST_FAILURE:
      return { ...state, loading: false };

    case types.CREATE_POST_SUCCESS:
      const newPosts = [payload, ...state.posts]
      console.log({ newPosts })
      return {
        ...state,
        posts: newPosts,
        loading: false,
      };

    case types.DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedBlog: {},
      };

    case types.GET_USER_POSTS_SUCCESS:
      return { ...state, loading: false, posts: [...state.posts] };

    case types.SEND_REACTION_REQUEST:
    case types.CREATE_REVIEW_REQUEST:
      return { ...state, submitLoading: true };

    case types.CREATE_COMMENT_SUCCESS:
      const idx = state.posts.findIndex((p) => p._id === payload._id)
      console.log({ idx, hi: state.posts })
      state.posts[idx] = payload

      return {
        ...state,
        posts: [...state.posts],
        submitLoading: false,
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
