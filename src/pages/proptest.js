import './sakura.css';
import './proptest.css';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { useState, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import examples from './examples'
import {Link} from 'react-router-dom';
import {useScript} from 'usehooks-ts'
import LoadingSpinner from "../components/LoadingSpinner";

function ApiUrl(props) {
  if (props.url !== "") {
    return (
      <div className="url-container">
        API documentation copied directly from&nbsp;
        <Link to={props.url}>here</Link>.
      </div>
    )
  }
  return null;
}

function Proptest(props) {
  const [code, setCode] = useState("")
  const [exampleUrl, setExampleUrl] = useState("")
  const [option, setOption] = useState("")
  const [methodName, setMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [apiDoc, setApiDoc] = useState("")

  const options = Object.keys(examples);
  const pyodideStatus = useScript("https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js", {
        removeOnUnmount: false,

  })
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);

  useEffect(() => {
    document.title = 'Playground';
    // if (pyodideStatus === "ready") {
    //       setTimeout(()=>{
    //         (async function () {
    //           const indexUrl = `https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js`
    //           const pyodide = await global.loadPyodide({indexUrl});
    //           setPyodide(pyodide);
    //           await pyodide.loadPackage(["micropip", "pytest", "numpy", "opencv-python"]);
    //           const micropip = pyodide.pyimport("micropip");
    //           await micropip.install('hypothesis');
    //           setPyodideLoaded(true);
    //         })();
    //       }, 1000)
    //     }
    //   }, [pyodideStatus]);
});

  async function callPyodide() {
    var pythonTest = `import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
${code}
    `
    const myPython = `
    import numpy as np
    import cv2
    def func():
        print("HELLO")
        return np.array2string(5*np.array((1,2,3)))+" |  numpy version: "+np.__version__+"  |  opecv version: "+cv2.__version__
    func() `;
    if (pyodideLoaded) {
      console.log(pyodide);
      let element = document.getElementById("replace");
      element.innerHTML = pyodide.runPython(pythonTest);
      console.log(pyodide);
    } else {
      console.log("Pyodide not loaded yet");
    }
  }

  function queryLambda(methodName, apiDoc, submitButton) {
      submitButton.disabled = true;
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ methodName: methodName,
                                 objectName: "",
                                 apiDoc: apiDoc})
      };
      setIsLoading(true);
      setCode("Generating... (will take a few seconds)");
      localStorage.setItem("status", "");
      fetch('https://5ai4ss6llwtocg6boimmm3rila0mknir.lambda-url.us-east-2.on.aws/', requestOptions)
          .then(async response => {
              const isJson = response.headers.get('content-type')?.includes('application/json');
              const data = isJson && await response.json();

              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  const error = (data && data.result) || response.status;
                  return Promise.reject(error);
              }
              setIsLoading(false);
              setCode(data.result)
              submitButton.disabled = false;
          })
          .catch(error => {
              setIsLoading(false);
              setCode("Error fetching result! Please try again.")
              console.error('There was an error!', error);
          });

  }

  function exampleChange(event) {
    var exampleName = event.value;
    setOption(exampleName);
    setMethod(examples[exampleName]["methodName"]);
    setApiDoc(examples[exampleName]["apiDoc"]);
    setExampleUrl(examples[exampleName]["url"]);

  }

  function methodChange(event) {
    setMethod(event.value);
    setOption("Select...");
    setExampleUrl("");
  }

  function apiDocChange(event) {
    setApiDoc(event.value);
    setOption("Select...");
    setExampleUrl("");
  }

  function submitEvent(event) {
      event.preventDefault();
      queryLambda(event.target.methodname.value, event.target.apidocs.value, event.target.submitbutton);
  };

  return (
    <div className="proptest">
      <h1> Proptest-AI Playground (beta) </h1>
      <div className="container">
        <div className="apiform-container">
          <div className="dropdown-container">
            Enter the API method name and documentation, then click Submit to generate a property test!
            <br/>
            <br/>
            Not sure where to start? You can try out one of our examples:
            <Dropdown className="examples-dropdown" options={options} value={option} onChange={exampleChange} />
          </div>
          <form onSubmit={submitEvent}>
              <div className="half-width">
                  <label htmlFor="method-name">API Method Name:</label>
                  <input type="text" id="method-name" name="methodname" value={methodName} onChange={methodChange} required></input>
              </div>
              <div className="half-width">
                  <label htmlFor="api-doc">API Documentation:</label>
                  <textarea id="api-doc" name="apidocs" rows="10" value={apiDoc} onChange={apiDocChange} required></textarea>
              </div>
              <ApiUrl url={exampleUrl} />
              <input type="submit" name="submitbutton" value="Submit"></input>
          </form>
        </div>
        <div className="output-container">
          <div id="property-test-title">
            <b> Property Test </b>
          </div>
            {isLoading ? <LoadingSpinner /> :
            <CodeMirror
              className="codeMirror"
              value={code}
              extensions={[python()]}
            /> }
        </div>
      </div>
    </div>
  );
}

export default Proptest;
