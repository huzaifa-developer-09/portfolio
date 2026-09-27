import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          I'm a Full-Stack Developer specializing in MERN stack, Next.js and modern frontend development. I build fast, scalable, production-ready digital products — from web applications and SaaS platforms to interactive interfaces.
        </p>
        <p className="para about-para-gap">
          Clean code. Sharp interfaces. Built with intent.
        </p>
      </div>
    </div>
  );
};

export default About;
