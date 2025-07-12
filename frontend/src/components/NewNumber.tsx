import * as React from "react";
import { Component } from "react";
import GoneNumbers from "./GoneNumbers";

interface NewNumberProps {
  socket: any;
}

interface NewNumberState {
  newNumber: number;
}

export interface newNumberObj_t {
  newNumber: number;
}

class NewNumber extends Component<NewNumberProps, NewNumberState> {
  goneNumbers: Array<number>;
  constructor(props: NewNumberProps) {
    super(props);
    this.state = { newNumber: 0 };
    this.goneNumbers = [];
  }

  componentDidMount() {
    this.props.socket.on(
      "newNumberFromHost",
      (newNumberObj: newNumberObj_t) => {
        this.goneNumbers.push(newNumberObj.newNumber);
        this.setState({ newNumber: newNumberObj.newNumber });
        // Speak the new number aloud (for mobile accessibility)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          let number = newNumberObj.newNumber;
          let utterText = '';
          if (number < 10) {
            utterText = `Single number ${number}`;
          } else if (number < 100) {
            const digits = number.toString().split("").join(" ");
            utterText = `${digits} ${number}`;
          } else {
            const digits = number.toString().split("").join(" ");
            utterText = `${digits} ${number}`;
          }
          const utter = new window.SpeechSynthesisUtterance(utterText);
          utter.lang = 'en-US';
          // Try to select a female voice
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female')) || voices.find(v => v.name.toLowerCase().includes('woman')) || voices.find(v => v.lang.startsWith('en') && v.name && !v.name.toLowerCase().includes('male'));
          if (femaleVoice) {
            utter.voice = femaleVoice;
          } else {
            // fallback: pick first en-US voice that is not male
            const fallbackVoice = voices.find(v => v.lang === 'en-US' && v.name && !v.name.toLowerCase().includes('male'));
            if (fallbackVoice) utter.voice = fallbackVoice;
          }
          window.speechSynthesis.cancel(); // Stop any previous speech
          window.speechSynthesis.speak(utter);
        }
      }
    );
  }

  // For generating random key for every render so that dom is manipulated every
  // single time for new render to display the animation
  generateRandomKey = () => {
    return Math.random() * 10000;
  };

  render() {
    let newNumberComponent = (
      <>
        <p className="new-number-player">New Number </p>
        <div>
          <div
            key={this.generateRandomKey()}
            className="new-number-player-container custom-pulse"
          >
            <p className="only-new-number-player">
              {this.state.newNumber ? this.state.newNumber : ""}
            </p>
          </div>
        </div>
        <GoneNumbers numbers={this.goneNumbers} />
      </>
    );
    return newNumberComponent;
  }
}

export default NewNumber;
