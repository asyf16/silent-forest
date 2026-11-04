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
  const nextArrival = useRef(null);
  const leaveTimes = useRef({});
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
    if (!rive || !volumeInput || !quietInput || !catInput || !bearInput || !owlInput || !bunnyInput) return;
    if (micDecibels)
      volumeInput.value = ((micDecibels / sliderValue) * 100).toFixed(0);
    if (((micDecibels / sliderValue) * 100).toFixed(0) >= 99) {
      setQuietTime(0);
      nextArrival.current = null;
      leaveTimes.current = {};
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
    } else if (quietTime >= 250 && !catInput.value) {
      catInput.value = true;
      // The microphone updates every 50 ms: 20 updates per second.
      nextArrival.current = quietTime + (10 + Math.random() * 20) * 20;
      markSeen("littleKitty");
      rive.setBooleanStateAtPath("Walk", true, "Cat");
      setTimeout(() => rive.setBooleanStateAtPath("Walk", false, "Cat"), 4000);
      if (soundOn) {
        playEffect("./cat.mp3");
      }
    } else if (catInput.value) {
      const animals = [
        { input: bearInput, id: "misterBear", sound: "./bear.mp3" },
        { input: owlInput, id: "madameOwl", sound: "./owl.mp3" },
        { input: bunnyInput, id: "bunny", sound: "./boing.mp3" },
      ];
      const available = animals.filter(({ input }) => !input.value);

      animals.forEach(({ input, id }) => {
        if (input.value && quietTime >= leaveTimes.current[id]) {
          input.value = false;
          delete leaveTimes.current[id];
        }
      });

      if (nextArrival.current !== null && quietTime >= nextArrival.current) {
        if (available.length) {
          const animal = available[Math.floor(Math.random() * available.length)];
          animal.input.value = true;
          leaveTimes.current[animal.id] = quietTime + (20 + Math.random() * 40) * 20;
          markSeen(animal.id);
          if (soundOn) {
            playEffect(animal.sound);
          }
        }
        nextArrival.current = quietTime + (10 + Math.random() * 20) * 20;
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
