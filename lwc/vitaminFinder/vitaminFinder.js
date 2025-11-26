import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import NUTRIENT_CHANNEL from '@salesforce/messageChannel/NutrientMessageChannel__c';

export default class VitaminFinder extends LightningElement {
    @track selectedVitaminId = '';
    @track selectedVitamin = null;

    @track isFilteredByAge = false; 
    @track nutrientButtons = [];   
    subscription = null;

    // --- NEW properties for custom dropdown ---
    @track isDropdownOpen = false;
    @track selectedLabel = 'Choose one...';
    
    @wire(MessageContext)
    messageContext;

    // The vitamin "database" (unchanged)
    vitaminData = new Map([
        ['vitA', { name: 'Vitamin A', description: 'Essential for healthy vision, your immune system, and skin.', sources: 'Carrots, sweet potatoes, spinach, kale, and liver.' }],
        ['vitC', { name: 'Vitamin C', description: 'An antioxidant that helps protect cells and is vital for wound healing and absorbing iron.', sources: 'Citrus fruits (oranges, lemons), bell peppers, strawberries, broccoli.' }],
        ['vitD', { name: 'Vitamin D', description: 'The "sunshine vitamin." It\'s crucial for absorbing calcium and building strong bones.', sources: 'Sunlight on your skin, fatty fish (salmon, mackerel), and fortified foods.' }],
        ['vitE', { name: 'Vitamin E', description: 'An antioxidant that helps protect your cells from damage. It also supports immune function.', sources: 'Nuts (almonds, peanuts), seeds (sunflower), and vegetable oils.' }],
        ['vitK', { name: 'Vitamin K', description: 'Essential for blood clotting (which helps wounds heal) and also contributes to bone health.', sources: 'Leafy green vegetables (spinach, kale, broccoli, lettuce).' }],
        ['iron', { name: 'Iron', description: 'A mineral that your body needs to make hemoglobin, a protein in red blood cells that carries oxygen.', sources: 'Red meat, beans, lentils, spinach, and fortified cereals.' }],
        ['calcium', { name: 'Calcium', description: 'Critical for building and maintaining strong bones and teeth. Also helps with muscle and nerve function.', sources: 'Dairy (milk, cheese, yogurt), leafy greens (kale), and fortified foods.' }],
        ['vitB12', { name: 'Vitamin B12', description: 'Needed to form red blood cells and DNA. It is also a key player in the function of the brain and nerve cells.', sources: 'Meat, fish, poultry, eggs, and dairy products.' }],
        ['folate', { name: 'Folate (B9)', description: 'Crucial for cell growth and forming DNA. Especially important for women of child-bearing age.', sources: 'Leafy green vegetables, legumes, and fortified grains.' }],
        ['magnesium', { name: 'Magnesium', description: 'Helps with muscle and nerve function, regulating blood pressure, and supporting the immune system.', sources: 'Nuts, seeds, whole grains, and leafy green vegetables.' }]
    ]);

    // This getter is used for the custom dropdown list
    get vitaminOptions() {
        return Array.from(this.vitaminData.keys()).map(key => {
            return { label: this.vitaminData.get(key).name, value: key };
        });
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                NUTRIENT_CHANNEL,
                (message) => this.handleMessage(message)
            );
        }
    }

    // This is the listener that runs when a message is received
    handleMessage(message) {
        const nutrientKeys = message.nutrientNames; 
        this.nutrientButtons = nutrientKeys.map(key => {
            const vitamin = this.vitaminData.get(key);
            if (vitamin) {
                return { label: vitamin.name, key: key };
            }
            return null; 
        }).filter(button => button !== null);

        this.isFilteredByAge = true;
        this.selectedVitamin = null;
        this.isDropdownOpen = false; // Close dropdown if open
    }

    // --- NEW HANDLERS for custom dropdown ---
    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    handleOptionClick(event) {
        const value = event.currentTarget.dataset.value;
        const label = event.currentTarget.dataset.label;
        
        this.selectedVitaminId = value;
        this.selectedLabel = label;
        this.selectedVitamin = this.vitaminData.get(value);
        this.isDropdownOpen = false; // Close dropdown
    }

    // This runs when a user clicks one of the pill buttons
    handleNutrientButtonClick(event) {
        const key = event.target.dataset.key;
        this.selectedVitaminId = key;
        this.selectedVitamin = this.vitaminData.get(key);
    }
    
    // This runs when the "Show All" link is clicked
    handleResetFinder(event) {
        event.preventDefault(); 
        this.isFilteredByAge = false;
        this.selectedVitaminId = '';
        this.selectedVitamin = null;
        this.nutrientButtons = [];
        this.selectedLabel = 'Choose one...'; // Reset label
    }
}