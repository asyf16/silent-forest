import "./App.css";
import AnimationScreen from "./AnimationScreen";
import useScreenSize from "./ScreenSize";

function App() {
  const screenSize = useScreenSize();
  const isWideScreen = screenSize.width / screenSize.height > 1.9;

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
          <p
            style={{
              color: "white",
              fontFamily: "Lexend, serif",
              fontSize: "14px",
            }}
          >
            Screen size not compatible, please use on desktop
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
