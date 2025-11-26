/**
 * Controller: ArticleFinderController
 * Purpose: Gets Health Article records for the portal home page.
 */
public without sharing class ArticleFinderController { // <-- THIS IS THE FIX

    /**
     * Method: getArticles
     * Called by: healthArticleViewer LWC
     * Purpose: Gets the 6 most recent health articles
     */
    @AuraEnabled(cacheable=true)
    public static List<Health_Article__c> getArticles() {
        return [
            SELECT Id, Name, Summary__c, Topic__c,
                   Image_URL__c, Author__c, Published_Date__c 
            FROM Health_Article__c
            ORDER BY Published_Date__c DESC
            LIMIT 6
        ];
    }
}