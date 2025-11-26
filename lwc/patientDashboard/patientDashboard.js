import { LightningElement, wire, track } from 'lwc';
import getDashboardData from '@salesforce/apex/PatientDashboardController.getDashboardData';
import { NavigationMixin } from 'lightning/navigation';
import './patientDashboard.css'; // Import the new CSS

export default class PatientDashboard extends NavigationMixin(LightningElement) {

    // --- THIS IS THE FIX ---
    // We initialize dashboardData with a *default, empty shape*.
    // This prevents the component from crashing when it first loads.
    @track dashboardData = {
        data: {
            patient: { Name: 'Welcome' }, // Default "Hello"
            overdueProgramCount: 0,
            upcomingAppointments: [],
            activePathways: []
        }
    };
    @track error;
    hasLoaded = false; // This will track the *real* data load

    // This @wire gets the real data for the logged-in patient.
    @wire(getDashboardData)
    wiredData({ error, data }) {
        if (data) {
            // Real data has arrived, update the component
            this.dashboardData = { data: data };
            this.error = undefined;
            this.hasLoaded = true;
        } else if (error) {
            // An error occurred (e.g., Admin view)
            this.error = error;
            // We keep the default data so the component still *looks* right
            // but we can log the error.
            console.error('patientDashboard Error:', error);
            this.hasLoaded = true;
        }
    }

    // A "getter" to show the loading spinner
    get isLoading() {
        // Only show spinner on the *very first load*
        return !this.hasLoaded;
    }

    // --- Getters ---
    // These are now 100% safe because 'dashboardData.data' always exists.
    
    get patientName() {
        // If the patient is null (like for an Admin), it will return a blank string
        return this.dashboardData.data.patient ? this.dashboardData.data.patient.Name : 'Member';
    }

    get overdueCount() {
        return this.dashboardData.data.overdueProgramCount;
    }

    get hasOverdueItems() {
        return this.overdueCount > 0;
    }

    get upcomingAppointments() {
        return this.dashboardData.data.upcomingAppointments;
    }
    
    get hasUpcomingAppointments() {
        return this.upcomingAppointments.length > 0;
    }

    get activePathways() {
        return this.dashboardData.data.activePathways;
    }

    get hasActivePrograms() {
        return this.activePathways.length > 0;
    }

    // --- Navigation ---
    
    navigateToAppointments() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Appointment__c',
                actionName: 'list'
            }
        });
    }
}