import TableFactory from '../services/table_factory';
import Video from './video';
import VideoQueue from './video_queues';
import BatchVideoWorker from '../workers/batch_video_worker';
import * as YouTube from '../services/you_tube';
const _ = LodashGS.load();

class BatchUpdate {
  static table() {
    return new TableFactory('batch_update');
  }

  static playlistIdAndDescHeaders() {
    return this.table().items.filter(item => !_.isEmpty(item.getFieldValue('playlist_id'))).map(item => {
      return [item.getFieldValue('playlist_id'), item.getFieldValue('desc_header')];
    });
  }

  static perform() {
    this.playlistIdAndDescHeaders().forEach(item => {
      const playlistId = item[0];
      const newDescHeader = item[1];

      const videoIds = this.fetchVideosIds(playlistId);
      const videos = this.fetchVideos(videoIds);
      VideoQueue.createList(videos, newDescHeader);
    });
    BatchVideoWorker.performLater();
    global.start();
  }

  static fetchVideosIds(playlistId) {
    const part = 'snippet';
    let nextPageToken = null;
    let videoIds = [];

    while(!_.isUndefined(nextPageToken)) {
      const params = { playlistId, maxResults: 50, pageToken: nextPageToken };
      const results = YouTube.PlaylistItems.list(part, params);

      if (!_.isNil(results)) {
        results.items.forEach(item => {
          videoIds.push(item.snippet.resourceId.videoId);
        });
        nextPageToken = results.nextPageToken;
      }
    }
    return videoIds;
  }

  static fetchVideos(videoIds) {
    const part = 'snippet';
    let videos = [];
    const maxResult = 50;
    const videoIdChunks = _.chunk(videoIds, Math.ceil(videoIds.length/maxResult));
    let nextPageToken;
    videoIdChunks.forEach((videoIdChunk) => {
      nextPageToken = null;
      while(!_.isUndefined(nextPageToken)) {
        const params = { id: videoIdChunk.join(','), maxResults: maxResult, pageToken: nextPageToken };
        const results = YouTube.Videos.list(part, params);
        if (!_.isNil(results)) {
          results.items.forEach(item => {
            videos.push(
              new Video(
                item.id,
                item.snippet.title,
                item.snippet.description,
                item.snippet.categoryId
              )
            );
          });
          nextPageToken = results.nextPageToken;
        }
      }
    });
    return videos;
  }
}
export default BatchUpdate;
