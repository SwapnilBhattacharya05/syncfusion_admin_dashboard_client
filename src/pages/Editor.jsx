import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";

import { Header } from "../components";
import { EditorData } from "../assets/dummy";
import { useStateContext } from "../contexts/ContextProvider";

const Editor = () => {
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
      <Header title="Editor" category="App" />

      <RichTextEditorComponent>
        {/* FOR TESTING PURPOSE ONLY */}
        <EditorData />
        <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
      </RichTextEditorComponent>
    </div>
  );
};
export default Editor;
