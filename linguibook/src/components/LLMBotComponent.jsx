import React, { useEffect, useRef, useState } from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { connect } from "react-redux";
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { getAiMessage } from '../thunk/aiAsist';
import { setAiUsrMsgSugg } from '../actions';


const slideFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;
const loadingAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const GlobalStyle = createGlobalStyle`
  .ai-convo-item-enter, .ai-convo-item-appear {
    animation: ${slideFadeIn} 500ms ease-in-out;
  }
`;

const LLMWraper = styled.div`
    width: 30vw;
    height: 100%;
    box-shadow: 0 0 4px #5151ac7f;
    border-radius: 5px;
    overflow: hidden;
    padding: 2px 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    & div > .usr-sugg-prompt {
      position: absolute;
      bottom: 30px;
      border: 2px solid #567ea0;
      border-radius: 4px;
      width: 100%;
      max-height: 200px;
      background-color: #ffffff;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding: 5px;
      animation: ${slideFadeIn} 500ms ease-in-out;
      & > div {
        text-align: left;
        cursor: pointer;
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
      }
    }
    & > .llm-outer {
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;
      & > .llm-body {
          flex: 1;
          height: 100%;
          overflow-y: scroll;
          padding-right: 9px;
          overflow-x: hidden;
          position: relative;
          & > .ai-convo {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 9px;
            & > .msg-ai, & > .msg-user {
              padding: 5px;
              background: #5151ac;
              color: white;
              text-align: left;
              border-radius: 0px 10px;
              max-width: 80%;
              margin-right: auto;
            }
            & > .msg-ai.aiLoaing {
              min-width: 80%;
              height: 25px;
              & > div{
                animation: ${loadingAnimation} 1.5s linear infinite;
                width: 100%;
                height: 100%;
                background: #a4a4a447;
                border-radius: 5px;
              }
            }
            & > .msg-user {
              margin-left: auto;
              margin-right: 0%;
              background-color: #658daf;
            }
        }
      }
      & > .llm-footer {
        display: flex;
        align-items: flex-end;
        gap: 5px;
        & .textarea {
          min-height: auto;
          max-height: 10vh;
          overflow-y: scroll;
          flex: 1;
          border-radius: 5px;
          text-align: left;
          &:focus-visible, &:focus {
            outline: none;
            border: 2px solid #5151ac;
          }
          border: 2px solid #7d7dc4;
        }
        & .send-btn {
          cursor: pointer;
          user-select: none;
          border-radius: 5px;
          width: 25%;
          height: 24px;
          background-color: #5151ac;
          color: white;
          font-weight: bold;
          &:hover {
            background-color: #5151ac;
          }
        }
      }
    }
`

function LLMBotComponent(props) {
  const [promptText, setProptText] = useState("None");
  const [hasError, setHasError] = useState(false);
  const promptRef = useRef(null);
  const lastMsgRef = useRef(null);

  const handleSubmitClick = (promptText) => {
    if (props.isAiMsgLoading) return;
    if (promptText.trim().length === 0) {
      return setHasError(true);
    }
    setHasError(false);
    props.getAiMessage(promptText);
    promptRef.current.textContent = "";
  }

  const checkSelection = () => {
    // Get the current selection object
    const selection = window.getSelection();
    // Check if there is a selection
    if (selection && selection.rangeCount > 0) {
      // Get the range object of the first selection range
      const range = selection.getRangeAt(0);
      let selectedNode = range.commonAncestorContainer;
      // Find the closest ancestor element with class "ai-approve"
      while (selectedNode.nodeType !== Node.ELEMENT_NODE) {
        selectedNode = selectedNode.parentNode;
      }
      const aiApproveParent = selectedNode.closest(".aprove-ai");
      let selectedText = range.toString();
      if (aiApproveParent && selectedText.trim().length !== 0) {
        // Get the selected text
        props.setAiUsrMsgSugg(selectedText);
        // Do something with the selected text
      } else {
        if (props.aiUserMsgSugg !== "") {
          props.setAiUsrMsgSugg("");
        }
      }
    }
  }

  useEffect(() => { lastMsgRef.current && lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }); }, [props.aiConvo, props.isAiMsgLoading])

  useEffect(() => {
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection)
  }, [props.aiUserMsgSugg])

  const getSuggestionArr = (word) => {
    return [
      `give more related words to ${word}`,
      `give more related words to ${word} along with example`,
      `give meaning for word ${word} in different context`,
    ]
  }
  const suggestionArr = props.aiUserMsgSugg !== "" ? getSuggestionArr(props.aiUserMsgSugg) : [];
  return (
    <>
      <GlobalStyle />
      <LLMWraper>
        <div className="llm-outer">
          <div className="llm-body slbr-cus">
            <TransitionGroup className={"ai-convo"}>
              {
                props.aiConvo.map((data, index) => (
                  <CSSTransition classNames={`ai-convo-item`} timeout={500} appear key={index + "aiConvo"}>
                    <div className={`msg-${data.get("from")}`} ref={(!props.isAiMsgLoading && index === props.aiConvo.size - 1) ? lastMsgRef : null} dangerouslySetInnerHTML={{ __html: data.get("msg").replaceAll("\n", "<br>").replaceAll(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}></div>
                  </CSSTransition>
                ))
              }
              {
                props.isAiMsgLoading && (
                  <CSSTransition classNames={`ai-convo-item`} timeout={{ enter: 1000, exit: 0 }} appear>
                    <div key={props.aiConvo.size + "aiMsgLdg"} className={`msg-ai aiLoaing`} ref={lastMsgRef}><div></div></div>
                  </CSSTransition>
                )
              }
            </TransitionGroup>
          </div>
          <div className="llm-footer">
            <div className='textarea' contentEditable={true} onInput={(e) => setProptText(e.target.innerText)} ref={promptRef}></div>
            <div className="send-btn" onClick={() => handleSubmitClick(promptText)} >Send</div>
          </div>
          {
            suggestionArr.length ? (
              <div className='usr-sugg-prompt'>
                {
                  suggestionArr.map((sugg, i) => (
                    <div key={`sugg${i}`} onMouseDown={() => handleSubmitClick(sugg)}>{sugg}</div>
                  ))
                }
              </div>
            ) : null
          }
        </div>
      </LLMWraper>
    </>
  )
}

const mapStateToProps = (state, ownProps) => ({
  isAiMsgLoading: state.localStorage.get("isAiMsgLoading"),
  aiConvo: state.localStorage.get("aiConvo"),
  aiUserMsgSugg: state.localStorage.get("aiUserMsgSugg"),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getAiMessage: (payLoad) => dispatch(getAiMessage(payLoad)),
  setAiUsrMsgSugg: (payLoad) => dispatch(setAiUsrMsgSugg(payLoad)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LLMBotComponent)
