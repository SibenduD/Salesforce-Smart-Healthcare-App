/**
 * Controller: PulsePointRegisterController
 * Purpose: Handles all logic for the Visualforce Registration page.
 */
public without sharing class PulsePointRegisterController {

    // --- Your Org's IDs ---
    private static final Id MASTER_ACCOUNT_ID = '001gK00000L6yWvQAJ';
    private static final Id PATIENT_RECORD_TYPE_ID = '012gK000002UzGDQA0';
    private static final Id COMMUNITY_PROFILE_ID = '00egK0000051zEG';

    // --- Properties for Registration ---
    public String firstName { get; set; }
    public String lastName { get; set; }
    public String email { get; set; }
    public Date birthdate { get; set; }
    public String regPassword { get; set; }
    public String confirmPassword { get; set; }
    
    // --- Properties for auto-login ---
    private String username { get; set; }
    private String password { get; set; }

    /**
     * Constructor
     */
    public PulsePointRegisterController() {
        // constructor
    }

    /**
     * Method: doRegister
     * Action: Called by the "Create Account" button on the VF page.
     */
    public PageReference doRegister() {
        
        if (regPassword != confirmPassword) {
            addError('Error: Passwords do not match.');
            return null;
        }

        List<Contact> existingContacts = [SELECT Id FROM Contact WHERE Email = :email];
        if (existingContacts.size() > 0) {
            addError('Error: This email address is already in use.');
            return null;
        }
        
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

        User newUser = new User();
        newUser.Username = email; 
        newUser.Email = email;
        newUser.FirstName = firstName;
        newUser.LastName = lastName;
        newUser.ContactId = newPatient.Id;
        newUser.ProfileId = COMMUNITY_PROFILE_ID;
        
        String uniqueSuffix = String.valueOf(Datetime.now().getTime()).right(5);
        newUser.CommunityNickname = firstName + lastName.substring(0, 1) + uniqueSuffix;
        newUser.Alias = (firstName.substring(0, 1) + lastName.substring(0, Math.min(lastName.length(), 4)) + uniqueSuffix).toLowerCase();
        
        newUser.TimeZoneSidKey = 'America/Los_Angeles'; 
        newUser.LocaleSidKey = 'en_US';
        newUser.EmailEncodingKey = 'UTF-8';
        newUser.LanguageLocaleKey = 'en_US';
        
        try {
            insert newUser;
            System.setPassword(newUser.Id, regPassword);

            // Success! Now, log the user in.
            this.username = email;
            this.password = regPassword;
            return doLogin();

        } catch (Exception e) {
            addError('Error creating user: A user with that email may already exist. ' + e.getMessage());
            delete newPatient; // Rollback
            return null;
        }
    }
    
    /**
     * Private Method: doLogin
     * Action: Logs in the newly created user.
     */
    private PageReference doLogin() {
        try {
            String siteUrl = [SELECT UrlPathPrefix FROM Network WHERE UrlPathPrefix = '/patienthealth'].UrlPathPrefix;
            PageReference loginResult = Site.login(this.username, this.password, siteUrl);
            return loginResult;
        } catch (Exception e) {
            addError('Your account was created, but login failed. Please go to the login page and try again. ' + e.getMessage());
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