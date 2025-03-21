import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const change = (args) => {
    document.getElementById("preview").style.backgroundColor =
        args.currentValue.hex;
};

const ColorPicker = () => {
  const { currentColor, currentMode } = useStateContext();

  return (
    <div
    className={`m-2 md:m-10 p-2 md:p-10 rounded-3xl ${
      currentMode === "Dark" ? "dark-mode" : "light-mode"
    }`}
    style={{
      backgroundColor: currentMode === "Dark" ? "#33373E" : "white",
      color: currentMode === "Dark" ? "#E5E7EB" : "black",
    }}
  >
      <Header title="Color Picker" category="App" />

      <div className="text-center">
        <div id="preview" />
        <div className="flex items-center justify-center gap-20 flex-wrap">
          <div>
            <p className="text-2xl font-medium mt-2 mb-4">Inline Pallete</p>
            <ColorPickerComponent
              id="inline-pallete"
              mode="Palette"
              modeSwitcher={false}
              inline
              showButtons={false}
              change={change}
            />
          </div>
          <div>
            <p className="text-2xl font-medium mt-2 mb-4">Inline Picker</p>
            <ColorPickerComponent
              id="inline-picker"
              mode="Picker"
              modeSwitcher={false}
              inline
              showButtons={false}
              change={change}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ColorPicker;
