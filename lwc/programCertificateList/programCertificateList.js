import { LightningElement, wire } from 'lwc';
import getCompletedPrograms from '@salesforce/apex/ProgramCertificateLWCController.getCompletedPrograms';

export default class ProgramCertificateList extends LightningElement {

    @wire(getCompletedPrograms)
    wiredPrograms;

    get isLoading() {
        return !this.wiredPrograms.data && !this.wiredPrograms.error;
    }

    get isEmpty() {
        return this.wiredPrograms.data && this.wiredPrograms.data.length === 0;
    }

    get completedPrograms() {
        if (this.wiredPrograms.data) {
            return this.wiredPrograms.data.map(prog => {
                
                // Format the date nicely for the card
                const formattedDate = new Date(prog.Date_Administered__c).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                // This is the link to the VF page
                const pdfUrl = '/apex/VFP_ProgramCertificate?id=' + prog.Id;

                return {
                    ...prog,
                    programName: prog.Wellness_Program_Details__r.Name,
                    completionDate: formattedDate,
                    pdfUrl: pdfUrl
                };
            });
        }
        return null;
    }
}