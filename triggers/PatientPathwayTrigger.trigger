trigger PatientPathwayTrigger on Patient_Pathway__c (before insert) {
    
    // Check context to ensure we only run this logic on Before Insert
    if (Trigger.isBefore && Trigger.isInsert) {
        PatientPathwayTriggerHandler.validateMinimumAge(Trigger.new);
    }
    
}