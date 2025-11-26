public without sharing class EnrollmentDashboardController {

    // This "wrapper class" will hold the data for each progress circle
    public class ProgramProgress {
        @AuraEnabled public String programName { get; set; }
        @AuraEnabled public Decimal currentDose { get; set; }
        @AuraEnabled public Decimal totalDoses { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<ProgramProgress> getEnrollmentProgress() {
        
        List<ProgramProgress> progressList = new List<ProgramProgress>();
        
        // 1. Get the logged-in user's Contact ID
        Id currentUserId = UserInfo.getUserId();
        Contact patientContact;
        
        try {
            patientContact = [
                SELECT Id 
                FROM Contact 
                WHERE Id IN (SELECT ContactId FROM User WHERE Id = :currentUserId)
                LIMIT 1
            ];
        } catch (Exception e) {
            return progressList; // Return empty list
        }

        if (patientContact == null) {
            return progressList; // Return empty list
        }
        
        // 2. Get all ACTIVE program enrollments for that patient
        List<Patient_Pathway__c> enrollments = [
            SELECT Id, Dose_Number__c, 
                   Wellness_Program_Details__r.Name, 
                   Wellness_Program_Details__r.Total_Required_Doses__c
            FROM Patient_Pathway__c
            WHERE Patient__c = :patientContact.Id
            AND Immunization_Status__c != 'Completed'
        ];
        
        // 3. Create the wrapper objects for the LWC
        for (Patient_Pathway__c enrollment : enrollments) {
            // Ensure we have all the data needed to calculate
            if (enrollment.Wellness_Program_Details__r != null && 
                enrollment.Wellness_Program_Details__r.Total_Required_Doses__c != null &&
                enrollment.Dose_Number__c != null) {
                
                ProgramProgress prog = new ProgramProgress();
                prog.programName = enrollment.Wellness_Program_Details__r.Name;
                prog.currentDose = enrollment.Dose_Number__c;
                prog.totalDoses = enrollment.Wellness_Program_Details__r.Total_Required_Doses__c;
                progressList.add(prog);
            }
        }
        
        return progressList;
    }
}