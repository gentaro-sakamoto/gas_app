const _ = LodashGS.load();
const DELIMITER = '\n=======\n';

class Video {
  constructor(id, title, desc, categoryId) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.categoryId = categoryId;
  }

  hasDelimiter() {
    return this.desc.search(DELIMITER) != -1;
  }

  updatingDesc(newHeader) {
    let newDesc = this.desc;
    if (!this.hasDelimiter()) {
      newDesc = `${DELIMITER}${this.desc}`;
    }
    let split_new_desc = newDesc.split(DELIMITER);
    split_new_desc[0] = newHeader;

    return split_new_desc.join(DELIMITER);
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
    let nextPageToken = null;
    let videos = [];

    while(!_.isUndefined(nextPageToken)) {
      const params = { id: videoIds, maxResults: 50, pageToken: nextPageToken };
      const results = YouTube.Videos.list(part, params);

      if (!_.isNil(results)) {
        results.items.forEach(item => {
          videos.push(
            new Video(
              item.id,
              item.snippet.title,
              item.snippet.description,
              item.snippet.categoryId,
            )
          );
        });
        nextPageToken = results.nextPageToken;
      }
    }
    return videos;
  }

  static updateBatchVideos(videos, newHeader) {
    const updater = new VideoUpdater(videos, newHeader);
    updater.perform();
  }
}

const main = () => {
  const videoIds = Video.fetchVideosIds('PLByyPLIXw3A1leOoLkDnVR1akFpWGVyco');
  const videos = Video.fetchVideos(videoIds);
  Logger.log(videos[0]);
  Video.updateBatchVideos(videos, 'Test is test 2');
};

class VideoUpdater {
  constructor(videos, newHeader) {
    this.videos = videos;
    this.newHeader = newHeader;
  }

  perform() {
    Logger.log(this.videos);
    this.videos.forEach(item => {
      let resource = {
        id: item.id,
        snippet: {
          title: item.title,
          description: item.updatingDesc(this.newHeader),
          categoryId: item.categoryId,
        }
      };
      try {
        YouTube.Videos.update(resource, 'id,snippet');
      } catch (err) {
        Logger.log(err);
      }
    });
  }
}
