import { LightningElement, wire } from 'lwc';
import getVaccinationStats from '@salesforce/apex/VaccinationDashboardController.getVaccinationStats';

export default class VaccinationDashboard extends LightningElement {

    @wire(getVaccinationStats)
    wiredStats;

    get stats() {
        return this.wiredStats.data;
    }

    get isLoading() {
        return !this.wiredStats.data && !this.wiredStats.error;
    }

    get totalCount() {
        return this.wiredStats.data ? this.wiredStats.data.totalCount : 0;
    }

    get pendingCount() {
        return this.wiredStats.data ? this.wiredStats.data.pendingCount : 0;
    }

    get breachCount() {
        return this.wiredStats.data ? this.wiredStats.data.breachCount : 0;
    }
}