import YoutubeOauth2 from '../youtube_oauth2';
import queryString from 'query-string';

class Videos {

  static list(part, params) {
    let jsonData = null;
    params.part = part;
    const paramsWithPart = params;
    const response = UrlFetchApp.fetch(`${this.endpointUrl()}?${queryString.stringify(paramsWithPart)}`, {
        headers: {
          Authorization: 'Bearer ' + YoutubeOauth2.service().getAccessToken()
        }
      });
    jsonData = JSON.parse(response.getContentText());
    return jsonData;
  }

  static update(resource, part) {
    let jsonData = null;
    const options = {
      headers: {
        Authorization: 'Bearer ' + YoutubeOauth2.service().getAccessToken()
      },
      method: 'put',
      payload: JSON.stringify(resource),
      contentType: 'application/json',
    };
    const response = UrlFetchApp.fetch(
      `${this.endpointUrl()}?${queryString.stringify({ part })}`, options
    );
    jsonData = JSON.parse(response.getContentText());
    return jsonData;
  }

  static endpointUrl() {
    return 'https://www.googleapis.com/youtube/v3/videos';
  }

}

export default Videos;
