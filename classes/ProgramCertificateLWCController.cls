public without sharing class ProgramCertificateLWCController {

    @AuraEnabled(cacheable=true)
    public static List<Patient_Pathway__c> getCompletedPrograms() {
        
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
            return new List<Patient_Pathway__c>();
        }

        if (patientContact == null) {
            return new List<Patient_Pathway__c>();
        }
        
        // 2. Return all COMPLETED programs for that patient
        return [
            SELECT Id, Date_Administered__c, Wellness_Program_Details__r.Name
            FROM Patient_Pathway__c
            WHERE Patient__c = :patientContact.Id
            AND Immunization_Status__c = 'Completed'
            ORDER BY Date_Administered__c DESC
        ];
    }
}