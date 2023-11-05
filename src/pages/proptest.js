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
import Footer from '../components/Footer'
import pipreqs from '../assets/pipreqs-0.4.13-py2.py3-none-any.whl'

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
  const [isExecuting, setIsExecuting] = useState(false);
  const [apiDoc, setApiDoc] = useState("")

  const options = Object.keys(examples);
  const pyodideStatus = useScript("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js", {
        removeOnUnmount: false,

  })
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [pyodidePackagesLoaded, setPyodidePackagesLoaded] = useState(false);

  useEffect(() => {
    document.title = 'Playground';
    if (pyodideStatus === "ready") {
          setTimeout(()=>{
            (async function () {
              const indexUrl = `https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js`
              const pyodide = await global.loadPyodide({indexUrl});
              setPyodide(pyodide);
              setPyodideLoaded(true);
            })();
          }, 1000)
        }
      }, [pyodideStatus]);

  async function loadPackages() {
      let outputElem = document.getElementById("executionBox");
      await pyodide.loadPackage(["micropip", "coverage"]);
      const micropip = pyodide.pyimport("micropip");
      await micropip.install(['hypothesis', pipreqs]);
      setPyodide(pyodide);
      setPyodidePackagesLoaded(true);
  }

  async function installNewPackages(packages) {
    console.log(packages);
    let outputElem = document.getElementById("executionBox");
    outputElem.innerHTML = "Installing packages and executing test..."
    const micropip = pyodide.pyimport("micropip");
    await micropip.install(packages)
    setPyodide(pyodide);
  }

  async function executeTest(event) {
    let outputElem = document.getElementById("executionBox");
    outputElem.innerText = ""
    console.log(methodName)
    if (methodName == "") {
      outputElem.innerText = "Please enter an API method name in the form."
      return;
    }
    event.preventDefault();
    setIsExecuting(true);
    console.log(isExecuting);
    if (pyodideLoaded) {
      console.log("Pyodide packages loaded", pyodidePackagesLoaded)
      await loadPackages();

      // TODO: Catch syntax errors
      const parsingCode = `
import ast
import json
from pipreqs import pipreqs
def get_proptest_func_name(node):
  for n in node.body:
      if not isinstance(n, ast.FunctionDef):
          continue
      for d in n.decorator_list:
          if "given" in d.func.id:
              return n.name
  return None

python_str = """
${code}
"""
node = ast.parse(python_str)
func_name = get_proptest_func_name(node)
packages = pipreqs.get_pkgs(python_str)
json.dumps({
    "func_name": func_name,
    "packages": packages,
})
`
    var parseResults;
    try {
      parseResults = JSON.parse(pyodide.runPython(parsingCode));
    } catch (err) {
      console.log(err)
      outputElem.innerText = `Syntax error! Please fix your test.\n ${err.message}`
      setIsExecuting(false);
      return;
    }
    const testFuncName = parseResults["func_name"];
    const packages = parseResults["packages"];
    await installNewPackages(packages);
    outputElem.innerText = "Executing test...";
    const moduleName = methodName.split(".")[0];
      const pytestCode = `
import pytest
pytest.main()
      `
    const instrumentedCode= `${code}
import ${moduleName}
import coverage
import inspect
import json
import traceback
import os
import shutil
import base64

def get_exception(e):
  return ''.join(traceback.format_exception(type(e), e, e.__traceback__))

source_file = inspect.getfile(${moduleName})
print(source_file)
cov = coverage.Coverage(branch=True, cover_pylib=True)
output = None
successful = False

try:
    cov.start()
    ${testFuncName}()
    cov.stop()

    print(cov.report())
    cov.html_report(directory="htmlcov")


    shutil.make_archive('htmlcov', 'zip', 'htmlcov')
    with open("htmlcov.zip", 'rb') as f:
        data = f.read()
        encoded = data
    successful = True
    output = encoded

except Exception as e:
    output = get_exception(e)
output
`;
      pyodide.runPython(instrumentedCode);
      let successful = pyodide.globals.get("successful")

      let executionOutput = pyodide.globals.get("output")
      console.log(successful)
      console.log(executionOutput)
      var outputMsg;
      if (successful) {
        outputElem.innerHTML = "Generating coverage report...";
        let data = pyodide.FS.readFile('./htmlcov.zip');
        let dataUrl = 'data:application/zip;base64,' + arrayBufferToBase64(data);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'coverage.zip';
        link.innerHTML = 'link';
        outputMsg = `Test ran successfully! HTML coverage report can be downloaded here: ${link.outerHTML}`
        outputElem.innerHTML = outputMsg;
      } else {
        outputElem.innerText = executionOutput;
      }
      setIsExecuting(false);
      event.target.runbutton.disabled = false;
    } else {
      console.log("Pyodide not loaded yet");
    }
  }

  function arrayBufferToBase64(buffer) {
      let binary = '';
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      let chunkSize = 4096; // process 4k at a time

      for (let i = 0; i < len; i += chunkSize) {
          let str = String.fromCharCode.apply(null, new Uint8Array(buffer.slice(i, i + chunkSize)));
          binary += str;
      }

      return btoa(binary);
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
              submitButton.disabled = false;
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
    setMethod(event.target.value);
    setOption("Select...");
    setExampleUrl("");
  }

  function apiDocChange(event) {
    setApiDoc(event.target.value);
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
          <div>
            {isLoading ? <LoadingSpinner /> :
                <CodeMirror
                  className="codeMirror"
                  value={code}
                  onChange={setCode}
                  extensions={[python()]}
                />
            }
          </div>
          <div id="executionOutput">
            {isExecuting ? <LoadingSpinner /> :
            <form onSubmit={executeTest}>
              <input type="submit" name="runbutton" value="Run"></input>
            </form>
            }
            <div id="executionBox">
            </div>
          </div>
        </div>
      </div>
        <Footer />
    </div>
  );
}

export default Proptest;
