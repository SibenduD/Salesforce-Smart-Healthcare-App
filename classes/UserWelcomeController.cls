/**
 * Controller: UserWelcomeController
 * Purpose: Gets the name of the logged-in user for the dynamic headline.
 */
public with sharing class UserWelcomeController {

    /**
     * Method: getLoggedInUserName
     * Called by: dynamicHeadline LWC
     * Purpose: Gets the first name of the user who is currently logged in.
     */
    @AuraEnabled(cacheable=true)
    public static User getLoggedInUser() {
        return [
            SELECT FirstName 
            FROM User 
            WHERE Id = :UserInfo.getUserId()
            LIMIT 1
        ];
    }
}