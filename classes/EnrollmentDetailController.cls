/*
 * This class uses "without sharing" to find the patient's
 * records, which is the correct pattern.
 */
public without sharing class EnrollmentDetailController {

    @AuraEnabled(cacheable=true)
    public static List<Patient_Pathway__c> getEnrollmentList() {
        
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
            return new List<Patient_Pathway__c>();
        }

        if (patientContact == null) {
            return new List<Patient_Pathway__c>();
        }
        
        // 2. Return all program enrollments for that patient
        return [
            SELECT Id, Name, Immunization_Status__c, Dose_Number__c, 
                   Due_Date__c, Date_Administered__c,
                   Wellness_Program_Details__r.Name, 
                   Wellness_Program_Details__r.Total_Required_Doses__c
            FROM Patient_Pathway__c
            WHERE Patient__c = :patientContact.Id
            ORDER BY Due_Date__c DESC
        ];
    }
}