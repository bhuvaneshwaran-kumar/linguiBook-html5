import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from "react-redux"
import styled from 'styled-components'
import { loadVocData } from '../thunk/ctxtVoc'
import { Image } from '../styles/style'
import { updateVocabData } from '../actions'
import CommentSectionComponent from './CommentSectionComponent'


const VocabularyWrap = styled.div`
    width: 40vw;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    padding: 2px 4px;
    position: relative;
`

const VocabularyListWrap = styled.div`
    height: 100%;
    overflow-y: scroll;
    scroll-behavior: smooth;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    & .chunkLoader { height: 30px; width: 30px; }
`

const CardContainer = styled.div`
  width: 99%;
  min-height: 20vh;
  overflow-y: scroll;
  border-radius: 4px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 0 4px #5151ac7f;
  & .voc-card-header { 
    height: 40px;
    background-color: #8888de;
    color: #ffffff;
    padding: 2px ;
    display: flex;
    align-items: center;
    gap: 9px;
    border-radius: 40px 0px 0px 40px;
    & .prof {
      height: 100%;
    }
  }
  & .voc-card-mid {
    display: flex;
    flex-direction: column;
    gap: 5px;
    & .row {
      display: flex;
      align-items: center;
      gap: 7px;
      & .lft {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        white-space: nowrap;
        padding: 7px 3px;
        border-radius: 4px;
        background: #658daf;
        user-select: none;
      }
      &.term {
        height: 60px;
      }
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

export const CenterLoader = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(184, 223, 250, 0.308);

  & > img {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

function VocabularyComponent(props) {
  const { vocabularies, activeContextId } = props;
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const [showComment, setShowComment] = useState("")

  const handleShowComment = (vocId) => { 
    vocId = vocId === showComment ? "" : vocId;
    setShowComment(vocId);
  }

  const loadVocabChunk = async () => {
    const payLoad = { contextId: activeContextId, from: vocabularies.size, size: 10 };
    const { hasData, error: errorOcc } = await props.loadVocData(payLoad);
    if (!errorOcc) {
      setHasMore(hasData)
    } else {
      setError(true)
    }
  }

  const handleLikeClick = (isLiked, vocabId) => { 
    props.updateVocabData({ isLiked, vocabId, ctxId: props.ctxId });
  }

  const lastElementRef = useCallback((node) => {
    if (props.isVocChunkLoad || props.isVocLoading) return
    if (observer.current) observer.current.disconnect();
    if (!hasMore) return

    observer.current = new IntersectionObserver((entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadVocabChunk();
      }
    }))

    if (node) observer.current.observe(node);
  }, [props.isVocChunkLoad, props.isVocLoading, hasMore])

  const vocabListItems = [];
  if (vocabularies.size) {
    vocabularies.entrySeq().forEach(([key, vocab], index) => {
      vocabListItems.push(
        <CardContainer key={key}>
          <div className='voc-card-header'>
            <img src='/images/profile/1.png' alt='prof' className='prof' />
            <p className='voc-ad-name'>Linguibook</p>
          </div>
          <div className='voc-card-mid'>
            <div className="term row">
              <div className="lft">Term</div>
              <div className="rgt aprove-ai">{vocab.get("term")}</div>
            </div>
            <div className="meaning row">
              <div className="lft">meaning</div>
              <div className="rgt">{vocab.get("meaning")} </div>
            </div>
            <div className="Example row">
              <div className="lft">Example </div>
              <div className="rgt">{vocab.get("relmEg")}</div>
            </div>
          </div>
          <div className="voc-btm" ref={(index + 1 === vocabularies.size) ? lastElementRef : null}>
            <img src={`/images/post/${vocab.get("isLiked") ? 'like-active' : 'like'}.png`} alt='like' onClick={() => handleLikeClick(!vocab.get("isLiked"), key)} />
            <span>{vocab.get("likesCount")} likes</span>
            <img src='/images/post/comment.png' alt='comment' onClick={() => handleShowComment(key)} />
            <span>{vocab.get("commentsCount")} comments</span>
          </div>
          {
            showComment === key && <CommentSectionComponent vocabId={key} />
          }
        </CardContainer>
      )
    })
  }

  return (
    <VocabularyWrap>
      { 
        props.isVocLoading ? <CenterLoader><Image src="/images/spinner.gif" /></CenterLoader> : null
      }
      <VocabularyListWrap className='slbr-cus'>
        {vocabListItems}
        {
          props.isVocChunkLoad ?
            <div className='chunkLoader'>
              <Image src="/images/spinner.gif" width={'30px'} height={'30px'} />
            </div> : null
        }
      </VocabularyListWrap>
    </VocabularyWrap>
  )
}

const mapStateToProps = (state, ownProps) => ({
  isVocChunkLoad: state.localStorage.get("isVocChunkLoad"),
  isVocLoading: state.localStorage.get("isVocLoading"),
  ctxId: state.vocabulariesStorage.getIn(["context", "id"]),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadVocData: (payLoad) => dispatch(loadVocData(payLoad)),
  updateVocabData: (payLoad) => dispatch(updateVocabData(payLoad)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VocabularyComponent)
