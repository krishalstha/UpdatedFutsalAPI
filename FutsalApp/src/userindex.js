document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider-container img');
    const prevButton = document.querySelector('.slider-btn.prev');
    const nextButton = document.querySelector('.slider-btn.next');

    let currentSlide = 0;

    function showSlide(index) {
        const totalSlides = slides.length;
        currentSlide = (index + totalSlides) % totalSlides; // Loop through slides
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;    
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Auto-slide every 3 seconds
    setInterval(nextSlide, 3000); // Automatically go to the next slide every 3 seconds
});