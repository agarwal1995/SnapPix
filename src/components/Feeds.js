import React, { Component } from "react";
import "./../feed.css";
import { Row, Col } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Firebase, { storage, database } from "./../firebase/Firebase";

const likeStyle = {
  padding: "16px",
  position: "absolute",
  right: "16px"
};

const popup = {
  position: "fixed",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.5)"
};
const popupInner = {
  position: "absolute",
  left: "25%",
  right: "25%",
  top: "25%",
  bottom: "25%",
  margin: "auto",
  background: "white"
};

class PopUp extends Component {
  render() {
    return (
      <div style={popup}>
        <div style={popupInner}>fhsdz</div>
      </div>
    );
  }
}

class Feeds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      like: false,
      count: 0,
      users: [],
      id: "",
      showComments: false,
      newComment: "",
      addC: false,
      userName: "",
      visibleToast: false
    };
  }
  async componentDidMount() {
    var storageRef = database.ref("posts/");
    var data = [];
    // var use = [[]];
    var use = new Array(3);
    for (var j = 0; j < 3; j++) use[j] = new Array(3);

    await Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.state.id = user.uid;
        this.state.userName = user.displayName;
      }
    });

    await storageRef
      .once("value", function(snapshot) {
        snapshot.forEach(childSnapshot => {
          data.push(childSnapshot.val());
        });
      })
      .then(event => {
        console.log(data);
        this.setState({ posts: data, count: data.likes });
      });

    /*var i = 0;
    await database
      .ref("likes/")
      .once("value", function(snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(childSnapshot => {
          console.log(childSnapshot);
          console.log(childSnapshot.key);
          console.log(childSnapshot.val());
          childSnapshot.forEach(ev => {
            console.log(ev.val());
            ev.forEach(v => {
              use[i].push(v.val());
            });
          });
        });
        if (use[i].length == 0) {
          use[i].push("");
        }
        i++;
        console.log("yusdhf" + use[i - 1] + i);
      })
      .then(event => {
        console.log(use + "sdhjsf");
        this.setState({ users: use });
        console.log(this.state.users);
      });*/
  }

  showToast = e => {
    toast(e);
    this.setState(
      {
        visibleToast: true
      },
      () => {
        setTimeout(() => this.setState({ visibleToast: false }), 3000);
      }
    );
  };

  toggelCommentsPopUp = () => {
    console.log(this.state.showComments);
    this.setState({ showComments: !this.state.showComments });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAddComment = event => {
    this.setState({ addC: !this.state.addC });
  };

  async handleDownload(index) {
    var url = this.state.posts[index].postUrl;
    var storageRef = storage.refFromURL(url);
    storageRef.getDownloadURL().then(url => {
      window.open(url);
    });
  }

  async handleClick(event, event2, index) {
    console.log(index);
    console.log(event2);
    const art = this.state.posts;
    var re = this.state.posts[index].likesId;
    var count = re.length;
    if (this.state.posts[index].likesId.includes(this.state.id)) {
      for (var i = 0; i < re.length; i++) {
        if (re[i] === this.state.id) {
          re.splice(i, 1);
        }
      }

      count--;
      art[index].likes = count - 1;
      art[index].likesId = re;
      console.log("true");
      database
        .ref("posts/" + event)
        .update({ likesId: re, likes: count - 1 })
        .then(() => {
          this.setState({ posts: art });
        });
    } else {
      count++;
      console.log("false");
      re.push(this.state.id);
      art[index].likes = count - 1;
      art[index].likesId = re;
      database
        .ref("posts/" + event)
        .update({ likesId: re, likes: count - 1 })
        .then(() => {
          this.setState({ posts: art });
        });
    }
    //database.ref("likes/" + art[index].id).update({ users: lio });

    /*database
      .ref("likes/" + art[1].id)
      .update({ users: this.state.users.push(art[1].userId) });
    */
    /*if (!this.state.like) {
      database
        .ref("posts/" + event)
        .update({
          likes: event2 + 1
        })
        .then(() => {
          database
            .ref("posts/" + event)
            .once("value", function(snapshot) {
              console.log(snapshot.val());
              art[index] = snapshot.val();
            })
            .then(() => {
              this.setState({
                like: true,
                posts: art
              });
            });
        });
    } else {
      database
        .ref("posts/" + event)
        .update({
          likes: event2 == 0 ? 0 : event2 - 1
        })
        .then(() => {
          database.ref("posts/" + event).once("value", function(snapshot) {
            console.log(snapshot.val());
            art[index] = snapshot.val();
          });
        })
        .then(() => {
          this.setState({
            like: false,
            posts: art
          });
        });
    }*/
  }

  postComment = event => {
    const art = this.state.posts;
    console.log(this.state.newComment);
    var obj = {
      user: this.state.userName,
      comment: this.state.newComment
    };
    console.log(obj);
    console.log(art[event].id);
    art[event].comments.push(obj);
    database
      .ref("posts/" + art[event].id)
      .update({ comments: art[event].comments })
      .then(() => {
        this.setState({ posts: art });
      })
      .then(() => {
        this.showToast("The Comment has been Uploaded Successfully");
        this.setState({ addC: false });
      });

    console.log(event);
  };
  render() {
    const { like, showComments, newComment, addC } = this.state;

    const addCommentLink = i => (
      <Row>
        <Col md={1} />
        <Col md={8}>
          <input
            type="text"
            name="newComment"
            id="newComment"
            value={this.newComment}
            onChange={this.handleChange}
            placeholder="Write your Comment"
          />
        </Col>
        <Col md={2}>
          <button
            class="btn btn-primary"
            onClick={this.postComment.bind(this, i)}
          >
            &nbsp;Post&nbsp;
          </button>
        </Col>
      </Row>
    );

    const viewCommentsLink = i => (
      <div>
        <Row>
          <Col md={1}>
            <strong>&nbsp;Sno.</strong>
          </Col>
          <Col md={3}>
            <strong>User</strong>
          </Col>
          <Col md={8}>
            <strong>Comments</strong>
          </Col>
        </Row>
        {this.state.posts[i].comments.map((Event, row) => (
          <Row>
            <Col md={1}>
              <strong>&nbsp;&nbsp;&nbsp;{row != 0 ? row : null}</strong>
            </Col>
            <Col md={3}>{row != 0 ? Event.user : null}</Col>
            <Col md={8}>{Event.comment}</Col>
          </Row>
        ))}
        <ToastContainer />
      </div>
    );
    return (
      <div>
        {this.state.posts.map((Event, i) => (
          <article className="Post">
            <header>
              <div className="Post-user">
                <div className="Post-user-avatar">
                  <img src={Event.profilePic} alt=".." />
                </div>
                <div className="Post-user-nickname">
                  <span>{Event.user}</span>
                </div>
              </div>
            </header>
            <div className="Post-image">
              <div className="Post-image-bg">
                <img src={Event.postUrl} alt="Icon Living" />
              </div>
            </div>
            <div>
              <Row>
                <Col md={6}>
                  <div className="Post-caption">
                    <button
                      class="btn btn-success"
                      onClick={this.handleDownload.bind(this, i)}
                    >
                      Download
                    </button>
                    <strong> &nbsp;{Event.caption}</strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={likeStyle}>
                    {Event.likes} Likes &nbsp;
                    <button
                      onClick={this.handleClick.bind(
                        this,
                        Event.id,
                        Event.likes,
                        i
                      )}
                    >
                      {Event.likesId.includes(this.state.id)
                        ? "Unlike"
                        : "Like"}
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
            <hr />
            <div>
              <Row>
                <Col>
                  <div className="Post-caption">
                    <strong> &nbsp;Comments :&nbsp;&nbsp;</strong>
                    <button
                      class="btn btn-primary"
                      onClick={this.toggelCommentsPopUp}
                    >
                      View Comments
                    </button>
                    &nbsp;&nbsp;
                    <button
                      class="btn btn-warning"
                      onClick={this.handleAddComment}
                    >
                      Add Comment
                    </button>
                  </div>
                </Col>
              </Row>
              {addC ? addCommentLink(i) : null}
              <br />
              {showComments ? viewCommentsLink(i) : null}
              <br />
            </div>
          </article>
        ))}
      </div>
    );
  }
}

export default Feeds;
