import React, { Component } from "react";
import { Jumbotron, Button, Row, Col, Container } from "reactstrap";
import { Image } from "react-bootstrap";
import Firebase, { storage, database } from "./../firebase/Firebase";
import "./../style.css";
import logo from "./../img/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const sizeSet = {
  color: "grey"
  // borderRadius: "200px"
};

class Profile extends Component {
  state = {
    email: "",
    name: "",
    id: "",
    profile: "",
    update: false,
    fileUpload: null,
    progress: 0,
    fileUrl: "",
    filename: "",
    fileId: "",
    caption: "",
    visibleToast: false,
    likes: 0,
    check: false,
    comments: 0
  };

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.state.email = user.email;
        this.state.name = user.displayName;
        this.state.profile = user.photoURL;
        this.state.id = user.uid;
      }
    });
  }

  writeUserPost = event => {
    var newPostKey = database
      .ref()
      .child("posts")
      .push().key;

    database.ref("users/" + this.state.id + "/post/" + newPostKey).update({
      postId: newPostKey,
      postUrl: this.state.fileUrl
    });
    database.ref("posts/" + newPostKey).set({
      id: newPostKey,
      postUrl: this.state.fileUrl,
      likes: 0,
      comments: 0,
      likesId: [""],
      comments: [""],
      user: this.state.name,
      filename: this.state.filename,
      userId: this.state.id,
      profilePic: this.state.profile,
      caption: this.state.caption,
      check: false
    });
    /*database.ref("likes/" + newPostKey).set({
      users: [""]
    });*/
  };

  handleSubmit = event => {
    Firebase.auth().onAuthStateChanged(user => {
      const { name, profile } = this.state;
      if (user) {
        user.updateProfile({
          displayName: this.state.name,
          photoURL: this.state.profile
        });
      }
    });
    this.setState({ update: false });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleUpdate = event => {
    this.setState({ update: true });
  };

  handleFileChange = event => {
    console.log(event.target.files[0]);
    if (event.target.files[0]) {
      this.setState({
        fileUpload: event.target.files[0],
        progress: 0,
        filename: event.target.files[0].name
      });
    }
    console.log(this.state);
  };

  handleUpload = event => {
    const { fileUpload } = this.state;
    var UploadTask = storage
      .ref()
      .child(`images/${fileUpload.name}`)
      .put(fileUpload);

    UploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      complete => {
        UploadTask.snapshot.ref.getDownloadURL().then(durl => {
          console.log(durl);
          this.setState({
            fileUrl: durl
          });
          this.writeUserPost();
          this.showToast("Your Post has been uploaded successfully");
          this.setState({
            fileUpload: "",
            filename: ""
          });
        });
      }
    );
  };

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

  render() {
    const {
      email,
      name,
      id,
      profile,
      update,
      fileUpload,
      caption
    } = this.state;

    const updateLinks = (
      <div>
        <form method="POST" onSubmit={this.handleSubmit} className="profile">
          <div className="form-group">
            <input
              type="text"
              name="name"
              id="username"
              value={name}
              onChange={this.handleChange}
              placeholder="Your Name"
            />
          </div>
          <div>
            <input
              type="text"
              name="profile"
              id="profile"
              value={profile}
              onChange={this.handleChange}
              placeholder="Your Profile Pic Url"
            />
          </div>
          <br />
          <div>
            <input
              type="submit"
              name="update"
              id="update"
              value="Update Profile"
            />
          </div>
        </form>
      </div>
    );
    return (
      <div>
        <Jumbotron>
          <center>
            <div>
              <h3>
                <strong>{name}</strong>
              </h3>
            </div>
            <br />
            <div style={sizeSet}>
              <Col>
                <Image
                  src={profile}
                  height="150"
                  width="150"
                  roundedCircle
                  fluid
                />
              </Col>
            </div>
            <br />
            <div>
              <Button outline color="primary" onClick={this.handleUpdate}>
                Update Profile
              </Button>
            </div>
            <br />
            {update ? updateLinks : null}
          </center>
          <br />
          <Row>
            <Col md={4}>
              <center>
                <strong>Followers</strong>
              </center>
            </Col>
            <Col md={4}>
              <center>
                <strong>Following</strong>
              </center>
            </Col>
            <Col md={4}>
              <center>
                <strong>Upload Post</strong>
              </center>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={4} />
            <Col md={4} />
            <Col md={4}>
              <Row>
                <Col md={2} />
                <Col md={8}>
                  <center>
                    <button>
                      <input
                        type="file"
                        name="fileupload"
                        placeholder="t"
                        onChange={this.handleFileChange}
                      />
                    </button>
                  </center>
                </Col>
                <Col md={2} />
              </Row>
              <br />
              <Row>
                <Col md={2} />
                <Col md={8}>
                  <center>
                    <input
                      type="text"
                      name="caption"
                      id="caption"
                      value={caption}
                      onChange={this.handleChange}
                      placeholder="Caption"
                    />
                  </center>
                </Col>
                <Col md={2} />
              </Row>
              <br />
              <center>
                <Button outline color="success" onClick={this.handleUpload}>
                  &nbsp;Post&nbsp;
                </Button>
                <ToastContainer />
              </center>
            </Col>
          </Row>
        </Jumbotron>
      </div>
    );
  }
}

export default Profile;
