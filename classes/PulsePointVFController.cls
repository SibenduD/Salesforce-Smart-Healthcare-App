/**
 * Controller: PulsePointVFController
 * Purpose: Handles all logic for the Visualforce Login & Registration page.
 * IDs have been updated with your specific org's values.
 */
public without sharing class PulsePointVFController {

    // --- IDs updated with your org's values ---
    private static final Id MASTER_ACCOUNT_ID = '001gK00000L6yWvQAJ';
    private static final Id PATIENT_RECORD_TYPE_ID = '012gK000002UzGDQA0';
    private static final Id COMMUNITY_PROFILE_ID = '00egK000005ECPq';

    // --- Properties for Login ---
    public String username { get; set; }
    public String password { get; set; }

    // --- Properties for Registration ---
    public String firstName { get; set; }
    public String lastName { get; set; }
    public String email { get; set; }
    public Date birthdate { get; set; }
    public String regPassword { get; set; }
    public String confirmPassword { get; set; }

    /**
     * Constructor: This runs when the page loads.
     */
    public PulsePointVFController() {
        // constructor
    }

    /**
     * Method: doLogin
     * Action: Called by the "Log In" button on the VF page.
     */
    public PageReference doLogin() {
        try {
            // Get the URL prefix for the portal
            String siteUrl = [SELECT UrlPathPrefix FROM Network WHERE UrlPathPrefix = '/patienthealth'].UrlPathPrefix;
            
            // Try to log in
            PageReference loginResult = Site.login(username, password, siteUrl);

            if (loginResult != null) {
                // Success! Redirect the user to the portal's home page.
                return loginResult;
            } else {
                addError('An unknown error occurred. Please try again.');
                return null;
            }

        } catch (Exception e) {
            // Add the "Invalid username or password" error to the page
            addError(e.getMessage());
            return null;
        }
    }

    /**
     * Method: doRegister
     * Action: Called by the "Create Account" button on the VF page.
     */
    public PageReference doRegister() {
        
        // 1. Server-Side Validation
        if (regPassword != confirmPassword) {
            addError('Error: Passwords do not match.');
            return null;
        }

        List<Contact> existingContacts = [SELECT Id FROM Contact WHERE Email = :email];
        if (existingContacts.size() > 0) {
            addError('Error: This email address is already in use.');
            return null;
        }
        
        // 2. Create the Contact (This runs as "without sharing")
        Contact newPatient = new Contact();
        newPatient.FirstName = firstName;
        newPatient.LastName = lastName;
        newPatient.Email = email;
        newPatient.Birthdate = birthdate;
        newPatient.AccountId = MASTER_ACCOUNT_ID;
        newPatient.RecordTypeId = PATIENT_RECORD_TYPE_ID;

        try {
            insert newPatient;
        } catch (Exception e) {
            addError('Error creating contact: ' + e.getMessage());
            return null;
        }

        // 3. Create the User (This is the reliable, manual way)
        User newUser = new User();
        newUser.Username = email; 
        newUser.Email = email;
        newUser.FirstName = firstName;
        newUser.LastName = lastName;
        newUser.ContactId = newPatient.Id;
        newUser.ProfileId = COMMUNITY_PROFILE_ID; // Your ID is now here
        
        String uniqueSuffix = String.valueOf(Datetime.now().getTime()).right(5);
        newUser.CommunityNickname = firstName + lastName.substring(0, 1) + uniqueSuffix;
        newUser.Alias = (firstName.substring(0, 1) + lastName.substring(0, Math.min(lastName.length(), 4)) + uniqueSuffix).toLowerCase();
        
        newUser.TimeZoneSidKey = 'America/Los_Angeles'; 
        newUser.LocaleSidKey = 'en_US';
        newUser.EmailEncodingKey = 'UTF-8';
        newUser.LanguageLocaleKey = 'en_US';
        
        try {
            insert newUser;
            
            // Use System.setPassword
            System.setPassword(newUser.Id, regPassword);

            // Success! Now, log the user in.
            // We set the username and password so doLogin() can use them
            username = email;
            password = regPassword;
            return doLogin();

        } catch (Exception e) {
            
            addError('Error creating user: A user with that email may already exist. ' + e.getMessage());
            
            // Rollback: delete the contact if the user creation fails
            delete newPatient;
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

