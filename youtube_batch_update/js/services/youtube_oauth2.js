const CLIENT_ID = '276241885213-ec9qbqkdg0unjpaho7o9obrot1q3bsc2.apps.googleusercontent.com';
const SECRET = '6oAt9FalTY2jG1iFTWlo0Ej9';

class YoutubeOauth2 {
  service() {
    return OAuth2.createService('YouTube')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(CLIENT_ID)
      .setClientSecret(SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope([
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/youtubepartner'
      ])

      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      .setParam('login_hint', Session.getActiveUser().getEmail())

      // Requests offline access.
      .setParam('access_type', 'offline')

      // Forces the approval prompt every time. This is useful for testing,
      // but not desirable in a production application.
      .setParam('approval_prompt', 'force');
  }

  authCallback(request) {
    const oauth2_service = this.service();
    const authorized = oauth2_service.handleCallback(request);
    if (authorized) {
      return HtmlService.createHtmlOutput(`
        <span>認可に成功しました。</span>
        <script>
          setTimeout(function() { window.top.close() }, 1000);
        </script>
      `);
    } else {
      return HtmlService.createHtmlOutput(`
        <span>認可に失敗しました。開発チームに報告お願いします。</span>
      `);
    }
  }

  showModalDialog() {
    const oauth2_service = this.service();
    const authorizationUrl = oauth2_service.getAuthorizationUrl();
    const template = HtmlService.createTemplate(`
      <a href="${authorizationUrl}" target="_blank" onclick='google.script.host.close();'>認可ページへ</a>
    `);
    const page = template.evaluate();
    return SpreadsheetApp.getUi().showModalDialog(page, 'YouTubeのデータにアクセスします。下記リンクから許可してください。');
  }

  logout() {
    this.service().reset();
  }
}

export default new YoutubeOauth2();
