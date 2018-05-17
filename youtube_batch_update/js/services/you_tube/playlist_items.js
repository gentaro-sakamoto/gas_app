import YoutubeOauth2 from '../youtube_oauth2';
import queryString from 'query-string';
import BatchUpdateLogger from '../batch_update_logger';

class PlaylistItems {

  static list(part, params) {
    let jsonData = null;
    params.part = part;
    const paramsWithPart = params;
    try {
      const response = UrlFetchApp.fetch(`${this.endpointUrl()}?${queryString.stringify(paramsWithPart)}`, {
          headers: {
            Authorization: 'Bearer ' + YoutubeOauth2.service().getAccessToken()
          }
        });
      jsonData = JSON.parse(response.getContentText());
    } catch (e) {
      BatchUpdateLogger.log(e);
    }
    return jsonData;
  }

  static endpointUrl() {
    return 'https://www.googleapis.com/youtube/v3/playlistItems';
  }

}

export default PlaylistItems;
