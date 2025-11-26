/**
 * Controller: PatientDashboardController
 * Purpose: Gets all personalized data for the Patient Dashboard LWC.
 * This class runs "without sharing" to ensure a logged-in portal user
 * can see their *own* related records, bypassing complex sharing.
 */
public without sharing class PatientDashboardController {

    /**
     * This is a "Wrapper" or "Container" class. It holds all the
     * different data we want to send to the LWC in one package.
     */
    public class DashboardData {
        @AuraEnabled public Contact patient { get; set; }
        @AuraEnabled public List<Appointment__c> upcomingAppointments { get; set; }
        @AuraEnabled public List<Patient_Pathway__c> activePathways { get; set; }
        @AuraEnabled public Integer overdueProgramCount { get; set; }
    }

    /**
     * Method: getDashboardData
     * Called by: patientDashboard LWC
     * Purpose: Gets all data for the logged-in patient.
     */
    @AuraEnabled(cacheable=true)
    public static DashboardData getDashboardData() {
        
        DashboardData data = new DashboardData();
        Id currentUserId = UserInfo.getUserId();
        
        // 1. Get the Patient's Contact record
        data.patient = [
            SELECT Id, Name 
            FROM Contact 
            WHERE Id IN (SELECT ContactId FROM User WHERE Id = :currentUserId)
            LIMIT 1
        ];

        // 2. Get Upcoming Appointments
        data.upcomingAppointments = [
            SELECT Id, Name, Visit_Date__c
            FROM Appointment__c
            WHERE Patient__c = :data.patient.Id
            AND Visit_Date__c >= TODAY
            ORDER BY Visit_Date__c ASC
            LIMIT 3
        ];
        
        // 3. Get Active Health Programs
        // --- THIS QUERY IS NOW CORRECTED ---
        data.activePathways = [
            SELECT Id, Name, Immunization_Status__c, Dose_Number__c, 
                   Wellness_Program_Details__r.Name, 
                   Wellness_Program_Details__r.Total_Required_Doses__c
            FROM Patient_Pathway__c
            WHERE Patient__c = :data.patient.Id
            AND Immunization_Status__c IN ('Due', 'Upcoming', 'Overdue')
            ORDER BY Immunization_Status__c
        ];
        
        // 4. Get a count of overdue programs for the "Alerts"
        // --- THIS QUERY IS NOW CORRECTED ---
        data.overdueProgramCount = [
            SELECT COUNT()
            FROM Patient_Pathway__c
            WHERE Patient__c = :data.patient.Id
            AND Immunization_Status__c = 'Overdue'
        ];
        
        return data;
    }
}