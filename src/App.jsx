import "./App.css";
import useIndex from "./hooks/useIndex";
import AnimationScreen from "./components/AnimationScreen";
import Contact from "./components/Contact";
import AnimalIndex from "./components/AnimalIndex";
import useScreenSize from "./components/ScreenSize";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

function App() {
  const { index, markSeen } = useIndex();
  const screenSize = useScreenSize();
  const isCompatible = screenSize.width / screenSize.height > 1.4;
  const isWideScreen = screenSize.width / screenSize.height > 1.9;

  const { RiveComponent } = useRive({
    src: "/riv/cat.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    artboard: "Main Screen",
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  return (
    <div className="Wrapper">
      <div
        className="Wrapper"
        style={{
          height: isWideScreen ? "100%" : "auto",
          width: isWideScreen ? `${screenSize.height * 1.8}px` : "100%",
        }}
      >
        {isCompatible ? (
          <AnimationScreen markSeen={markSeen} />
        ) : (
          <div className="uncompatible">
          <div className="incompatible-message">
          <p
            style={{
              color: "white",
              fontFamily: "Lexend, serif",
              fontSize: "14px",
            }}
          >
            Screen size not compatible, please use on desktop
          </p>
          <Contact />
          </div>
          <div className="uncompatible2">
          <RiveComponent />

          </div>
          </div>
        )}
      </div>
      {isCompatible && <Contact />}
      {isCompatible && <AnimalIndex index={index} />}
    </div>
  );
}

export default App;
