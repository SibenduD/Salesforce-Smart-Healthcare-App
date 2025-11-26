import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class PortalFooter extends NavigationMixin(LightningElement) {

    // Get the current year automatically for the copyright
    get currentYear() {
        return new Date().getFullYear();
    }

    // --- Navigation Handlers ---

    navigateToHome(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            }
        });
    }

    navigateToDoctors(event) {
        event.preventDefault();
        // This assumes your page API Name is 'home'.
        // We will update this later to point to a new "Doctors" page.
        // For now, it just goes to the home page.
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home' 
                // TODO: Change to 'find-a-doctor' page later
            }
        });
    }

    navigateToArticles(event) {
        event.preventDefault();
        // This also goes to the home page for now,
        // since the articles are on the home page.
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            }
        });
    }
}