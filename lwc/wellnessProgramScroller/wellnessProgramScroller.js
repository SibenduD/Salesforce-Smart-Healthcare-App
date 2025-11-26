import { LightningElement, wire } from 'lwc';
import getPrograms from '@salesforce/apex/WellnessProgramController.getPrograms';
import './wellnessProgramScroller.css'; // Import our new CSS file

export default class WellnessProgramScroller extends LightningElement {

    // Wire the Apex method to the 'programs' property
    @wire(getPrograms)
    programs;

}