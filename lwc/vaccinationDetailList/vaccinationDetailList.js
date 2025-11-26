import { LightningElement, wire, track } from 'lwc';
import getVaccinationList from '@salesforce/apex/VaccinationDetailController.getVaccinationList';

export default class VaccinationDetailList extends LightningElement {

    @track expandedRecordId = ''; // Tracks which card is open

    @wire(getVaccinationList)
    wiredVaccinations;

    get isLoading() {
        return !this.wiredVaccinations.data && !this.wiredVaccinations.error;
    }

    get isEmpty() {
        return this.wiredVaccinations.data && this.wiredVaccinations.data.length === 0;
    }

    // This getter processes the data for the HTML
    get vaccinations() {
        if (this.wiredVaccinations.data) {
            // Map the data to add extra properties
            return this.wiredVaccinations.data.map(vax => {
                
                // Check if this card is the expanded one
                const isExpanded = vax.Id === this.expandedRecordId;

                // Assign a CSS class based on the approval status
                let statusClass = 'status-pill';
                if (vax.Approval_Status__c === 'Approved') {
                    statusClass += ' pill-approved';
                } else if (vax.Approval_Status__c === 'Pending Approval') {
                    statusClass += ' pill-pending';
                } else if (vax.Approval_Status__c === 'Rejected') {
                    statusClass += ' pill-rejected';
                } else {
                    statusClass += ' pill-not-submitted';
                }

                // Safely get related names
                const programName = vax.Program_Enrollment__r ? vax.Program_Enrollment__r.Name : '';
                const visitName = vax.Related_Visit__r ? vax.Related_Visit__r.Name : '';

                // Return a new object with our new properties
                return {
                    ...vax, // Spread all original fields
                    programName: programName,
                    visitName: visitName,
                    statusClass: statusClass,
                    // Dynamic classes for expansion
                    contentClass: isExpanded ? 'card-content is-expanded' : 'card-content',
                    chevronClass: isExpanded ? 'chevron is-rotated' : 'chevron'
                };
            });
        }
        return null;
    }

    // --- CLICK HANDLER ---
    handleCardClick(event) {
        const clickedId = event.currentTarget.dataset.id;
        
        // If the clicked card is already open, close it
        if (this.expandedRecordId === clickedId) {
            this.expandedRecordId = '';
        } else {
            // Otherwise, open the clicked card
            this.expandedRecordId = clickedId;
        }
    }
}