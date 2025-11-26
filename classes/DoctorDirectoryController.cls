/**
 * Controller: DoctorDirectoryController
 * Purpose: Gets the list of Doctors for the 'doctorDirectory' LWC.
 */
public with sharing class DoctorDirectoryController {

    /**
     * Method: getDoctors
     * Called by: doctorDirectory LWC
     * Purpose: Gets all Contacts with the 'Doctor' record type.
     */
    @AuraEnabled(cacheable=true)
    public static List<Contact> getDoctors() {
        return [
            SELECT 
                Id, 
                Name, 
                Phone, 
                Email, 
                Specialty__c, 
                Photo_URL__c, 
                Biography__c 
            FROM Contact
            WHERE RecordType.Name = 'Doctor'
            ORDER BY Name
            LIMIT 12
        ];
    }
}