/*
 * This class uses "without sharing" to find the patient's
 * records, which is the correct pattern.
 */
public without sharing class AppointmentDetailController {

    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> getAppointmentList() {
        
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
            return new List<Appointment__c>();
        }

        if (patientContact == null) {
            return new List<Appointment__c>();
        }
        
        // 2. Return all appointments for that patient
        // We will sort by most recent visit first
        return [
            SELECT Id, Name, Visit_Date__c, Assigned_Health_Workers__r.Name, 
                   Next_Follow_up_Date__c, Approval_Status__c, High_Risk__c, 
                   Screening_Outcome__c
            FROM Appointment__c
            WHERE Patient__c = :patientContact.Id
            ORDER BY Visit_Date__c DESC
        ];
    }
}