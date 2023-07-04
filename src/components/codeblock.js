import { CopyBlock, codepen } from "react-code-blocks";

export default function PythonCodeBlock({ code }) {
  <CopyBlock
    text={code}
    language="python"
    showLineNumbers="true"
    theme={codepen}
    codeBlock
  />;
}
