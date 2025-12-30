// 'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // to get the coordinates and other properties of the section
  console.log(e.target.getBoundingClientRect()); // e.target is the button, so we get its position related to the viewport whenever clicked, top, left values get changed.
  console.log('Current scroll (X/Y)', scrollX, scrollY); // these values are in px
  // y coord is the distance between the button and the top of the viewport
  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth); // to see the results, try changing the console box width.

  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  // adding current scroll amount to coords because .top and .left are relative to the entire page.

  // implementing the above, but passing as an object for smooth scroll (but old school way)
  /*   window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  }); */

  // latest and best way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove('operations__tab--active'));
  tabsContent.forEach((tc) => tc.classList.remove('operations__content--active'));

  // Activate content area
  clicked.classList.add('operations__tab--active');
  console.log(clicked.dataset.tab);

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  //   console.log(this, e.currentTarget); nav element is curtar, and this is opactiy passed value

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5)); // mouseenter cant bubble, so we use mouseover here
nav.addEventListener('mouseout', handleHover.bind(1)); // to undo what we do on hover, we use this to apply when mouse is moved away

// Sticky Navigation

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY); // this is the position from the top of the viewport to the top of the original page
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky Navigation : Intersection Observer API

// const obsCallback = function (entires, observer) {
//   entires.forEach((entry) => console.log(entry));
// };

// const obsOptions = {
//   root: null, // as we are interested in the entire viewport
//   threshold: [0, 0.2], // 0 means the callback is called when threshold is passed when moving in and out of the view
//   // threshold of 1 means, the callback fn is only called when 100% of the target is visible in the viewport. which isnt possible in this case
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (entry.isIntersecting === false) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(
  stickyNav,
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`, // header gets height of nav as margin at the end. unit only in px, no %.
  } // when 0% of header is visible, we want something to happen
);

headerObserver.observe(header);
