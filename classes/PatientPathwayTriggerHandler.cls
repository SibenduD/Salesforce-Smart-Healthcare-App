public with sharing class PatientPathwayTriggerHandler {

    /**
     * Method to validate age requirements before inserting records.
     * @param newPathways - List of new Patient_Pathway__c records (Trigger.new)
     */
    public static void validateMinimumAge(List<Patient_Pathway__c> newPathways) {
        
        // === Step 1: Collect all related IDs from the incoming records ===
        Set<Id> healthProgramIds = new Set<Id>();
        Set<Id> patientIds = new Set<Id>();
        
        for (Patient_Pathway__c pe : newPathways) {
            if (pe.Wellness_Program_Details__c != null) {
                healthProgramIds.add(pe.Wellness_Program_Details__c);
            }
            if (pe.Patient__c != null) {
                patientIds.add(pe.Patient__c);
            }
        }

        // If there are no relevant IDs, exit early to save resources
        if (healthProgramIds.isEmpty() || patientIds.isEmpty()) {
            return;
        }

        // === Step 2: Perform queries to get related data (BULKIFIED) ===
        
        // Query for the Wellness Programs to get their minimum age requirements
        Map<Id, Wellness_Program__c> healthProgramsMap = new Map<Id, Wellness_Program__c>([
            SELECT Id, Minimum_Age__c 
            FROM Wellness_Program__c 
            WHERE Id IN :healthProgramIds
        ]);

        // Query for the Patients (Contacts) to get their ages
        Map<Id, Contact> patientsMap = new Map<Id, Contact>([
            SELECT Id, Age__c 
            FROM Contact 
            WHERE Id IN :patientIds
        ]);

        // === Step 3: Loop through the new enrollments and perform the validation ===
        for (Patient_Pathway__c pe : newPathways) {
            
            // Get the related records from our maps
            Wellness_Program__c relatedProgram = healthProgramsMap.get(pe.Wellness_Program_Details__c);
            Contact patient = patientsMap.get(pe.Patient__c);

            // Ensure we have the data needed for validation
            if (patient != null && relatedProgram != null && patient.Age__c != null) {
                
                // Check if Minimum Age is defined on the program to avoid null pointer exceptions
                if (relatedProgram.Minimum_Age__c != null) {
                    if (patient.Age__c < relatedProgram.Minimum_Age__c) {
                        // If the patient is too young, add an error to block the save
                        pe.addError('This patient is too young for the selected health program. Minimum age is ' + relatedProgram.Minimum_Age__c);
                    }
                }
            }
        }
    }
}