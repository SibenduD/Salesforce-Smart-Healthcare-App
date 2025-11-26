import { LightningElement, wire, track } from 'lwc';
import getAppointmentList from '@salesforce/apex/AppointmentDetailController.getAppointmentList';

export default class AppointmentDetailList extends LightningElement {

    @track expandedAppointmentId = ''; // Tracks which card is open

    @wire(getAppointmentList)
    wiredAppointments;

    get isLoading() {
        return !this.wiredAppointments.data && !this.wiredAppointments.error;
    }

    get isEmpty() {
        return this.wiredAppointments.data && this.wiredAppointments.data.length === 0;
    }

    // This getter processes the data for the HTML
    get appointments() {
        if (this.wiredAppointments.data) {
            return this.wiredAppointments.data.map(appt => {
                
                // Check if this card is the expanded one
                const isExpanded = appt.Id === this.expandedAppointmentId;

                // Assign a CSS class based on the approval status
                let statusClass = 'status-pill';
                if (appt.Approval_Status__c === 'Approved') {
                    statusClass += ' pill-approved';
                } else if (appt.Approval_Status__c === 'Pending') {
                    statusClass += ' pill-pending';
                } else if (appt.Approval_Status__c === 'Rejected') {
                    statusClass += ' pill-rejected';
                }

                // Safely get the doctor's name
                const doctorName = appt.Assigned_Health_Workers__r ? appt.Assigned_Health_Workers__r.Name : '';

                // Return a new object with our new properties
                return {
                    ...appt, // Spread all original fields
                    doctorName: doctorName,
                    statusClass: statusClass,
                    // Dynamic classes for expansion
                    contentClass: isExpanded ? 'card-content is-expanded' : 'card-content',
                    chevronClass: isExpanded ? 'chevron is-rotated' : 'chevron'
                };
            });
        }
        return null;
    }

    // --- NEW CLICK HANDLER ---
    handleCardClick(event) {
        const clickedId = event.currentTarget.dataset.id;
        
        // If the clicked card is already open, close it
        if (this.expandedAppointmentId === clickedId) {
            this.expandedAppointmentId = '';
        } else {
            // Otherwise, open the clicked card
            this.expandedAppointmentId = clickedId;
        }
    }
}