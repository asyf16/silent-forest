import "./App.css";
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';

function App() {
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
  const levelInput = useStateMachineInput(rive, "State Machine 1", "bearEnter");

  return (
      <div className="Wrapper">
        <RiveComponent />
        <button className="hi" onClick={() => (levelInput.value= !levelInput.value)}>hufhdufhd</button>
      </div>
  );
}

export default App;
