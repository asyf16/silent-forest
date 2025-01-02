import "./App.css";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  useStateMachineInput,
} from "@rive-app/react-canvas";
import MicrophoneDecibelMeter from "./volumeMeter";
import { useState, useEffect } from "react";
import Slider from "./slider";


function AnimationScreen() {
  const [micDecibels, setMicDecibels] = useState(0);
  const [quietTime, setQuietTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(125);
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

  const handleDecibelUpdate = (value) => {
    setMicDecibels(((value / sliderValue) * 100).toFixed(0)); // Scale mic decibels to percentage
    setQuietTime((prevQuietTime) => prevQuietTime + 1); // Increment quiet time
  };
  const handleSliderChange = (value) => {
    setSliderValue(Number(value)); // Update slider value in parent as a number
  };

  useEffect(() => {
    if (micDecibels) volumeInput.value = (micDecibels/sliderValue*100).toFixed(0);

    if ((micDecibels/sliderValue*100).toFixed(0) >= 99) {
      setQuietTime(0); // Reset quiet time if maxVolume is exceeded
      quietInput.value = true;
      setTimeout(() => (quietInput.value = false), 2500);
      if (catInput.value) {
        catInput.value = false;
        rive.setBooleanStateAtPath("Walk", true, "Cat");
      }
      if (bearInput.value) {
        bearInput.value = false;
      }
      if (owlInput.value) {
        owlInput.value = false;
      }
    }
    if (quietTime > 250 && !catInput.value) {
      catInput.value = true;
      rive.setBooleanStateAtPath("Walk", true, "Cat");
      setTimeout(() => rive.setBooleanStateAtPath("Walk", false, "Cat"), 4000);
    }
    if (quietTime > 500 && !bearInput.value) {
      bearInput.value = true;
    }
    if (quietTime > 1000 && !owlInput.value) {
      owlInput.value = true;
    }
  }, [micDecibels, sliderValue]);

  return (
    <div className="Wrapper">
      <RiveComponent />
      <MicrophoneDecibelMeter onDecibelUpdate={handleDecibelUpdate} />
      <Slider value={sliderValue} onChange={handleSliderChange} />
    </div>
  );
}

export default AnimationScreen;
