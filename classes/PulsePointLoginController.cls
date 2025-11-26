/**
 * Controller: PulsePointLoginController
 * Purpose: Handles all logic for the Visualforce Login page.
 */
public with sharing class PulsePointLoginController {

    // --- Properties for Login ---
    public String username { get; set; }
    public String password { get; set; }

    /**
     * Constructor
     */
    public PulsePointLoginController() {
        // constructor
    }

    /**
     * Method: doLogin
     * Action: Called by the "Log In" button on the VF page.
     */
    public PageReference doLogin() {
        try {
            String siteUrl = [SELECT UrlPathPrefix FROM Network WHERE UrlPathPrefix = '/patienthealth'].UrlPathPrefix;
            
            PageReference loginResult = Site.login(username, password, siteUrl);

            if (loginResult != null) {
                // Success! Redirect the user to the portal's home page.
                return loginResult;
            } else {
                addError('An unknown error occurred. Please try again.');
                return null;
            }

        } catch (Exception e) {
            addError(e.getMessage());
            return null;
        }
    }

    /**
     * Helper Method: Adds an error message to the Visualforce page
     */
    private void addError(String message) {
        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, message));
    }
}