import React, { useEffect, useReducer, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { changeCommunity, createCommunity, joinCommunity } from '../thunk/community'
import { CenterLoader } from '../components/VocabularyComponent'
import { Image } from '../styles/style'
import { likePost, setActiveCommunity } from '../actions'
import { fromJS } from 'immutable'
import { createPost } from '../thunk/post'

const CommunityOuter = styled.div`
  width: 100vw;
  height: calc(100vh - 7vh);
  display: flex;
  align-items: center;
  justify-content: center;
  & .active-clr {
    font-weight: bold;
    color: white;
  }
  & .comm-head{
    background: #5151ac;
    color: white;
    border-radius: 6px 6px 0px 0px;
    padding: 5px;
  }
`
const CommunityInner = styled.div`
  height: 95%;
  width: 90%;
  max-width: 900px;
  border-radius: 6px;
  display: flex;
  gap: 4px;
  position: relative;
`

const CommunityInnerLeft = styled.div`
  height: 100%;
  width: 32%;
  display:flex;
  flex-direction: column;
  gap: 6px;
  & > .top, & > .bottom, & > .crt-cum{
    height: 45%;
    border-radius: 6px;
    box-shadow: 0 0 4px #5151ac7f;
  }
  & > .crt-cum {
    height: 6%;
    background: #5151ac;
    display: flex;
    user-select: none;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
  }
  & .list {
    height: 33vh;
    overflow-y: scroll;
    & > p {
        padding: 4px 2px;
        cursor: pointer;
        &:hover, &.active {
          background-color: #6e6ea7;
          color: white;
        }
        &.active {
          background-color: #577cea;
          & > img {
            box-shadow: 0 0 4px #53ac517e;
          }
        }
        font-size: small;
        display: flex;
        align-items: center;
        gap: 7px;

        & > img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          box-shadow: 0 0 4px #5151ac7f;
        }
    }
  }
`
const CommunityInnerRight = styled.div`
  box-shadow: 0 0 4px #5151ac7f;
  height: 100%;
  width: 70%;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  & > .header {
    padding: 7px 5px;
    background: #5151ac;
    border-radius: 6px 6px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > .cr-pt {
      padding: 6px 10px;
      border-radius: 6px;
      box-shadow: 0 0 4px #5151ac7f;
      background: #577cea;
      display: flex;
      user-select: none;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      color: white;
      &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
  & > .post {
    &.ViewCommunity{
      justify-content: center;
      gap: 10px;
    }
    & > .header {
      width: 90%;
      margin: 0 auto;
      padding: 4px;
      background: #c4e0f9;
      border-radius: 4px;
      font-weight: bold;
    }
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
    padding-bottom: 5px;
    & > .content {
      width: 90%;
      margin: 0 auto;
      white-space: pre-wrap;
    }
  }
`

const CardOuter = styled.div`
  width: 90%;
  margin: auto;
  box-shadow: 0 0 4px #5151ac7f;
  padding: 10px 5px;
  border-radius: 6px;
  & > .header{
    margin: 0 auto;
    padding: 4px;
    background: #c4e0f9;
    border-radius: 4px;
    font-weight: bold;
  }
  & > .content {
    white-space: wrap;
    & > * {
      white-space: wrap;
    }
  }
  & .voc-btm { 
    display: flex;
    gap: 7px;
    box-shadow: 0 0 4px #5151ac7f;
    padding: 4px;
    border-radius: 5px;
    margin-top: 8px;
    & img {
      width: 24px;
      height: 24px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
`

const FormOuter = styled.div`
    display: flex;
    flex-direction: column;
    & > .row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 10px;
      padding: 10px 0px;
      &.mid{
        border-bottom: 1px solid #5151ac7f;
        border-top: 1px solid #5151ac7f;
      }
      & > .lf {
        width: 200px;
        font-weight: bold;
        &.cum-name {
          display: flex;
          justify-content: flex-end;
        }
      }
      & > .rt {
        &.cum-value {
          flex: 1;
          & > input {
            width: 80%;
          }
        }
        & > .quill {
          margin-right: 10px;
        }
        & .ql-container{
          min-height: 150px;
          max-height: 150px;
          overflow-x: hidden;
          overflow-y: scroll;
        }
        &.post .ql-container{
          min-height: 320px;
          max-height: 320px;
        }
      }
    }
    & > .row > .lf.prof{
      display: flex;
      & > .active-img{
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 200px;
        gap: 5px;
        & > p {
          font-weight: bold;
        }
        & > img {
          width: 150px;
        }
      }

    }
    & > .row > .rt > .imgs-lst {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      & > img {
        padding: 10px;
        border-radius: 6px;
        border: 2px solid #5151ac7f;
        width: 60px;
        height: 60px;
        cursor: pointer;
        &:hover {
          border: 2px solid #ffd5007d;

        }
      }
    }
    
`

const toolbarOptions = [['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }]]
const modules = { module: { toolbar: toolbarOptions } }



const profileImgs = Array.from({ length: 12 }, (_, index) => `${index + 1}.png`);
const CommunityForm = (props) => {
  const [communityInfo, setCommunityInfo] = useState({ profileUrl: profileImgs[0], name: "", description: "" })
  const [errMsg, setErrMsg] = useState("")
  const handleNameChange = (name) => {
    setErrMsg("")
    setCommunityInfo((prevState) => ({ ...prevState, name }))
  }

  const handleProfileChange = (profileUrl) => {
    setCommunityInfo((prevState) => ({ ...prevState, profileUrl }))
  }

  const handleDescChange = (description) => {
    setCommunityInfo((prevState) => ({ ...prevState, description }))
  }

  const handleCreateCommunity = async () => { 
    const result = await props.createCommunity({ ...communityInfo, 
      adminId: props.userDet.get("_id"),
      adminName: props.userDet.get("name"),
      adminProfileUrl: props.userDet.get("profileUrl"),
     })

    if (!result?.error) { 
      setCommunityInfo({ profileUrl: profileImgs[0], name: "", description: "" })
      setErrMsg("")
    } else { 
      setErrMsg(result.message)
    }
  }

  const preventCreate = communityInfo.name.trim() === "" || communityInfo.description.trim() === ""

  return (
    <>
      <div className="header">
        {/* <p onClick={() => props.setRightView(RIGHT_VIEWS.communityPost)} className={`cr-pt`} tabIndex={1}>Go Prev</p> */}
        <p>create and organise your <span className='active-clr'>Community</span></p>
        <p onClick={handleCreateCommunity} className={`cr-pt ${preventCreate && "disabled"}`} tabIndex={1}>Create Community</p>
      </div>
      <div className='post'>
        <FormOuter className="form">
          <div className="row">
            <div className="lf prof">
              <div className='active-img'>
                <p>Community Icon</p>
                <img src={`/images/community/${communityInfo.profileUrl}`} alt="" />
              </div>
            </div>
            <div className="rt">
              <div className="imgs-lst">
                {
                  profileImgs.map((img) => <img src={`/images/community/${img}`} onClick={() => handleProfileChange(img)} />)
                }
              </div>
            </div>
          </div>
          <div className="row mid">
            <div className="lf cum-name">
              <p>Community Name :</p>
            </div>
            <div className="rt cum-value">
              <input type="text" value={communityInfo.name} max={60} onInput={(e) => handleNameChange(e.target.value)} />
            </div>
            <span style={{ color: "red", fontSize: "small", padding: "0px 10px" }}>{errMsg}</span>
          </div>
          <div className="row">
            <div className="lf cum-name">
              <p>Community Description :</p>
            </div>
            <div className="rt cum-value">
              <ReactQuill modules={modules?.module} theme="snow" value={communityInfo.description} onChange={(content) => handleDescChange(content)} placeholder='Describe your Community' />
            </div>
          </div>
        </FormOuter>
      </div>
    </>
  )
}

const PostForm = (props) => {
  const [postInfo, setCommunityInfo] = useState({ heading: "", content: "" })

  const handleHeadingChange = (heading) => { 
    setCommunityInfo(prevState => ({ ...prevState, heading }))
  }

  const handleContentChange = (content) => { 
    setCommunityInfo(prevState => ({ ...prevState, content }))
  }


  const handleSubmitPost = async () => {
    await props.createPost({
      heading: postInfo.heading,
      content: postInfo.content,
      communityId: props.activeCommunity.get("id"),
    })
    props.goPrev();
  }


  const preventPost = postInfo.content.trim() === "" || postInfo.content.trim() === "<p><br></p>" || postInfo.heading.trim() === ""

  return (
    <>
      <div className="header">
        <p onClick={() => props.goPrev()} className={`cr-pt`} tabIndex={1}>Go Prev</p>
        <p>create post on <span className='active-clr'>{props.communityData.get("name")}</span> Community</p>
        <p onClick={handleSubmitPost} className={`cr-pt ${preventPost && "disabled"}`} tabIndex={1}>Post</p>
      </div>
      <div className='post'>
        <FormOuter className="form">
          <div className="row mid">
            <div className="lf cum-name">
              <p>Community Name :</p>
            </div>
            <div className="rt cum-value">
              <input type="text" value={postInfo.heading} max={60} onInput={(e) => handleHeadingChange(e.target.value)} />
            </div>
            {/* <span style={{ color: "red", fontSize: "small", padding: "0px 10px" }}>{errMsg}</span> */}
          </div>
          <div className="row">
            <div className="lf cum-name">
              <p>Community Description :</p>
            </div>
            <div className="rt cum-value post">
              <ReactQuill modules={modules?.module} theme="snow" value={postInfo.content} onChange={(content) => handleContentChange(content)} placeholder='Describe your Community' />
            </div>
          </div>
        </FormOuter>
      </div>
    </>
  )
}

const CommunityPost = (props) => {
  const [showPostForm, setShowPostForm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  if (showPostForm) { 
    return <PostForm goPrev={() => setShowPostForm(false)} communityData={props.communityData} createPost={props.createPost} activeCommunity={props.activeCommunity} />
  }
  
  const handleLikeClick = (isLiked, postId) => { 
    console.log("handleLikeClick", isLiked, postId);
    if(isLiked !== undefined)
      props.likePost({ isLiked, postId, communityId: props.activeCommunity.get("id") })
  }
  const handleShowComment = () => { 

  }

  let postCards = props.postsData.entrySeq().map(([key, value], index) => {
    return <CardOuter className="card-outer" key={key}>
      <div className="header">
        <p>{value.get("heading")}</p>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: value.get("content") }}>
      </div>
      <div className="voc-btm" /* ref={(index + 1 === vocabularies.size) ? lastElementRef : null} */>
        <img src={`/images/post/${value.get("isLiked") ? 'like-active' : 'like'}.png`} alt='like' onClick={() => handleLikeClick(!value.get("isLiked"), key)} />
        <span>{value.get("likesCount")} likes</span>
        <img src='/images/post/comment.png' alt='comment' onClick={() => handleShowComment(key)} />
        <span>{value.get("commentsCount")} comments</span>
      </div>
    </CardOuter>
  })

  if (!postCards.size) { 
    postCards = <p style={{ margin: "auto", color: "gray", fontWeight: "bold" }}>No Post is made in this community!</p>
  }

  return (
    <>
      <div className="header">
        <p>You're in <span className='active-clr'>{props.communityData.get("name")}</span> Community</p>
        <p className='cr-pt' tabIndex={1} onClick={() => setShowPostForm(true)}>Create Post</p>
      </div>
      <div className='post'>
        {postCards}
      </div>
    </>
  )
}

const ViewCommunity = (props) => {
  const community = props.communityData;

  const handleJoinCommunity = () => { 
    props.joinCommunity({ id: props.activeCommunity.get("id"), userId: props.userDet.get("_id"), userName: props.userDet.get("name"), profileUrl: props.userDet.get("profileUrl") });
  }

  return (
    <>
      <div className="header">
        <p>Welcome to <span className='active-clr'>{community.get("name")}</span> Community</p>
        <p className='cr-pt' tabIndex={1} onClick={handleJoinCommunity}>Join Community</p>
      </div>
      <div className='post ViewCommunity'>
        <div className="header">
          <p>this group is maintained by {community.get("adminName")}</p>
        </div>
        <pre className="content">
          Description:
          <div dangerouslySetInnerHTML={{ __html: community.get("description") }}></div>
        </pre>
      </div>
    </>
  )
}

const RIGHT_VIEWS = {
  createCommunity: 0,
  viewCommunity: 1,
  communityPost: 2
}

function Community(props) {
  const [rightView, setRightView] = useState(props.activeCommunity.get("id") === "" ? RIGHT_VIEWS.createCommunity : props.activeCommunity.get("type") === "otherCommunites" ? RIGHT_VIEWS.viewCommunity : RIGHT_VIEWS.createCommunity)
  const [activeCommunityData, setActiveCommunityData] = useState(() => (props.activeCommunity.get("id") !== "" ? props[props.activeCommunity.get("type")].get(props.activeCommunity.get("id")) : fromJS({})))
  const activeCommRef = useRef(null)

  const handleCommunityChanges = (id, type = "userCommunites") => { 
    if (id !== props.activeCommunity.get("id"))
      props.changeCommunity({ id, type })
  }

  useEffect(() => { 
    if (props.activeCommunity.get("type") !== "") { 
      let view = props.activeCommunity.get("type") === "userCommunites" ? RIGHT_VIEWS.communityPost : RIGHT_VIEWS.viewCommunity;
      if (rightView !== view) { 
        setRightView(view);
      }
      setActiveCommunityData(props[props.activeCommunity.get("type")].get(props.activeCommunity.get("id")));
    }
    if (activeCommRef.current instanceof HTMLElement) { 
      activeCommRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[props.activeCommunity])

  return (
    <CommunityOuter>
      <CommunityInner>
        {
          props.isCommunityLoading ? <CenterLoader><Image src="/images/spinner.gif" /></CenterLoader> : null
        }
        <CommunityInnerLeft>
          <div className="top">
            <h3 className='comm-head'>Your Community</h3>
            <div className="list">
              {
                props.userCommunites.entrySeq().map(([key, value], index) => {
                  const isActive = key === props.activeCommunity.get("id");
                  return <p ref={isActive ? activeCommRef : null} onClick={() => handleCommunityChanges(key)} className={`${isActive ? "active" : ""}`}>
                    <img src={`images/community/${value.get("profileUrl")}`} />
                    {value.get("name")}
                  </p>
                })
              }
            </div>
          </div>
          <div className="bottom">
            <h3 className='comm-head'>Explore Community</h3>
            <div className="list">
              {
                props.otherCommunites.entrySeq().map(([key, value], index) => {
                  const isActive = key === props.activeCommunity.get("id");
                  return <p ref={isActive ? activeCommRef : null} onClick={() => handleCommunityChanges(key, "otherCommunites")} className={`${isActive ? "active" : ""}`}>
                    <img src={`images/community/${value.get("profileUrl")}`} />
                    {value.get("name")}
                  </p>
                })
              }
            </div>
          </div>
          <div className='crt-cum' onClick={()=>setRightView(RIGHT_VIEWS.createCommunity)}>
            Create Community
          </div>
        </CommunityInnerLeft>
        <CommunityInnerRight>
          {
          rightView === RIGHT_VIEWS.communityPost && (
              <CommunityPost likePost={props.likePost} postsData={props.postsData} communityData={activeCommunityData} activeCommunity={props.activeCommunity} otherCommunites={props.otherCommunites} userCommunites={props.otherCommunites} createPost={props.createPost} />
          ) 
          }
          {
            rightView === RIGHT_VIEWS.createCommunity && (
              <CommunityForm createCommunity={props.createCommunity} userDet={props.userDet} setRightView={setRightView} />
            )
          }
          {
            rightView === RIGHT_VIEWS.viewCommunity && (
              <ViewCommunity activeCommunity={props.activeCommunity} communityData={activeCommunityData} joinCommunity={props.joinCommunity} userDet={props.userDet} />
            )
          }
        </CommunityInnerRight>
      </CommunityInner>
    </CommunityOuter>
  )
}

const mapStateToProps = (state, ownProps) => ({
  userDet: state.localStorage.get("user"),
  isCommunityLoading: state.communityStorage.getIn(["communityLoadStatus", "isLoading"]),
  activeCommunity:  state.communityStorage.get("activeCommunity"),
  userCommunites:  state.communityStorage.get("userCommunites"),
  otherCommunites: state.communityStorage.get("otherCommunites"),
  postsData: state.communityStorage.get("postsData"),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createCommunity: (payload) => dispatch(createCommunity(payload)),
  changeCommunity: (payload) => dispatch(changeCommunity(payload)),
  joinCommunity: (payload) => dispatch(joinCommunity(payload)),
  createPost: (payload) => dispatch(createPost(payload)),
  likePost: (payload) => dispatch(likePost(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Community)