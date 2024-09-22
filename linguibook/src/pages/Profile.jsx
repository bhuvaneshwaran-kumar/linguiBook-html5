import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateProfile } from "../thunk/profile";

const ProfileOuter = styled.div`
  width: 100vw;
  height: calc(100vh - 7vh);
  display: flex;
  align-items: center;
  justify-content: center;
  & .active-clr {
    color: #5c41e1;
  }
`;
const ProfileInner = styled.div`
  height: 90%;
  width: 90%;
  max-width: 600px;
  border-radius: 6px;
  display: flex;
  gap: 4px;
`;

const ProfileInnerLeft = styled.div`
  box-shadow: 0 0 4px #5151ac7f;
  height: 100%;
  width: 40%;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  & > .main-img {
    & > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  & > .img-option {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    & > button {
      /* Image button styling */
      width: 100px;
      height: 100px;
      border: none;
      outline: none;
      background-color: #fff; /* Or a lighter background color */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      &:hover {
        opacity: 0.8;
      }

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensure image covers the button area */
      }
    }
    height: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
  }
`;

const ProfileInnerRight = styled.div`
  box-shadow: 0 0 4px #5151ac7f;
  height: 100%;
  width: 60%;
  border-radius: 6px;
  & > h1 {
    text-align: center;
  }
  & > .bioEditor {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: auto;
    box-shadow: 0 0 4px #5151ac7f;
    border-radius: 6px;
    margin-left: 5%;
    margin-top: 30%;
    padding: 5px;
    & > .edit-elm {
      min-height: 200px;
      max-height: 50vh;
      margin-top: 6px;
    }
    & > .btn-style {
      margin-left: 200px;
      background-color: #5c41e1;
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-size: medium;
      padding-left: 20px;
      padding-right: 20px;
      border: none;
      outline: none;

      &.disable {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }
`;

const profileImgs = Array.from(
  { length: 13 },
  (_, index) => `${index + 1}.png`
);
const toolbarOptions = [
  ["bold", "italic", "underline", { color: [] }, { background: [] }],
];
const modules = { module: { toolbar: toolbarOptions } };

function Profile(props) {
  const [internalBio, setInternalBio] = useState(props.userDet.get("bio"));
  const [internalProfileUrl, setInternalProfileUrl] = useState(
    props.userDet.get("profileUrl")
  );
  const [userId, setUserId] = useState(props.userDet.get("_id"));
  const [allowUpdate, setAllowUpdate] = useState(false);

  const bioEditRef = useRef(null);

  const handleEditor = () => {
    props.dispatchUpdateProfile(internalProfileUrl, internalBio, userId);
  };

  useEffect(() => {

    if (
      props.userDet.get("bio") !== internalBio ||
      props.userDet.get("profileUrl") !== internalProfileUrl
    ) {
      setAllowUpdate(true);
    } else {
      setAllowUpdate(false);
    }
  }, [props.userDet, internalBio, internalProfileUrl]);

  return (
    <ProfileOuter>
      <ProfileInner>
        <ProfileInnerLeft>
          <div className="main-img">
            <img
              src={`/images/profile/${internalProfileUrl}`}
              alt="main-profile"
            />
          </div>
          <div className="img-option">
            <p>
              Change Your <span className="active-clr">Profile Picture</span>
            </p>
            {profileImgs.map((imgSrc) => {
              return (
                <button onClick={() => setInternalProfileUrl(imgSrc)}>
                  <img src={`/images/profile/${imgSrc}`} alt="option=prfile" />
                </button>
              );
            })}
          </div>
        </ProfileInnerLeft>
        <ProfileInnerRight>
          {/* <div className="bioEditor">
            <p>Bio :</p>
            <div className='edit-elm' ref={bioEditRef}>
                    Hey there! I'm Max, a web developer passionate about crafting dynamic and engaging web applications. With a keen eye for design and a knack for problem-solving, I thrive on bringing ideas to life in the digital realm.
            </div>
          </div> */}
          <h1>
            Hello{" "}
            <span className="active-clr">{props.userDet.get("name")}</span>{" "}
          </h1>
          <div className="bioEditor">
            <div className="edit-elm" ref={bioEditRef}>
              <ReactQuill
                modules={modules?.module}
                theme="snow"
                value={internalBio}
                onChange={(content) => setInternalBio(content)}
                placeholder="Write here..."
              />
            </div>
            <button
              className={`btn-style ${!allowUpdate ? "disable" : ""}`}
              onClick={handleEditor}
            >
              Update
            </button>
          </div>
        </ProfileInnerRight>
      </ProfileInner>
    </ProfileOuter>
  );
}

const mapStateToProps = (state, ownProps) => ({
  userDet: state.localStorage.get("user"),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchUpdateProfile: (profileUrl, bio, userId) =>
    dispatch(updateProfile(profileUrl, bio, userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);