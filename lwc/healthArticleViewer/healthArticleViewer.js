import { LightningElement, wire, track } from 'lwc';
import getArticles from '@salesforce/apex/ArticleFinderController.getArticles';

export default class HealthArticleViewer extends LightningElement {

    @track articles;
    @track error;
    hasLoaded = false;
    
    // This @wire will now work for you as an Admin
    // because the Apex class is "without sharing".
    @wire(getArticles)
    wiredArticles({ error, data }) {
        if (data) {
            // If data is returned, show it.
            this.articles = data.length > 0 ? data : null;
            this.error = undefined;
            this.hasLoaded = true;
        } else if (error) {
            // If Apex fails, show the error
            this.error = error;
            this.articles = null;
            this.hasLoaded = true;
        }
    }
    
    get isLoading() {
        return !this.hasLoaded;
    }
    
    // This is a placeholder for later
    handleReadMore(event) {
        event.preventDefault();
        const articleId = event.currentTarget.dataset.id;
        console.log('Would navigate to full article for ID: ' + articleId);
    }
}