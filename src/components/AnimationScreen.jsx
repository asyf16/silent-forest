import "../App.css";
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
import { FaInfo } from "react-icons/fa";
import VolumeMenu from "./VolumeMenu";
import PropTypes from "prop-types";

function AnimationScreen({ markSeen }) {
  const [micDecibels, setMicDecibels] = useState(0);
  const [quietTime, setQuietTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(125);
  const [soundOn, setSoundOn] = useState(false);
  const effectAudio = useRef(null);
  let started = useRef(false);

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
  const bunnyInput = useStateMachineInput(rive, "State Machine 1", "rabbitEnter");
  const volumeInput = useStateMachineInput(rive, "State Machine 1", "volume");
  const quietInput = useStateMachineInput(rive, "State Machine 1", "Quiet");

  useEffect(() => {
    if (effectAudio.current) {
      if (!soundOn) effectAudio.current.pause();
    }
  }, [soundOn]);

  useEffect(() => () => effectAudio.current?.pause(), []);

  const playEffect = (source) => {
    effectAudio.current?.pause();
    const sound = new Audio(source);
    sound.volume = 0.5;
    effectAudio.current = sound;
    sound.play().catch(() => {});
  };

  const handleDecibelUpdate = (value) => {
    if (started.current) {
      setMicDecibels(((value / sliderValue) * 100).toFixed(0));
      setQuietTime((prevQuietTime) => prevQuietTime + 1);
    }
  };
  const handleSliderChange = (value) => {
    setSliderValue(Number(value));
  };

  useEffect(() => {
    if (!rive) return;
    const handleStateChange = (event) => {
      if (event.data[0] === "MoonRise") started.current = true;
    };
    rive.on("statechange", handleStateChange);
    return () => rive.off("statechange", handleStateChange);
  }, [rive]);

  useEffect(() => {
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
      if (bunnyInput.value == true) {
        bunnyInput.value = false;
      }
      if (soundOn) {
        playEffect("./shh.mp3");
      }
    } else if (quietTime > 250 && !catInput.value) {
      catInput.value = true;
      markSeen("littleKitty");
      rive.setBooleanStateAtPath("Walk", true, "Cat");
      setTimeout(() => rive.setBooleanStateAtPath("Walk", false, "Cat"), 4000);
      if (soundOn) {
        playEffect("./cat.mp3");
      }
    } else if (quietTime > 800 && !bearInput.value) {
      bearInput.value = true;
      markSeen("misterBear");
      if (soundOn) {
        playEffect("./bear.mp3");
      }
    } else if (quietTime > 2000 && !owlInput.value) {
      owlInput.value = true;
      markSeen("madameOwl");
      if (soundOn) {
        playEffect("./owl.mp3");
      }
    } else if (quietTime > 100 && !bunnyInput.value) {
      bunnyInput.value = true;
      markSeen("bunny");
      if (soundOn) {
        playEffect("./boing.mp3");
      }
    }
  }, [micDecibels, sliderValue, quietTime, rive, volumeInput, quietInput, catInput, bearInput, owlInput, bunnyInput, soundOn, markSeen]);

  return (
    <div className="Wrapper">
      <RiveComponent />
      <MicrophoneDecibelMeter onDecibelUpdate={handleDecibelUpdate} />
      {started.current ? (
        <Slider value={sliderValue} onChange={handleSliderChange} />
      ) : null}
      <div className="buttonDiv">
        <div className="tooltip-group">
          <button type="button" className="info-button" aria-label="About Silent Forest" aria-describedby="forest-info">
            <FaInfo aria-hidden="true" />
          </button>
          <div id="forest-info" className="tooltip" role="tooltip">
            <div className="tooltip-content">
              <p>
                Need motivation to stay focused? Keep quiet for long enough, and
                the animals will keep you company! If you&apos;re too loud,
                you&apos;ll scare them away...
              </p>
            </div>
          </div>
        </div>

        <VolumeMenu soundOn={soundOn} onSoundChange={setSoundOn} />
      </div>
    </div>
  );
}

AnimationScreen.propTypes = { markSeen: PropTypes.func.isRequired };

export default AnimationScreen;
