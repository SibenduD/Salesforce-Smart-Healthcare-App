import { LightningElement, wire } from 'lwc';
import getLoggedInUserDetails from '@salesforce/apex/CustomUserProfileController.getLoggedInUserDetails';

export default class CustomUserProfile extends LightningElement {

    @wire(getLoggedInUserDetails)
    wiredUser;

    get user() {
        return this.wiredUser.data;
    }

    get managerName() {
        if (this.user && this.user.Manager) {
            return this.user.Manager.Name;
        }
        return null;
    }

    get address() {
        if (this.user && this.user.Street) {
            // Build a formatted address string
            const parts = [
                this.user.Street,
                this.user.City,
                this.user.State,
                this.user.PostalCode,
                this.user.Country
            ];
            // Filter out any blank parts and join them with a comma
            return parts.filter(part => part).join(', ');
        }
        return null;
    }
}