import { LightningElement, wire, track } from 'lwc';
import getDoctors from '@salesforce/apex/DoctorDirectoryController.getDoctors';

export default class DoctorDirectory extends LightningElement {
    
    @track doctorSlides = [];
    @track paginationDots = [];
    @track currentIndex = 0;
    error;
    isLoading = true;
    
    @wire(getDoctors)
    wiredDoctors({ error, data }) {
        if (data) {
            this.isLoading = false;
            // Map the data and give each slide its initial class
            this.doctorSlides = data.map((doc, index) => ({
                ...doc,
                index: index,
                slideClass: this.getSlideClass(index, 0)
                // Removed the 'photoUrl' getter
            }));
            this.updatePaginationDots(0);
            this.error = undefined;
        } else if (error) {
            this.isLoading = false;
            this.error = error;
            this.doctorSlides = [];
        }
    }

    // --- SLIDER LOGIC ---

    handlePrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlidesAndDots();
        }
    }

    handleNext() {
        if (this.currentIndex < (this.doctorSlides.length - 1)) {
            this.currentIndex++;
            this.updateSlidesAndDots();
        }
    }

    handleDotClick(event) {
        this.currentIndex = parseInt(event.target.dataset.index, 10);
        this.updateSlidesAndDots();
    }

    /**
     * This is the core logic. It loops through all slides and
     * applies the correct class to each one.
     */
    updateSlidesAndDots() {
        this.doctorSlides = this.doctorSlides.map(doc => ({
            ...doc,
            slideClass: this.getSlideClass(doc.index, this.currentIndex)
        }));
        this.updatePaginationDots(this.currentIndex);
    }

    /**
     * Helper to determine the class for a slide
     */
    getSlideClass(slideIndex, activeIndex) {
        if (slideIndex === activeIndex) {
            return 'slide is-active';
        }
        if (slideIndex === activeIndex - 1) {
            return 'slide is-prev';
        }
        if (slideIndex === activeIndex + 1) {
            return 'slide is-next';
        }
        return 'slide'; // Default, hidden slides
    }

    /**
     * Helper to update the pagination dots
     */
    updatePaginationDots(activeIndex) {
        this.paginationDots = this.doctorSlides.map((doc, index) => ({
            index: index,
            class: index === activeIndex ? 'dot active' : 'dot'
        }));
    }

    // --- GETTERS FOR TEMPLATE ---

    get hasDoctors() {
        return this.doctorSlides && this.doctorSlides.length > 0;
    }

    get showPrevButton() {
        return this.currentIndex > 0;
    }

    get showNextButton() {
        return this.currentIndex < (this.doctorSlides.length - 1);
    }
}