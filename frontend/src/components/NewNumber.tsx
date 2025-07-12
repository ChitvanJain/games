import * as React from "react";
import { Component } from "react";
import GoneNumbers from "./GoneNumbers";

interface NewNumberProps {
  socket: any;
}

interface NewNumberState {
  newNumber: number;
  useHindi: boolean;
}

export interface newNumberObj_t {
  newNumber: number;
}

class NewNumber extends Component<NewNumberProps, NewNumberState> {
  goneNumbers: Array<number>;
  constructor(props: NewNumberProps) {
    super(props);
    this.state = { newNumber: 0, useHindi: false };
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
          const number = newNumberObj.newNumber;
          let utterText = '';
          const digitWords = (n: number) => n.toString().split('').map((d: string) => ['zero','one','two','three','four','five','six','seven','eight','nine'][+d]).join(' ');
          if (number < 10) utterText = `Single number ${digitWords(number)}`;
          else if (number < 100) utterText = `${digitWords(number)}, ${number}`;
          else utterText = `${digitWords(number)}, ${number}`;
          const utter = new window.SpeechSynthesisUtterance(utterText);
          utter.lang = this.state.useHindi ? 'hi-IN' : 'en-IN';
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female')) || voices.find(v => v.name.toLowerCase().includes('woman')) || voices.find(v => v.lang.startsWith('en') && v.name && !v.name.toLowerCase().includes('male'));
          if (femaleVoice) utter.voice = femaleVoice;
          else {
            const fallbackVoice = voices.find(v => v.lang === 'en-US' && v.name && !v.name.toLowerCase().includes('male'));
            if (fallbackVoice) utter.voice = fallbackVoice;
          }
          window.speechSynthesis.cancel();
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

  handleToggleLanguage = () => {
    this.setState((prevState: NewNumberState & { useHindi: boolean }) => ({ useHindi: !prevState.useHindi }));
  };

  render() {
    let newNumberComponent = (
      <>
        <button onClick={this.handleToggleLanguage} style={{marginBottom:8}}>
          {this.state.useHindi ? 'Switch to English Voice' : 'Switch to Hindi Voice'}
        </button>
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
