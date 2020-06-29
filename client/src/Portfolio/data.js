import React from "react";
import { DiMongodb, DiPhotoshop, DiPhp } from "react-icons/di";
import {
  FaPython,
  FaNodeJs,
  FaReact,
  FaJsSquare,
  FaCss3Alt,
  FaHtml5,
  FaUnity,
  FaJava,
  FaDatabase,
} from "react-icons/fa";

const desc =
  "Après une première année de DUT Informatique à l'IUT de Sénart-Fontainebleau, je continue ma formation en échange à l'UQAM, à Montréal. \nJe commence à développer un intérêt pour les technologies Web et l'UX/UI, je décide de me lancer en tant que Développeur Web freelance. \nAprès avoir obtenu mon DUT, je pars étudier dans une école d'ingénieur à Grenoble : l'ENSIMAG. Je rejoins la Junior Entreprise de l'école et je réalise mes premières missions.";

const TechEnum = Object.freeze({
  HTML: { name: "HTML5", jsx: <FaHtml5 /> },
  JS: { name: "JavaScript", jsx: <FaJsSquare /> },
  CSS: { name: "CSS3", jsx: <FaCss3Alt /> },
  PHP: { name: "PHP", jsx: <DiPhp className="php" /> },
  SQL: { name: "SQL", jsx: <FaDatabase /> },
  MONGO: { name: "MongoDB", jsx: <DiMongodb /> },
  NODE: { name: "NodeJS", jsx: <FaNodeJs /> },
  JAVA: { name: "Java", jsx: <FaJava /> },
  PYTHON: { name: "Python", jsx: <FaPython /> },
  CSHARP: { name: "C#", jsx: <img src="/images/csharp-icon.svg" alt="csharp icon" /> },
  SOCKET: { name: "SocketIO", jsx: <img src="/images/socket-icon.svg" alt="socket-io icon" /> },
  REACT: { name: "React", jsx: <FaReact /> },
  REACTNATIVE: { name: "React Native", jsx: <FaReact /> },
  FIREBASE: {
    name: "Firebase",
    jsx: <img src="/images/firebase-icon.svg" alt="firebase icon" className="firebase" />,
  },
  UNITY: { name: "Unity3D", jsx: <FaUnity /> },
  PHOTOSHOP: { name: "Photoshop", jsx: <DiPhotoshop /> },
});

const projects = [
  {
    title: "Parseur HTML - AsciiDoc",
    desc:
      "Conversion d'une documentation complète sur un site web, vers une documentation en AsciiDoc. Travail en freelance.",
    img: "/images/asciidoc.png",
    days: 12,
    techs: [TechEnum.PYTHON, TechEnum.HTML],
    link: "https://github.com/matthieu994/docs",
  },
  {
    title: "Portfolio",
    desc:
      "Site personnel présentant plusieurs fonctionnalités comme un chat avec ses amis, un morpion en ligne, un clone du jeu agar.io.",
    img: "/images/portfolio.jpg",
    people: 1,
    days: "∞",
    techs: [TechEnum.REACT, TechEnum.CSS, TechEnum.NODE, TechEnum.SOCKET, TechEnum.MONGO],
    link: "https://github.com/matthieu994/React",
  },
  {
    title: "nextEvent",
    desc:
      "Application Android et iOS permettant de créer des évènements entre amis et de gérer facilement les dépenses. Développé en Agile.",
    img: ["/images/nextevent-1.jpg", "/images/nextevent-2.jpg", "/images/nextevent-3.jpg"],
    people: 3,
    days: 60,
    techs: [TechEnum.REACTNATIVE, TechEnum.FIREBASE, TechEnum.NODE],
    link: "https://github.com/matthieu994/nextEvent",
  },
  {
    title: "Pyhack",
    desc: "Dungeon Crawler procédural réalisé en 1ère année d'école d'ingénieur.",
    img: "/images/pyhack.png",
    people: 2,
    days: 14,
    techs: [TechEnum.PYTHON],
    link: "https://github.com/matthieu994/pyhack",
  },
  {
    title: "Platform",
    desc: "Platformer 2D réalisé sur Unity pour apprendre à maîtriser l'outil.",
    img: "/images/platform.png",
    people: 1,
    days: "∞",
    techs: [TechEnum.UNITY, TechEnum.CSHARP, TechEnum.PHOTOSHOP],
    link: "https://matthieupetit.com/Platform",
  },
  {
    title: "Annonce mobile 3D",
    desc:
      "Annonce publicitaire en 3D pour mobile, réalisée pendant mon stage de fin d'études en DUT.",
    img: ["/images/ad-1.png", "images/ad-2.png"],
    people: 1,
    days: "7",
    techs: [TechEnum.JS, TechEnum.CSS],
    link: "http://preview.platform.pm/preview/v2/2019/?dca85cd2e2e78f6471d96e01e4218007",
  },
  {
    title: "Jeu de Go",
    desc:
      "Jeu de Go réalisé en 1ère année de DUT. Calcul de territoires automatique, historique de jeu.",
    img: "/images/go.png",
    people: 1,
    days: "60",
    techs: [TechEnum.JAVA],
    link: "https://github.com/matthieu994/Go",
  },
  {
    title: "QuizPanic",
    desc:
      "Quiz en ligne réalisé en 1ère année de DUT. Création et gestion de questions locales ou partagées, lobby avec création de salles publiques et privées.",
    img: "/images/quizpanic.jpg",
    people: 1,
    days: "60",
    techs: [TechEnum.HTML, TechEnum.CSS, TechEnum.JS, TechEnum.PHP, TechEnum.SQL],
    link: "https://github.com/matthieu994/public_html/tree/master/QuizPanic",
  },
];

const exp = [
  {
    title: "Développeur Web Stagiaire",
    location: "PIXIMEDIA, Neuilly-sur-Seine",
    desc:
      "Piximedia est spécialisé dans le secteur d'activité de la régie publicitaire de médias.\n J'ai été chargé de l'unification et du développement de leur site web. J'ai aussi assisté l'équipe Studio dans la réalisation de formats publicitaires.",
    start: "2019-05",
    end: "2019-08",
    type: "work",
  },
  {
    title: "Étudiant Ingénieur",
    location: "Grenoble INP - ENSIMAG",
    desc:
      "Grande école publique d'ingénieurs en informatique et mathématiques appliquées de Grenoble.\n Conseiller Technique de la Junior-Entreprise Nsigma.",
    start: "2019-08",
    end: "",
    type: "school",
  },
  {
    title: "DUT Informatique",
    location: "Université du Québec à Montréal",
    desc: "Deuxième année de DUT Informatique, en échange.\n Major de promotion.",
    start: "2018-09",
    end: "2019-04",
    type: "school",
  },
  {
    title: "DUT Informatique",
    location: "IUT Lieusaint - Fontainebleau",
    desc: "Première année de DUT Informatique.\n Major de promotion.",
    start: "2017-09",
    end: "2018-06",
    type: "school",
  },
  {
    title: "Bac Scientifique",
    location: "Lycée Guillaume Budé, Limeil-Brévannes",
    desc: "Mention Bien, option Informatique et Sciences du Numérique.",
    start: "2014-09",
    end: "2017-06",
    type: "school",
  },
];

export { desc, projects, exp };
