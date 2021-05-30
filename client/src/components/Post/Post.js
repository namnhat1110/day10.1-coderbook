import React, { useState } from "react";
import {
  Col,
  Form,
  Card,
  Button,
  ListGroup,
  ButtonGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch } from "react-redux";

import avatar from "../../assets/avatar.jpg";

import { commentActions, postActions, reactionActions } from "../../redux/actions";

import "./style.css";

const Avatar = (props) => {
  return <img alt="profile" className="rounded-circle" src={avatar} />;
};

/* STEP 4 */
const CommentForm = ({ postId }) => {
  const dispatch = useDispatch();
  const [body, setBody] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(commentActions.create(body, postId));

    setBody("");
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Row>
        <Col className="d-flex">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Write a comment..."
            className="border-0 rounded-md bg-light"
            onChange={(e) => setBody(e.target.value)}
          />
        </Col>
      </Form.Row>
    </Form>
  );
};

// 1. Comment body needs to listen for a click
// 2. If comment clicked, dispatch action with comment id & 

const Comment = ({ body, owner, _id }) => {
  const dispatch = useDispatch()


  return (
    <ListGroupItem className="justify-content-start border-bottom-0 pr-0 py-0">
      <Avatar url={avatar} />
      <div className="col">
        <div
          className="comment-bubble"
          onClick={() => dispatch(reactionActions.createReaction(_id, 'Like', 'Comment'))}
        >
          <div className="font-weight-bold">{owner?.name}</div>
          <p>{body}</p>
        </div>
      </div>
    </ListGroupItem>
  );
};

const PostComments = (props) => {
  return (
    <Card.Body>
      <ListGroup className="list-group-flush">
        {props.comments?.map((c) => {
          return <Comment {...c} key={c._id} />;
        })}
      </ListGroup>
    </Card.Body>
  );
};

const POST_ACTIONS = [
  { title: "Like", icon: "thumbs-up" },
  { title: "Heart", icon: "comment" },
  { title: "Wow", icon: "share" },
];

const PostActionButton = ({ title, icon, postId, post }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(reactionActions.createReaction(postId, title, "Post"));
  };

  return (
    <Button onClick={onClick} className="bg-light bg-white text-dark border-0">
      {" "}
      <FontAwesomeIcon
        size="lg"
        icon={icon}
        color="black"
        className="mr-2 action-icon"
      />
      {title}
    </Button>
  );
};

const PostActions = ({ post }) => {
  return (
    <ButtonGroup aria-label="Basic example">
      {POST_ACTIONS.map((a) => {
        return (
          <PostActionButton
            key={a.title}
            {...a}
            postId={post._id}
            post={post}
          />
        );
      })}
    </ButtonGroup>
  );
};

const PostReactions = ({ post }) => {
  return (
    <div className="d-flex justify-content-between my-2 mx-3">
      <p className="mb-0">{post.reactions.length}</p>
      <p className="mb-0">{post.comments.length} comments</p>
    </div>
  );
};

function PostHeader() {
  return (
    <div className="d-flex align-items-center p-3">
      <Avatar url="https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.0-1/p480x480/13924881_10105599279810183_392497317459780337_n.jpg?_nc_cat=109&ccb=3&_nc_sid=7206a8&_nc_ohc=uI6aGTdf9vEAX8-Aev9&_nc_ht=scontent.fsgn5-6.fna&tp=6&oh=e8b18753cb8aa63937829afe3aa916a7&oe=6064C685" />
      <h3 className="font-weight-bold ml-3">Charles Lee</h3>
    </div>
  );
}

export default function Post({ post }) {
  return (
    <Card className="p-3 mb-3 shadow rounded-md">
      <PostHeader />
      {post.body}
      <Card.Img
        variant="top"
        src="https://images.unsplash.com/photo-1529231812519-f0dcfdf0445f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8dGFsZW50ZWR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
      />
      <PostReactions post={post} />
      <hr className="my-1" />
      <PostActions post={post} />
      <hr className="mt-1" />
      <PostComments comments={post.comments} />
      <CommentForm postId={post._id} />
    </Card>
  );
}