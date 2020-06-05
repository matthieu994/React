import React from "react";
import { DiMongodb } from "react-icons/di";
import { FaPython, FaNodeJs, FaReact, FaJsSquare, FaCss3Alt, FaHtml5 } from "react-icons/fa";

const desc =
  "Après une première année de DUT Informatique à l'IUT de Sénart-Fontainebleau, je continue ma formation en échange à l'UQAM, à Montréal. \nJe commence à développer un intérêt pour les technologies Web et l'UX/UI, je décide de me lancer en tant que Développeur Web freelance. \nAprès avoir obtenu mon DUT, je pars étudier dans une école d'ingénieur à Grenoble : l'ENSIMAG. Je rejoins la Junior Entreprise de l'école et je réalise mes premières missions.";

const TechEnum = Object.freeze({
  JS: { name: "JavaScript", jsx: <FaJsSquare /> },
  REACT: { name: "React", jsx: <FaReact /> },
  NODE: { name: "NodeJS", jsx: <FaNodeJs /> },
  PYTHON: { name: "Python", jsx: <FaPython /> },
  MONGO: { name: "MongoDB", jsx: <DiMongodb /> },
  CSS: { name: "CSS3", jsx: <FaCss3Alt /> },
  HTML: { name: "HTML5", jsx: <FaHtml5 /> },
  SOCKET: { name: "SocketIO", jsx: <img src="/images/socket-icon.svg" alt="socket-io icon" /> },
});

const projects = [
  {
    title: "Parseur HTML - AsciiDoc",
    desc:
      "Conversion d'une documentation complète sur un site web, vers une documentation en AsciiDoc.",
    img: "/images/project-1.png",
    days: 12,
    techs: [TechEnum.PYTHON, TechEnum.HTML],
    link: "https://github.com/matthieu994/docs",
  },
  {
    title: "Portfolio",
    desc:
      "Site personnel présentant plusieurs fonctionnalités comme un chat avec ses amis, un morpion en ligne, un clone du jeu agar.io.",
    img: "/images/project-2.png",
    people: 1,
    days: "∞",
    techs: [TechEnum.REACT, TechEnum.CSS, TechEnum.NODE, TechEnum.SOCKET, TechEnum.MONGO],
    link: "https://github.com/matthieu994/React",
  },
  {
    title: "nextEvent",
    desc:
      "Application Android et iOS permettant de créer des évènements entre amis et de gérer facilement les dépenses.",
    img: ["/images/project-3a.jpg", "/images/project-3b.jpg", "/images/project-3c.jpg"],
    people: 1,
    days: "∞",
    techs: [TechEnum.REACT, TechEnum.CSS, TechEnum.NODE, TechEnum.SOCKET, TechEnum.MONGO],
    link: "https://github.com/matthieu994/nextEvent",
  },
];

export { desc, projects, TechEnum };
