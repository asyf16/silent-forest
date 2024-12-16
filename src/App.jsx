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

const maxVolume = 100;

function App() {
  const [micDecibels, setMicDecibels] = useState(0);
  const [quietTime, setQuietTime] = useState(0);
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


  const handleDecibelUpdate = (value) => {
    if (value > maxVolume) {
      setMicDecibels(100); // Cap mic decibels to 100 if value exceeds maxVolume
    } else {
      setMicDecibels((value / maxVolume * 100).toFixed(0)); // Scale mic decibels to percentage
    }
    setQuietTime((prevQuietTime) => prevQuietTime + 1); // Increment quiet time
  };

  useEffect(() => {
    if (micDecibels > maxVolume) {
      setQuietTime(0); // Reset quiet time if maxVolume is exceeded
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

    console.log(micDecibels, quietTime);
    if (quietTime > 150 && !catInput.value) {
      catInput.value = true;
      rive.setBooleanStateAtPath("Walk", true, "Cat");
      setTimeout(() => rive.setBooleanStateAtPath("Walk", false, "Cat"), 4000);
    }
    if (quietTime > 300 && !bearInput.value) {
      bearInput.value = true;
    }
    if (quietTime > 500 && !owlInput.value) {
      owlInput.value = true;
    }
  }, [micDecibels]);

  return (
    <div className="Wrapper">
      <RiveComponent />
      <MicrophoneDecibelMeter onDecibelUpdate={handleDecibelUpdate}/>
    </div>
  );
}

export default App;
