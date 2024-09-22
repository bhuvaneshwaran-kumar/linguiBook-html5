import React, { useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import styled from 'styled-components'
import ReactQuill from 'react-quill';
import { updateVocabData } from '../actions';

const CommentOuter = styled.div`
    box-shadow: 0 0 4px rgba(81, 81, 172, 0.498);
    min-height: 50px;
    padding: 2px;
    & .ql-editor{
        min-height: 40px;
        max-height: 150px;
    }
    & > .top {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 80px;
        max-height: 160px;
        overflow: scroll;
        overflow-x: hidden;
        padding-bottom: 5px;
        & > .cmt-row {
            padding: 2px 2px 5px 2px;
            position: relative;
            font-size: small;
            width: 100%;
            &::after {
                position: absolute;
                content: "";
                width: 69%;
                height: 1px;
                background: #2a8ee6;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 7px;
            }
            & > .cmt-tp{
                display: flex;
                gap: 5px;
                & > img {
                    width: 20px;
                    border-radius: 50%;
                }
                & > span {
                    color: #4f89bc;
                    font-weight: bold;
                }
            }
            & > .cmt-btm {
                text-indent: 15px;
            }
        }
    }
    & > .btm {
        display: flex;
        gap: 5px;
        align-items: end;
        & > div.quill {
            flex: 1;
        }
        & > button {
            border: none;
            outline: none;
            padding: 4px 20px;
            cursor: pointer;
            border-radius: 4px;
            &.disabled {
                pointer-events: none;
                opacity: 0.7;
            }
        }
    }
`

const toolbarOptions = [['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }]]
const modules = { module: { toolbar: toolbarOptions } }

function CommentSectionComponent(props) {
    const [cmtValue, setCmtValue] = useState("");


    const handlePostComment = () => {
        props.updateVocabData({
            vocabId: props.vocabId,
            ctxId: props.ctxId,
            commentData: {
                userId: props.userDet.get("_id"),
                userName: props.userDet.get("name"),
                profileUrl: props.userDet.get("profileUrl"),
                comment: cmtValue
            }
        })
        setCmtValue("")
    }

    const commentsElem = props.comments.size ? props.comments.map(comment => (
        <div className='cmt-row'>
            <div className="cmt-tp">
                <img src={`/images/profile/${comment.get('profileUrl')}`} alt="" />
                <span>{comment.get('userName')}</span>
            </div>
            <div className="cmt-btm" dangerouslySetInnerHTML={{ __html: comment.get('comment') }}></div>
        </div>
    )) : "no comments made in the vocabulary"


  return (
    <CommentOuter>
        <div className="top">
              {commentsElem}
        </div>
        <div className="btm">
              <ReactQuill modules={modules?.module} theme="snow" value={cmtValue} onChange={(content) => setCmtValue(content)} placeholder='Add your Comment' />
              <button className={`${cmtValue === "" && "disabled"}`} onClick={handlePostComment}>Post</button>
        </div>
    </CommentOuter>
  )
}

const mapStateToProps = (state, ownProps) => ({
    userDet: state.localStorage.get('user'),
    ctxId: state.vocabulariesStorage.getIn(["context", "id"]),
    comments: state.vocabulariesStorage.getIn(["vocabularies", ownProps.vocabId, "comments"])
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateVocabData: (payLoad) => dispatch(updateVocabData(payLoad)),
});


export default connect(mapStateToProps, mapDispatchToProps)(CommentSectionComponent)
