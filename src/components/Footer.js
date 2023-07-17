import example from '../assets/example.gif'
import pastalogo from '../assets/pasta-logo.png'
import './Footer.css';
import React, { useEffect  } from 'react';
import {Link} from 'react-router-dom';

function Footer() {

  return (
			<div className="footer">
				<hr />

        <div className="footerLeft">
          <Link to="https://cmu-pasta.github.io/">
            <img name="pasta-logo" src={pastalogo} alt="PASTA Lab Logo" className="footerImg"/>
          </Link>.
        </div>
        <div className="footerRight">
				<footer>
        <p>
					Developed by <Link to="https://vasumv.github.io/">Vasu Vikram</Link> and the&nbsp;
          <Link to="https://cmu-pasta.github.io/">PASTA Lab</Link> @ Carnegie Mellon University.
        </p>
        <p>
					Check out our <Link to="https://arxiv.org/abs/2307.04346">paper</Link> for more info! If you have any feedback or find any issues, please
          report them <Link to="https://github.com/cmu-pasta/proptest.ai/issues">here</Link>.
        </p>
				</footer>
        </div>
			</div>
  );
}

export default Footer;
