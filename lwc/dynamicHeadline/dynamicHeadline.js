import { LightningElement, wire, track } from 'lwc';
import getLoggedInUser from '@salesforce/apex/UserWelcomeController.getLoggedInUser';

// This is our list of rotating health messages
const MESSAGES = [
    'A little progress each day adds up to big results.',
    'Remember to take a moment to stretch and hydrate.',
    'Your health is an investment, not an expense.',
    'A healthy outside starts from the inside.',
    'Be kind to your body, and your body will be kind to you.'
];

export default class DynamicHeadline extends LightningElement {
    
    @track userName = 'Patient'; // Default name
    @track rotatingMessage = '';

    // Get the logged-in user's data
    @wire(getLoggedInUser)
    wiredUser({ error, data }) {
        if (data) {
            this.userName = data.FirstName;
        } else if (error) {
            console.error('Error fetching user name:', error);
            this.userName = 'Member'; // Fallback name
        }
    }

    // This runs when the component first loads
    connectedCallback() {
        // Pick one of the messages at random
        this.rotatingMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    }

    // This "getter" calculates the time-based greeting
    get greeting() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) { // 5am to 11:59am
            return 'Good morning';
        } else if (hour >= 12 && hour < 18) { // 12pm to 5:59pm
            return 'Good afternoon';
        } else { // 6pm to 4:59am
            return 'Good evening';
        }
    }

    // --- THIS IS THE NEW GETTER FOR THE ICON ---
    get greetingIcon() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            return '☀️'; // Sun
        } else if (hour >= 12 && hour < 18) {
            return '🌤️'; // Sun behind cloud
        } else {
            return '🌙'; // Moon
        }
    }

    // --- THIS IS THE NEW GETTER FOR HOVER-TEXT ---
    get greetingTitle() {
        // This is for accessibility (screen readers and hover text)
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            return 'Good morning!';
        } else if (hour >= 12 && hour < 18) {
            return 'Good afternoon!';
        } else {
            return 'Good evening!';
        }
    }
}