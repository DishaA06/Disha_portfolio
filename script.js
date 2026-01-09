let activeDrag = null;
let offsetX = 0;
let offsetY = 0;
let isDraggingGlobal = false;

document.addEventListener("mousemove", (e) => {
  if (!activeDrag) return;

  activeDrag.style.left = `${e.clientX - offsetX}px`;
  activeDrag.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  if (!activeDrag) return;

  activeDrag.style.cursor = "grab";
  activeDrag = null;

  setTimeout(() => {
    isDraggingGlobal = false;
  }, 0);
});

function makeDraggable(el, handle = el) {
  handle.style.cursor = "grab";

  handle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    isDraggingGlobal = true;

    const rect = el.getBoundingClientRect();

    //  CRITICAL RESET
    el.style.transform = "none";
    el.style.margin = "0";
    el.style.position = "fixed";
    el.style.left = rect.left + "px";
    el.style.top = rect.top + "px";
    el.style.transition = "none";

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    activeDrag = el;
    handle.style.cursor = "grabbing";
  });

  el.addEventListener("click", e => e.stopPropagation());
}



/* ================= PARALLAX LABELS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const labels = document.querySelectorAll('.labels .label');

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    labels.forEach((label, i) => {
      const depth = (i + 1) * 0.05;
      const x = (e.clientX - cx) * depth / 15;
      const y = (e.clientY - cy) * depth / 15;
      label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  });

  /* ================= TITLE FADE ================= */
  document.querySelectorAll('.curved-title span').forEach((s, i) => {
    s.style.opacity = 0;
    setTimeout(() => {
      s.style.transition = 'opacity 1.5s ease';
      s.style.opacity = 1;
    }, 50 * i);
  });
});

/* ================= STICKY NOTE ================= */
window.addEventListener('load', () => {
  const note = document.getElementById('sticky-note');
  if (note) setTimeout(() => note.classList.add('show'), 500);
});

/* ================= ABOUT ME POPUPS ================= */
const aboutBtn = document.querySelector("#more-about-me");
const aboutPopups = [
  document.getElementById("popup-text"),
  document.getElementById("popup-photo-2")
].filter(Boolean);

let aboutPopupOpen = false;

function animateClose(popup) {
  popup.classList.add("closing");
  setTimeout(() => {
    popup.style.display = "none";
    popup.classList.remove("closing");
    popup.style.opacity = "0";
    popup.style.transform = "scale(0.8)";
  }, 300);
}

function closeAboutPopups() {
  aboutPopups.forEach(p => {
    if (p.style.display === "block") animateClose(p);
  });
  aboutPopupOpen = false;
}

if (aboutBtn) {
  aboutBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (aboutPopupOpen) return;
    aboutPopupOpen = true;

    aboutPopups.forEach((p, i) => {
      p.style.display = "block";
      p.style.opacity = "1";
      p.style.position = "fixed";
      p.style.left = 100 + i * 300 + "px";
      p.style.top = 10 + i * 100 + "px";
      p.style.transform = "none";
    });
  });
}

document.addEventListener("click", (e) => {
  if (isDraggingGlobal) return;

  if (
    aboutPopupOpen &&
    !aboutPopups.some(p => p.contains(e.target)) &&
    !aboutBtn.contains(e.target)
  ) {
    closeAboutPopups();
  }

  if (
    artworkPopup &&
    artworkPopup.style.display === "block" &&
    !artworkPopup.contains(e.target) &&
    !artworkBtn.contains(e.target)
  ) {
    animateClose(artworkPopup);
  }

  if (
    contactPopup &&
    contactPopup.style.display === "block" &&
    !contactPopup.contains(e.target) &&
    !contactBtn.contains(e.target)
  ) {
    contactPopup.classList.remove("show");
    setTimeout(() => contactPopup.style.display = "none", 250);
  }
});


/* ================= SKILLS & EXPERIENCE ================= */

const skillsExpLabel = document.getElementById("skills-exp-btn");
const skillsExpPopup = document.getElementById("skills-exp-popup");


const expImagePopup = document.getElementById("exp-img-popup");
const expDescPopup = document.getElementById("exp-desc-popup");

const expImageEl = document.getElementById("exp-img");
const expTitleEl = document.getElementById("exp-title");
const expTimelineEl = document.getElementById("exp-duration"); // fixed
const expDescEl = document.getElementById("exp-description");


/* ================= EXPERIENCE DATA ================= */

const experienceData = { 
  gemini: {
    title: "Campus Ambassador — Google Gemini",
    timeline: "May 2025 – December 2025",
    desc: 
      "1. Engaged with the student community as a Google Campus Ambassador\n" +
      "2. Promoted Google programs and technical initiatives\n" +
      "3. Created awareness about industry opportunities",
    img: "assets/google.png"
  },
  gssoc: {
    title: "Open Source Contributor — GSSoC",
    timeline: "June 2025 – September 2025",
    desc: 
      "1. Contributed to open-source projects as a GSSoC contributor \n" +
      "2. Collaborated with teams to write and improve code \n" +
      "3. Maintained and enhanced project documentation ",
    img: "assets/contributor.png"
  },
  cisco: {
    title: "Cisco Virtual Intern — AICTE",
    timeline: "October – November 2024",
    desc: 
      "1. Completed an AICTE Virtual Internship with industry-oriented exposure\n" +
      "2. Worked on practical tasks aligned with real-world applications\n" +
      "3. Applied theoretical knowledge to hands-on problem-solving\n" +
      "4. Developed professional and analytical skills",
    img: "assets/aicte.png"
  },
  rnd: {
    title: "R&D Department — College",
    timeline: "EARLY STAGE",
    desc: 
      "1. Analyzed problem statements and explored potential solutions\n" +
      "2. Assisted in implementation and related tasks\n" +
      "3. Strengthened logical thinking and experimentation skills",
    img: "assets/rnd.png"
  }
};

/* ================= MAIN POPUP OPEN ================= */

if (skillsExpLabel && skillsExpPopup) {
  skillsExpLabel.addEventListener("click", (e) => {
    e.stopPropagation();

    skillsExpPopup.style.display = "block";
    skillsExpPopup.style.opacity = "1";
    skillsExpPopup.style.left = "50%";
skillsExpPopup.style.top = "50%";
skillsExpPopup.style.transform = "translate(-50%, -50%) scale(1)";

  });

  skillsExpPopup.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (isDraggingGlobal) return;

    if (
      skillsExpPopup.style.display === "block" &&
      !skillsExpPopup.contains(e.target) &&
      !skillsExpLabel.contains(e.target)
    ) {
      animateClose(skillsExpPopup);
    }
  });
}

/* ================= EXPERIENCE ICON CLICK ================= */

document.querySelectorAll(".exp-icon").forEach(item => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = item.dataset.exp;
    const data = experienceData[key];
    if (!data) return;

    // IMAGE POPUP
    expImageEl.src = data.img;
    expImagePopup.style.display = "block";
    expImagePopup.style.opacity = "1";
    expImagePopup.style.transform = "none";

    // DESCRIPTION POPUP
    expTitleEl.textContent = data.title;
    expTimelineEl.textContent = data.timeline;
    // Clear previous content
expDescEl.innerHTML = "";

// Create a <ul> for bullets
const ul = document.createElement("ul");

// Split the string by \n and create <li> for each point
data.desc.split("\n").forEach(point => {
  const li = document.createElement("li");
  li.textContent = point.replace(/^\d+\.\s*/, ''); // optional: remove leading 1. 2. 3.
  ul.appendChild(li);
});

// Append the list to the popup
expDescEl.appendChild(ul);


    expDescPopup.style.display = "block";
    expDescPopup.style.opacity = "1";
    expDescPopup.style.transform = "none";
  });
});


/* ================= CLOSE EXPERIENCE POPUPS ================= */

document.addEventListener("click", (e) => {
  if (isDraggingGlobal) return;

  if (
    expImagePopup.style.display === "block" &&
    !expImagePopup.contains(e.target)
  ) {
    animateClose(expImagePopup);
  }

  if (
    expDescPopup.style.display === "block" &&
    !expDescPopup.contains(e.target)
  ) {
    animateClose(expDescPopup);
  }
});

/* ================= DRAG ENABLE ================= */

if (skillsExpPopup) makeDraggable(skillsExpPopup, skillsExpPopup.querySelector(".titlebar") || skillsExpPopup);
if (expImagePopup) makeDraggable(expImagePopup, expImagePopup.querySelector(".titlebar") || expImagePopup);
if (expDescPopup) makeDraggable(expDescPopup, expDescPopup.querySelector(".titlebar") || expDescPopup);


/* ================= ARTWORK POPUP ================= */
artworkPopup = document.getElementById("popup-artwork");
artworkBtn = document.getElementById("artwork-btn");


artworkPopup.style.position = "fixed";
artworkPopup.style.left = "30%";
artworkPopup.style.top = "10%";
artworkPopup.style.transform = "translate(-50%, -50%) scale(1)"; 


if (artworkBtn && artworkPopup) {
  artworkBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (artworkPopup.style.display === "block") return;

    artworkPopup.style.display = "block";
    requestAnimationFrame(() => {
      artworkPopup.style.opacity = "1";
      artworkPopup.style.transform = "scale(1)";
    });
  });

  artworkPopup.addEventListener("click", e => e.stopPropagation());
}

document.addEventListener("click", (e) => {
  if (
    artworkPopup &&
    artworkPopup.style.display === "block" &&
    !artworkPopup.contains(e.target) &&
    !artworkBtn.contains(e.target)
  ) {
    animateClose(artworkPopup);
  }
});

/* ================= CONTACT POPUP ================= */
contactBtn = document.getElementById("contact-label");
contactPopup = document.getElementById("popup-contact");


if (contactBtn && contactPopup) {
  contactBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    contactPopup.style.display = "block";
    requestAnimationFrame(() => contactPopup.classList.add("show"));
  });

  contactPopup.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (
      contactPopup.style.display === "block" &&
      !contactPopup.contains(e.target) &&
      !contactBtn.contains(e.target)
    ) {
      contactPopup.classList.remove("show");
      setTimeout(() => contactPopup.style.display = "none", 250);
    }
  });
}



/* ================= PROJECTS POPUP ================= */

const projectsLabel = document.querySelector(".label.center-bottom");
const projectsPopup = document.getElementById("projects-popup");

if (projectsLabel && projectsPopup) {
  projectsLabel.addEventListener("click", (e) => {
    e.stopPropagation();
    if (projectsPopup.style.display === "block") return;

    projectsPopup.style.display = "block";
    projectsPopup.style.opacity = "1";
    projectsPopup.style.transform = "none";
  });

  projectsPopup.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (isDraggingGlobal) return;

    if (
      projectsPopup.style.display === "block" &&
      !projectsPopup.contains(e.target) &&
      !projectsLabel.contains(e.target)
    ) {
      animateClose(projectsPopup);
    }
  });
}
/* ================= PROJECT DETAIL ================= */

const projectPopup = document.getElementById("project-popup");
const projectImg = document.getElementById("project-img");
const projectTitle = document.getElementById("project-title");
const projectDesc = document.getElementById("project-desc");
const projectGithub = document.getElementById("project-github");
const projectDemo = document.getElementById("project-demo");

/* ================= OPEN SOURCE ================= */

const opensourcePopup = document.getElementById("opensource-popup");

/* ================= PROJECT DATA ================= */

const projectData = {
  zbot: {
  title: "ZBOT",
  desc: "ZBOT is an AI-powered chatbot designed to deliver personalized and context-aware interactions. It focuses on creating smooth conversational flows while handling user queries efficiently. The project explores how AI can be used to automate responses, enhance user engagement, and build intelligent virtual assistants with real-world applicability.",
  img: "assets/zbot.png",
  github: "https://github.com/DishaA06/ZBOT",
  demo: "https://yourdemo.link"
},
  mclaren: {
    title: "McLaren Website",
    desc: "A high-fidelity frontend website inspired by McLaren’s design language and branding. This project focuses on clean layouts, smooth animations, and a premium user experience. It showcases attention to detail in UI design and responsiveness while translating a real-world brand’s aesthetic into a functional web interface.",
    img: "assets/mclaren.png",
    github: "https://github.com/DishaA06/CAR-WEBSITE-",
    demo: "https://yourdemo.link"
  },
  floatchat: {
    title: "FloatChat",
    desc: "FloatChat is a frontend user interface for a floating, real-time chat application. The project emphasizes intuitive UI, accessibility, and seamless user interaction. It demonstrates how modern frontend principles can be used to build lightweight, interactive chat components that enhance communication without interrupting the user experience.",
    img: "assets/floatchat.png",
    github: "https://github.com/DishaA06/FLOATCHAT",
    demo: "https://yourdemo.link"
  },
  code_complexity_analyser: {
    title: "Code Complexity Analyser",
    desc: "Galactic Code Complexity Analyzer is a developer-focused tool designed to analyze and visualize the complexity of codebases. It helps identify highly complex sections of code, making it easier to understand, optimize, and maintain projects. The tool emphasizes clarity, usability, and meaningful insights, showcasing how analytical thinking and clean UI can come together to support better software development decisions.",
    img: "assets/code_complexity_analyser.png",
    github: "https://github.com/DishaA06/code_complexity_analyzer",
    demo: "https://yourdemo.link"
  }
};

/* ================= FILE ICON CLICKS ================= */

document.querySelectorAll(".file-icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    const key = icon.dataset.project;

    
    const data = projectData[key];
    if (!data || !projectPopup) return;

    projectImg.src = data.img;
    projectTitle.textContent = data.title;
    projectDesc.textContent = data.desc;
    projectGithub.href = data.github;

    if (data.demo) {
      projectDemo.href = data.demo;
      projectDemo.style.display = "inline";
    } else {
      projectDemo.style.display = "none";
    }

    projectPopup.style.display = "block";
    projectPopup.style.opacity = "1";
    projectPopup.style.transform = "none";
  });
});

/* ================= PROJECT POPUP CLOSE ================= */

if (projectPopup) {
  projectPopup.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", (e) => {
    if (isDraggingGlobal) return;

    if (
      projectPopup.style.display === "block" &&
      !projectPopup.contains(e.target)
    ) {
      animateClose(projectPopup);
    }
  });
}





/* ================= DRAG ENABLE FOR ARTWORK AND CONTACT ================= */
aboutPopups.forEach(p => makeDraggable(p));
if (artworkPopup) makeDraggable(artworkPopup, artworkPopup.querySelector(".popup") || artworkPopup);
if (contactPopup) makeDraggable(contactPopup, contactPopup.querySelector(".popup") || contactPopup);



/* ================= DRAG ENABLE – SKILLS & EXPERIENCE ================= */
if (skillsExpPopup) makeDraggable(skillsExpPopup, skillsExpPopup.querySelector(".popup") || skillsExpPopup);
if (expImagePopup) makeDraggable(expImagePopup, expImagePopup.querySelector(".popup") || expImagePopup);
if (expDescPopup) makeDraggable(expDescPopup, expDescPopup.querySelector(".popup") || expDescPopup);

/* ================= DRAG ENABLE – PROJECTS ================= */

if (projectsPopup) {
  makeDraggable(
    projectsPopup,
    projectsPopup.querySelector(".popup") || projectsPopup
  );
}

if (projectPopup) {
  makeDraggable(
    projectPopup,
    projectPopup.querySelector(".popup") || projectPopup
  );
}

// ================= GENERIC OPEN POPUP FUNCTION ================= */
function openPopup(popup, options = {}) {
  const { left = "50%", top = "50%", transform = "translate(-50%, -50%) scale(1)" } = options;

  popup.style.display = "block";
  popup.style.opacity = "1";
  popup.style.position = "fixed";
  popup.style.left = left;
  popup.style.top = top;
  popup.style.transform = transform;
}


// Skills & Experience popup → center
skillsExpLabel.addEventListener("click", (e) => {
  e.stopPropagation();
  openPopup(skillsExpPopup, { left: "50%", top: "40%" });
});

// Experience image popup → left side
expImagePopup.style.width = "300px"; // optional for neat layout
expDescPopup.style.width = "300px";

document.querySelectorAll(".exp-icon").forEach(item => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    const key = item.dataset.exp;
    const data = experienceData[key];
    if (!data) return;

    // Image
    expImageEl.src = data.img;
    openPopup(expImagePopup, { left: "35%", top: "45%" });

    // Description
    expTitleEl.textContent = data.title;
    expTimelineEl.textContent = data.timeline;

    // Render description as bullets
    expDescEl.innerHTML = "";
    const ul = document.createElement("ul");
    data.desc.split("\n").forEach(point => {
      const li = document.createElement("li");
      li.textContent = point.replace(/^\d+\.\s*/, '');
      ul.appendChild(li);
    });
    expDescEl.appendChild(ul);

    // Description popup → right side
    openPopup(expDescPopup, { left: "65%", top: "45%" });
  });
});







document.querySelectorAll(".file-icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    const key = icon.dataset.project;
    const data = projectData[key];
    if (!data || !projectPopup) return;

    // Set project image & info
    projectImg.src = data.img;
    projectTitle.textContent = data.title;
    projectDesc.textContent = data.desc;
    projectGithub.href = data.github;

    if (data.demo) {
      projectDemo.href = data.demo;
      projectDemo.style.display = "inline";
    } else {
      projectDemo.style.display = "none";
    }

    // Open the popup at a fixed position
    // For example: center-left for image, center-right for details
    // Here projectPopup is just one div, so we place it center
    openPopup(projectPopup, { left: "50%", top: "45%" });
  });
});
