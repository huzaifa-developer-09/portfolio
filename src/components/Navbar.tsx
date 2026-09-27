import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll — desktop only
    if (window.innerWidth <= 1024) return;

    const instance = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });
    lenis = instance;

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    let frameId = 0;
    function raf(time: number) {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    // Handle navigation links
    const links = document.querySelectorAll(".header ul a");
    const linkHandlers = Array.from(links, (elem) => {
      const element = elem as HTMLAnchorElement;
      const onClick = (e: MouseEvent) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const elem = e.currentTarget as HTMLAnchorElement;
          const section = elem.getAttribute("data-href");
          if (section) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              instance.scrollTo(target, {
                offset: 0,
                duration: 1.5,
              });
            }
          }
        }
      };
      element.addEventListener("click", onClick);
      return { element, onClick };
    });

    // Handle resize
    const onResize = () => instance.resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      linkHandlers.forEach(({ element, onClick }) => {
        element.removeEventListener("click", onClick);
      });
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          HZ
        </a>
        <a
          href="mailto:huzaifazafar.com@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          huzaifazafar.com@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
