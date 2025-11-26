public without sharing class VaccinationDashboardController {

    // This "wrapper class" holds all the stats
    public class VaccinationStats {
        @AuraEnabled public Integer totalCount { get; set; }
        @AuraEnabled public Integer pendingCount { get; set; }
        @AuraEnabled public Integer breachCount { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static VaccinationStats getVaccinationStats() {
        VaccinationStats stats = new VaccinationStats();
        stats.totalCount = 0;
        stats.pendingCount = 0;
        stats.breachCount = 0;
        
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
            // If no contact is found, return the zeroed stats
            return stats;
        }

        if (patientContact == null) {
            return stats;
        }
        
        String patientContactId = patientContact.Id;
        
        // 2. Get all vaccination records for that patient
        List<Vaccination_Record__c> records = [
            SELECT Id, Approval_Status__c, Cold_Chain_Breach__c
            FROM Vaccination_Record__c
            WHERE Patient__c = :patientContactId
        ];
        
        // 3. Count the stats
        stats.totalCount = records.size();
        
        for (Vaccination_Record__c rec : records) {
            
            // --- THIS IS THE FIX ---
            // The API name is 'Pending Approval', not 'Pending'
            if (rec.Approval_Status__c == 'Pending Approval') {
                stats.pendingCount += 1;
            }
            // --- END FIX ---

            if (rec.Cold_Chain_Breach__c == true) {
                stats.breachCount += 1;
            }
        }
        
        return stats;
    }
}