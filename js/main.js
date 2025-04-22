//! Slider

class Slider {
	constructor() {
		this.container = document.querySelector('.slider-container');
		this.slider = document.querySelector('.slider');
		this.cursor = document.querySelector('.custom-cursor');
		this.slideWidth = window.innerWidth < 768 
    		? this.container.clientWidth - 10 // 5px padding levo i desno = 10px ukupno
    		: 368;

		//note ovo je bilo dobro this.slideWidth = window.innerWidth < 768 ? this.container.offsetWidth : 368;
		//note this.slideWidth treba da je 400 ako je .slide {margin: 0 0} // 400px + 20px margin ()
		//note this.slideWidth = 368; 

		// Configuration des images
		this.images = [
		   "img/hero-slider/slider-1.jpg",
			"img/hero-slider/slider-2.jpg",
			"img/hero-slider/slider-3.jpg",
			"img/hero-slider/slider-4.jpg",
		];
		
		this.currentIndex = this.images.length;
		this.isAnimating = false;
		
		this.init();
	}

	init() {
		this.createSlides();
		this.setupEventListeners();
		this.positionSlides();
		this.startAutoplay();
	}

	createSlides() {
		// Créer trois fois le nombre d'images pour un défilement infini fluide
		const totalSlides = this.images.length * 3;
		for (let i = 0; i < totalSlides; i++) {
			const index = i % this.images.length;
			const slide = document.createElement('div');
			slide.className = 'slide';
			slide.innerHTML = `<img src="../${this.images[index]}" alt="Slide ${index + 1}">`;
			this.slider.appendChild(slide);
		}
	}

	positionSlides() {
		const slides = this.slider.querySelectorAll('.slide');
		const offset = (this.container.offsetWidth - this.slideWidth) / 2;
		const baseTransform = -this.currentIndex * this.slideWidth + offset;
		
		this.slider.style.transform = `translateX(${baseTransform}px)`;
		
		// Mettre à jour la slide active
		slides.forEach((slide, index) => {
			const normalizedIndex = this.normalizeIndex(index);
			slide.classList.toggle('active', normalizedIndex === this.currentIndex % this.images.length);
		});
	}

	normalizeIndex(index) {
		return index % this.images.length;
	}

	moveSlides(direction) {
		if (this.isAnimating) return;
		this.isAnimating = true;

		const slides = this.slider.querySelectorAll('.slide');
		this.currentIndex += direction;

		// Animer le mouvement
		this.slider.style.transition = 'transform 0.3s ease-out';
		this.positionSlides();

		// Réinitialiser la position si nécessaire
		if (this.currentIndex >= this.images.length * 2 || this.currentIndex <= this.images.length - 1) {
			setTimeout(() => {
				this.slider.style.transition = 'none';
				this.currentIndex = this.currentIndex >= this.images.length * 2 
					? this.currentIndex - this.images.length 
					: this.currentIndex + this.images.length;
				this.positionSlides();
			}, 300);
		}

		setTimeout(() => {
			this.isAnimating = false;
		}, 300);
	}

	setupEventListeners() {
		// Mouvement du curseur
		document.addEventListener('mousemove', (e) => {
			this.cursor.style.left = `${e.clientX - 25}px`;
			this.cursor.style.top = `${e.clientY - 25}px`;

			const rect = this.container.getBoundingClientRect();
			const isLeft = e.clientX < rect.left + rect.width / 2;
			
			this.cursor.classList.toggle('left', isLeft);
			this.cursor.classList.toggle('right', !isLeft);
		});

		// Interaction avec le slider
		this.container.addEventListener('mouseenter', () => {
			this.cursor.style.opacity = '1';
			this.stopAutoplay();
		});

		this.container.addEventListener('mouseleave', () => {
			this.cursor.style.opacity = '0';
			this.startAutoplay();
		});

		this.container.addEventListener('click', (e) => {
			const rect = this.container.getBoundingClientRect();
			const isLeft = e.clientX < rect.left + rect.width / 2;
			
			this.moveSlides(isLeft ? -1 : 1);
			
			// Animation du curseur
			this.cursor.classList.add('active');
			setTimeout(() => this.cursor.classList.remove('active'), 300);
		});
		
		// Ajuster au redimensionnement
		window.addEventListener('resize', () => this.positionSlides());
	}

	startAutoplay() {
		this.stopAutoplay();
		this.autoplayInterval = setInterval(() => {
			this.moveSlides(1);
		}, 3000);
	}

	stopAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
		}
	}
}

// Initialiser le slider quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
	new Slider();
});

/*------------------
	Navigation
--------------------*/
$(".nav-switch").on('click', function (e) {
	e.preventDefault();
	$(".slicknav_btn").click();
});

$('.nav__menu').slicknav({
	appendTo: '.main__menu',
	openedSymbol: '<i class="fa fa-angle-up"></i>',
	closedSymbol: '<i class="fa fa-angle-right"></i>',
	label: '', // hides "MENU" text label
	init: function () {
		// Move DE/EN into the mobile menu after it's created
		$('.slicknav_nav').append('<li><a href="#" class="language-switch-mobile">DE/EN</a></li>');
	}
});



