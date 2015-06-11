/**
 * Created by gunlee on 2015. 6. 11..
 */
var HashMap = require('hashmap');

function AuthConfig() {
    this.excludeAuthenticaitonUriMap = new HashMap()
        .set('/api/access/signin', '')
        .set('/app/views/app-access-signin.client.view.html', '')
        .set('/app/views/app-footer.client.view.html', '')
        .set('/fetch', '');

    this.excludeAuthenticationUriPatterns = [
        '/hakstrace.js'
    ]
}

module.exports = new AuthConfig();