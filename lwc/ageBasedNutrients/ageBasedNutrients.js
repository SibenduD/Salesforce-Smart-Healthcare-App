import { LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import NUTRIENT_CHANNEL from '@salesforce/messageChannel/NutrientMessageChannel__c';

export default class AgeBasedNutrients extends LightningElement {
    @track age = 25; // Default age
    @track result = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.result = this.getNutrientData(this.age);
        this.publishMessage();
    }

    // --- RE-ADD this getter for the fill div ---
    get trackFillStyle() {
        const percentage = ((this.age - 1) / (80 - 1)) * 100;
        return `width: ${percentage}%`;
    }

    // --- REVERT this handler ---
    handleSliderChange(event) {
        this.age = event.target.value;
        this.result = this.getNutrientData(this.age);
        this.publishMessage();
    }

    // --- REMOVED updateSliderFill() ---

    publishMessage() {
        const nutrientKeys = this.result.nutrients.map(nutrient => nutrient.key);
        const payload = { 
            nutrientNames: nutrientKeys
        };
        publish(this.messageContext, NUTRIENT_CHANNEL, payload);
    }

    // This is our "database" of nutrient info
    getNutrientData(age) {
        if (age <= 10) {
            return {
                title: 'Focus for Children (1-10)',
                summary: 'Nutrients in this stage are critical for rapid growth and development of the brain and bones.',
                nutrients: [
                    { name: 'Calcium', key: 'calcium' },
                    { name: 'Vitamin D', key: 'vitD' },
                    { name: 'Iron', key: 'iron' }
                ]
            };
        } else if (age <= 18) {
            return {
                title: 'Focus for Teens (11-18)',
                summary: 'This is another period of fast growth. Focus is on bone health, energy, and hormonal changes.',
                nutrients: [
                    { name: 'Calcium', key: 'calcium' },
                    { name: 'Iron', key: 'iron' },
                    { name: 'Vitamin B12', key: 'vitB12' }
                ]
            };
        } else if (age <= 30) {
            return {
                title: 'Focus for Young Adults (19-30)',
                summary: 'Focus shifts to maintaining health, energy levels for active lifestyles, and nutrients for potential child-bearing years.',
                nutrients: [
                    { name: 'Folate (B9)', key: 'folate' },
                    { name: 'Iron', key: 'iron' },
                    { name: 'Vitamin D', key: 'vitD' }
                ]
            };
        } else if (age <= 50) {
            return {
                title: 'Focus for Adults (31-50)',
                summary: 'Focus is on long-term health, managing stress, and protecting bones and heart as metabolism begins to slow.',
                nutrients: [
                    { name: 'Magnesium', key: 'magnesium' },
                    { name: 'Vitamin D', key: 'vitD' },
                    { name: 'Calcium', key: 'calcium' }
                ]
            };
        } else {
            // Ages 51-80
            return {
                title: 'Focus for Older Adults (51+)',
                summary: 'Nutrient absorption can decrease with age. Focus is on maintaining bone density, brain health, and energy.',
                nutrients: [
                    { name: 'Vitamin B12', key: 'vitB12' },
                    { name: 'Vitamin D', key: 'vitD' },
                    { name: 'Calcium', key: 'calcium' }
                ]
            };
        }
    }
}