/*
 * This class uses "without sharing" to find the patient's
 * records, which is the correct pattern.
 */
public without sharing class AppointmentDashboardController {

    @AuraEnabled(cacheable=true)
    public static List<Appointment__c> getAppointmentsForPatient() {
        
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
        
        // 2. Return ALL appointments for that patient
        // We will count them in JavaScript
        return [
            SELECT Id, High_Risk__c, Next_Follow_up_Date__c
            FROM Appointment__c
            WHERE Patient__c = :patientContact.Id
        ];
    }
}