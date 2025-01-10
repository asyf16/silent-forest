import "./App.css";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  useStateMachineInput,
} from "@rive-app/react-canvas";
import MicrophoneDecibelMeter from "./volumeMeter";
import { useState, useEffect, useRef } from "react";
import Slider from "./slider";
import { FaInfo, FaVolumeMute, FaVolumeUp } from "react-icons/fa";


function AnimationScreen() {
  const [micDecibels, setMicDecibels] = useState(0);
  const [quietTime, setQuietTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(125);
  const [soundOn, setSoundOn] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: "/riv/silent_forest.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    artboard: "Main Screen",
    layout: new Layout({
      fit: Fit.Fill,
      alignment: Alignment.TopCenter,
    }),
  });
  const catInput = useStateMachineInput(rive, "State Machine 1", "catEnter");
  const bearInput = useStateMachineInput(rive, "State Machine 1", "bearEnter");
  const owlInput = useStateMachineInput(rive, "State Machine 1", "owlEnter");
  const volumeInput = useStateMachineInput(rive, "State Machine 1", "volume");
  const quietInput = useStateMachineInput(rive, "State Machine 1", "Quiet");

  const bgm = useRef(new Audio("./bgm.mp3"));
  // const setupBgm = () => {
  //   bgm.addEventListener("ended", () => {
  //     bgm.currentTime = 0;
  //     bgm.play();
  //   });
  // };
  // setupBgm();
  // bgm.pause();

  const handleDecibelUpdate = (value) => {
    setMicDecibels(((value / sliderValue) * 100).toFixed(0));
    setQuietTime((prevQuietTime) => prevQuietTime + 1);
  };
  const handleSliderChange = (value) => {
    setSliderValue(Number(value));
  };

  const handleSoundChange = () => {
    if (soundOn) {
      setSoundOn(false);
      bgm.current.pause();
    } else {
      setSoundOn(true);
      bgm.current.play();
    }
  };

  useEffect(() => {
    console.log(bgm.current.currentTime);
    if (bgm.current.currentTime >= 175) {
      bgm.current.currentTime = 0;
    }
    if (micDecibels)
      volumeInput.value = ((micDecibels / sliderValue) * 100).toFixed(0);
    if (((micDecibels / sliderValue) * 100).toFixed(0) >= 99) {
      setQuietTime(0);
      quietInput.value = true;
      setTimeout(() => (quietInput.value = false), 2500);
      if (catInput.value == true) {
        catInput.value = false;
        rive.setBooleanStateAtPath("Walk", true, "Cat");
      }
      if (bearInput.value == true) {
        bearInput.value = false;
      }
      if (owlInput.value == true) {
        owlInput.value = false;
      }
      if (soundOn) {
        const sound = new Audio("./shh.mp3");
        sound.play();
      }
    } else if (quietTime > 150 && !catInput.value) {
      catInput.value = true;
      rive.setBooleanStateAtPath("Walk", true, "Cat");
      setTimeout(() => rive.setBooleanStateAtPath("Walk", false, "Cat"), 4000);
      if (soundOn) {
        const sound = new Audio("./cat.mp3");
        sound.play();
      }
    } else if (quietTime > 250 && !bearInput.value) {
      bearInput.value = true;
      if (soundOn) {
        const sound = new Audio("./bear.mp3");
        sound.play();
      }
    } else if (quietTime > 400 && !owlInput.value) {
      owlInput.value = true;
      if (soundOn) {
        const sound = new Audio("./owl.mp3");
        sound.play();
      }
    }
  }, [micDecibels, sliderValue]);

  return (
    <div className="Wrapper">
      <RiveComponent />
      <MicrophoneDecibelMeter onDecibelUpdate={handleDecibelUpdate} />
      <Slider value={sliderValue} onChange={handleSliderChange} />
      <div className="buttonDiv">
        <button>
          <FaInfo />
        </button>
        <button onClick={handleSoundChange}>
          {soundOn ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </div>
    </div>
  );
}

export default AnimationScreen;
