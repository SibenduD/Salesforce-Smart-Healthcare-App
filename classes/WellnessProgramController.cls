/**
 * Controller: WellnessProgramController
 * Purpose: Gets the list of Wellness Programs for the 'wellnessProgramScroller' LWC.
 */
public with sharing class WellnessProgramController {

    /**
     * Method: getPrograms
     * Called by: wellnessProgramScroller LWC
     * Purpose: Gets all Wellness_Program__c records and their new fields.
     */
    @AuraEnabled(cacheable=true)
    public static List<Wellness_Program__c> getPrograms() {
        return [
            SELECT 
                Id, 
                Name, 
                Category__c, 
                Image_URL__c, 
                Short_Description__c 
            FROM Wellness_Program__c
            ORDER BY Name
            LIMIT 10
        ];
    }
}