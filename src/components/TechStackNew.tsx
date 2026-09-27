import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon: string;
  url: string;
}

// MERN + Frontend focused tech stack — inverted pyramid: 6 → 5 → 4 → 3 → 2
const techStack: TechItem[][] = [
  // Row 1 — 6 items (widest) — Core Frontend
  [
    { name: "React",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",                url: "https://react.dev" },
    { name: "Next.js",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",             url: "https://nextjs.org" },
    { name: "TypeScript",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",     url: "https://typescriptlang.org" },
    { name: "JavaScript",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",     url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",   url: "https://tailwindcss.com" },
    { name: "Three.js",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",           url: "https://threejs.org" },
  ],
  // Row 2 — 5 items — Backend / MERN
  [
    { name: "Node.js",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",             url: "https://nodejs.org" },
    { name: "Express.js",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",           url: "https://expressjs.com" },
    { name: "MongoDB",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",           url: "https://mongodb.com" },
    { name: "PostgreSQL",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",     url: "https://postgresql.org" },
    { name: "Socket.IO",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg",         url: "https://socket.io" },
  ],
  // Row 3 — 4 items — Tools / Services
  [
    { name: "Firebase",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",            url: "https://firebase.google.com" },
    { name: "Redis",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",               url: "https://redis.io" },
    { name: "Redux",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",               url: "https://redux.js.org" },
    { name: "Figma",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",               url: "https://figma.com" },
  ],
  // Row 4 — 3 items — Dev Tools
  [
    { name: "Git",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",                   url: "https://git-scm.com" },
    { name: "GitHub",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",             url: "https://github.com" },
    { name: "Postman",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",           url: "https://postman.com" },
  ],
  // Row 5 — 2 items (tip)
  [
    { name: "Vercel",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",             url: "https://vercel.com" },
    { name: "VS Code",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",             url: "https://code.visualstudio.com" },
  ],
];

const TechStackNew = () => {
  return (
    <div className="techstack-new">
      {/* Video Background */}
      <div className="techstack-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="techstack-video"
        >
          <source src="/video/video.webm" type="video/webm" />
        </video>
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>

        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img src={tech.icon} alt={tech.name} loading="lazy" decoding="async" />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
