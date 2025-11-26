public with sharing class CustomUserProfileController {

    @AuraEnabled(cacheable=true)
    public static User getLoggedInUserDetails() {
        Id userId = UserInfo.getUserId();
        
        // This query is secure because the user is only asking for their OWN record.
        // It fetches all the fields seen in your screenshot.
        return [
            SELECT 
                Name, 
                Title, 
                Email, 
                Phone, 
                MobilePhone, 
                CompanyName, 
                AboutMe, 
                Street, 
                City, 
                State, 
                PostalCode, 
                Country,
                FullPhotoUrl, 
                Manager.Name 
            FROM User 
            WHERE Id = :userId 
            LIMIT 1
        ];
    }
}