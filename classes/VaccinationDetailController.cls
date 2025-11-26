/*
 * This class uses "without sharing" to find the patient's
 * records, which is the correct pattern.
 */
public without sharing class VaccinationDetailController {

    @AuraEnabled(cacheable=true)
    public static List<Vaccination_Record__c> getVaccinationList() {
        
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
            // If no contact is found, return an empty list
            return new List<Vaccination_Record__c>();
        }

        if (patientContact == null) {
            return new List<Vaccination_Record__c>();
        }
        
        // 2. Return all vaccination records for that patient
        // We will sort by most recent date first
        return [
            SELECT Id, Name, Date_Administered__c, Approval_Status__c,
                   Cold_Chain_Breach__c, Supervisor_Override__c,
                   Program_Enrollment__r.Name, Related_Visit__r.Name 
            FROM Vaccination_Record__c
            WHERE Patient__c = :patientContact.Id
            ORDER BY Date_Administered__c DESC
        ];
    }
}