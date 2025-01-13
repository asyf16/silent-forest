import "./App.css";
import AnimationScreen from "./AnimationScreen";
import useScreenSize from "./ScreenSize";

function App() {
  const screenSize = useScreenSize();

  return (
    <div className="Wrapper">
      {screenSize.width / screenSize.height < 2.3 &&
      screenSize.width / screenSize.height > 1.4 ? (
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
  );
}

export default App;
