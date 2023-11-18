const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');
const dotsContainer = document.querySelector('.dots');

const SLIDE_WIDTH = 600;

let currentSlide = 0;

function changeSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    activateDot(currentSlide);
    updateCarouselPosition(currentSlide);
}

function updateCarouselPosition(index) {
    carousel.style.transform = `translateX(-${index * SLIDE_WIDTH}px)`;
}

function activateDot(index) {
    const dots = [...dotsContainer.children];
    dots.forEach((dot) => dot.classList.remove('active'));
    dots.find((dot) => dot.dataset.index == index).classList.add('active');
}

activateDot(currentSlide);

prevBtn.addEventListener('click', () => changeSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => changeSlide(currentSlide + 1));
dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        const index = +e.target.dataset.index || 0;
        changeSlide(index);
    }
});

