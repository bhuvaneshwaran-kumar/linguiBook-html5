import React from 'react'
import styled from 'styled-components'

const AboutOuter = styled.div`
  display: flex;
  justify-content: center;
  height: calc(93vh);
  align-items: center;
  flex-direction: column;

  
  .typewriter-container {
    text-align: center; /* Center aligns the typewriter text */
    overflow: hidden; /* Ensures text wraps within container */
    margin: 20px 0px;
  }

  .typewriter-text {
    overflow: hidden; /* Ensures text is not displayed outside the container */
    white-space: nowrap; /* Prevents text from wrapping */
    animation: typewriter 5s steps(20) infinite; /* Adjust duration and steps as needed */
  }

  @keyframes typewriter {
    from { width: 0; } /* Starts with no text visible */
    to { width: 100%; } /* Ends with full text visible */
  }

`

function About() {
  return (
    <AboutOuter>
      <div class="typewriter-container">
        <p class="typewriter-text">
          Why
          <span> </span> 
          <strong style={{ color: 'rgb(255, 153, 0)' }}>L</strong>
          <strong style={{ color: 'rgb(0, 138, 0)' }}>i</strong>
          <strong style={{ color: 'rgb(107, 36, 178)' }}>n</strong>
          <strong style={{ color: 'rgb(161, 0, 0)' }}>g</strong>
          <strong style={{ color: 'rgb(230, 0, 0)' }}>u</strong>
          <strong style={{ color: 'rgb(0, 41, 102)' }}>i</strong>
          <strong style={{ color: 'rgb(92, 0, 0)' }}>Book</strong>
          <span>?</span> 
        </p>
      </div>
      <ol>
        <li data-list="bullet">
          <span className="ql-ui" contentEditable={false}></span>
          <strong style={{ color: 'rgb(255, 153, 0)' }}>L</strong>
          <strong style={{ color: 'rgb(0, 138, 0)' }}>i</strong>
          <strong style={{ color: 'rgb(107, 36, 178)' }}>n</strong>
          <strong style={{ color: 'rgb(161, 0, 0)' }}>g</strong>
          <strong style={{ color: 'rgb(230, 0, 0)' }}>u</strong>
          <strong style={{ color: 'rgb(0, 41, 102)' }}>i</strong>
          <strong style={{ color: 'rgb(92, 0, 0)' }}>Book</strong>
          {' '}
          is an innovative online social media platform aimed for vocabulary
        </li>
        <li data-list="bullet">
          <span className="ql-ui" contentEditable={false}></span>
          enrichment and language proficiency in a dynamic digital space. Tailored to cater to
        </li>
        <li data-list="bullet">
          <span className="ql-ui" contentEditable={false}></span>
          language learners, educators, and enthusiasts,
          <strong style={{ color: 'rgb(255, 153, 0)' }}>L</strong>
          <strong style={{ color: 'rgb(0, 138, 0)' }}>i</strong>
          <strong style={{ color: 'rgb(107, 36, 178)' }}>n</strong>
          <strong style={{ color: 'rgb(161, 0, 0)' }}>g</strong>
          <strong style={{ color: 'rgb(230, 0, 0)' }}>u</strong>
          <strong style={{ color: 'rgb(0, 41, 102)' }}>i</strong>
          <strong style={{ color: 'rgb(92, 0, 0)' }}>Book</strong>
          {' '}
          offers a comprehensive suite of
        </li>
        <li data-list="bullet">
          <span className="ql-ui" contentEditable={false}></span>
          interactive features designed to facilitate vocabulary acquisition and community engagement
        </li>
      </ol>
    </AboutOuter>
  )
}

export default About
