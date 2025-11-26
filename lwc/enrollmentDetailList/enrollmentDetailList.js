import { LightningElement, wire, track } from 'lwc';
import getEnrollmentList from '@salesforce/apex/EnrollmentDetailController.getEnrollmentList';

export default class EnrollmentDetailList extends LightningElement {

    @track expandedRecordId = ''; // Tracks which card is open

    @wire(getEnrollmentList)
    wiredEnrollments;

    get isLoading() {
        return !this.wiredEnrollments.data && !this.wiredEnrollments.error;
    }

    get isEmpty() {
        return this.wiredEnrollments.data && this.wiredEnrollments.data.length === 0;
    }

    get enrollments() {
        if (this.wiredEnrollments.data) {
            return this.wiredEnrollments.data.map(enroll => {
                
                const isExpanded = enroll.Id === this.expandedRecordId;
                const program = enroll.Wellness_Program_Details__r;

                // --- Calculate Percentage ---
                let percentage = 0;
                let totalDoses = 0;
                if (program && program.Total_Required_Doses__c > 0) {
                    totalDoses = program.Total_Required_Doses__c;
                    // Handle completed
                    if (enroll.Immunization_Status__c === 'Completed') {
                        percentage = 100;
                    }
                    // Handle active
                    else if (enroll.Dose_Number__c > 0) {
                        percentage = Math.round(((enroll.Dose_Number__c - 1) / totalDoses) * 100);
                    }
                }
                
                // --- Assign Status Pill Class ---
                let statusClass = 'status-pill';
                if (enroll.Immunization_Status__c === 'Completed') {
                    statusClass += ' pill-completed';
                } else if (enroll.Immunization_Status__c === 'Upcoming') {
                    statusClass += ' pill-upcoming';
                } else if (enroll.Immunization_Status__c === 'Overdue') {
                    statusClass += ' pill-overdue';
                } else {
                    statusClass += ' pill-due';
                }

                return {
                    ...enroll,
                    programName: program ? program.Name : 'Health Program',
                    totalDoses: totalDoses,
                    percentage: percentage,
                    statusClass: statusClass,
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
        
        if (this.expandedRecordId === clickedId) {
            this.expandedRecordId = '';
        } else {
            this.expandedRecordId = clickedId;
        }
    }
}