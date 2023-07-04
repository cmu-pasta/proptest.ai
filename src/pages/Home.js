import './Home.css';
import './sakura.css';

function Home() {

  return (
    <div className="Home">
      <h1> Generate a Python Property Test! </h1>
      <p> <b>Proptest-AI</b> is a tool for automatically synthesizing a property test for a Python API method.
      All you need to provide is the API method name and documentation! These are used to prompt a
      a large language model to synthesize a property test using <a href="https://hypothesis.readthedocs.io/">Hypothesis</a>.
      </p>
      <h4> What is Property-Based Testing? </h4>
      <p> Property-based testing is a testing paradigm designed to check properties of a program that should always
      be true. It is especially useful when there is a wide range of inputs to the program that need to be tested
      for a given property. To write a property-based test, you need to write a random input generator and assertions for
      each of the properties to test.
      </p>
      <h4> How does Proptest-AI work? </h4>
      Proptest-AI uses a GPT-based language model in the backend to synthesize property tests using the Python library Hypothesis.
      The API method name and documentation are incorporated into the prompt design for the LLM and serve as guidelines for
      the generator logic and the properties to synthesize.
      <form action="#/playground">
        <input type="submit" value="Try It Out!"></input>
      </form>
    </div>
  );
}

export default Home;
