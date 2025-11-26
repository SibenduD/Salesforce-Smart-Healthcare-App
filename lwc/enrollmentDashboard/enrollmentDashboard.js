import { LightningElement, wire } from 'lwc';
import getEnrollmentProgress from '@salesforce/apex/EnrollmentDashboardController.getEnrollmentProgress';

export default class EnrollmentDashboard extends LightningElement {

    @wire(getEnrollmentProgress)
    wiredEnrollments;

    get isLoading() {
        return !this.wiredEnrollments.data && !this.wiredEnrollments.error;
    }

    get isEmpty() {
        return this.wiredEnrollments.data && this.wiredEnrollments.data.length === 0;
    }

    get enrollments() {
        if (this.wiredEnrollments.data) {
            
            return this.wiredEnrollments.data.map(prog => {
                let percentage = 0;
                
                // Calculate percentage (and prevent division by zero)
                if (prog.totalDoses > 0) {
                    percentage = Math.round((prog.currentDose / prog.totalDoses) * 100);
                }
                
                // Create the style string for the conic-gradient
                // This will look like: "background: conic-gradient(#FFD700 50%, #2a3b50 0)"
                const style = `background: conic-gradient(#FFD700 ${percentage}%, #2a3b50 0);`;

                return {
                    ...prog,
                    percentage: percentage,
                    progressText: `Dose ${prog.currentDose} of ${prog.totalDoses}`,
                    progressStyle: style
                };
            });
        }
        return null;
    }
}