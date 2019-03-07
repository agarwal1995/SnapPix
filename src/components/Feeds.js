import React, { Component } from "react";
import "./../feed.css";
import { Row, Col } from "reactstrap";
import Firebase, { storage, database } from "./../firebase/Firebase";

const likeStyle = {
  padding: "16px",
  position: "absolute",
  right: "16px"
};

class Feeds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      like: false,
      count: 0
    };
  }
  async componentDidMount() {
    var storageRef = database.ref("posts/");
    var data = [];
    await storageRef
      .once("value", function(snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(childSnapshot => {
          console.log(childSnapshot.key);
          console.log(childSnapshot.val());
          data.push(childSnapshot.val());
        });
      })
      .then(event => {
        console.log(data);
        this.setState({ posts: data, count: data.likes });
      });
  }

  handleClick = (event, event2, index) => {
    console.log(index);
    console.log(event2);
    const art = this.state.posts;
    if (!this.state.like) {
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
    }
  };
  render() {
    const { like } = this.state;
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
                    <strong> {Event.caption}</strong>
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
                      {!like ? "Like" : "Unlike"}
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </article>
        ))}
      </div>
    );
  }
}

export default Feeds;
