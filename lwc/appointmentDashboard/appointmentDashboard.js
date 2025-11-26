import { LightningElement, wire, track } from 'lwc';
import getAppointmentsForPatient from '@salesforce/apex/AppointmentDashboardController.getAppointmentsForPatient';

export default class AppointmentDashboard extends LightningElement {
    @track totalVisits = 0;
    @track highRiskCount = 0;
    @track upcomingFollowups = 0;
    
    hasData = false; // Used for the spinner

    @wire(getAppointmentsForPatient)
    wiredVisits({ error, data }) {
        if (data) {
            // Set counts based on the data
            this.totalVisits = data.length;
            this.highRiskCount = data.filter(v => v.High_Risk__c === true).length;
            
            // Get today's date (at midnight) for comparison
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            this.upcomingFollowups = data.filter(v => 
                v.Next_Follow_up_Date__c && new Date(v.Next_Follow_up_Date__c) >= today
            ).length;
            
            this.hasData = true; // Hide spinner
            
        } else if (error) {
            console.error('Error fetching appointments:', error);
            this.hasData = true; // Hide spinner even on error
        }
    }
}