import "./App.css";
import AnimationScreen from "./AnimationScreen";
import useScreenSize from "./ScreenSize";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  useStateMachineInput,
} from "@rive-app/react-canvas";

function App() {
  const screenSize = useScreenSize();
  const isWideScreen = screenSize.width / screenSize.height > 1.9;

  const { rive, RiveComponent } = useRive({
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
        {screenSize.width / screenSize.height > 1.4 ? (
          <AnimationScreen />
        ) : (
          <div className="uncompatible">
          <p
            style={{
              color: "white",
              fontFamily: "Lexend, serif",
              fontSize: "14px",
            }}
          >
            Screen size not compatible, please use on desktop
          </p>
          <div className="uncompatible2">
          <RiveComponent />

          </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
