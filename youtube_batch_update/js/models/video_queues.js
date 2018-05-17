import TableFactory from '../services/table_factory';
import Video from '../models/video';
import uuidv4 from 'uuid/v4';

class VideoQueue {
  constructor(id, videoId, title, desc, categoryId, newHeader, status) {
    this.id = id;
    this.videoId = videoId;
    this.title = title;
    this.desc = desc;
    this.categoryId = categoryId;
    this.newHeader = newHeader;
    this.status = status;
  }

  static table() {
    return new TableFactory('video_queues');
  }

  static createList(videos, newDescHeader) {
    const video_queues = this.table();
    videos.forEach((video) => {
      video_queues.add({
        id: uuidv4(),
        video_id: video.id,
        title: video.title,
        description: video.desc,
        new_desc_header: newDescHeader,
        category_id: video.categoryId,
        status: 'wait',
        queued_at: new Date()
      });
    });
    video_queues.commit();
  }

  static waitList() {
    return this.table().select({ 'status': 'wait' }).map((item) => {
      return new VideoQueue(
        item.getFieldValue('id'),
        item.getFieldValue('video_id'),
        item.getFieldValue('title'),
        item.getFieldValue('description'),
        item.getFieldValue('category_id'),
        item.getFieldValue('new_desc_header'),
        item.getFieldValue('status')
      );
    });
  }

  video() {
    return new Video(
      this.videoId,
      this.title,
      this.desc,
      this.categoryId,
      this.newHeader
    );
  }

  updateStatus(status) {
    const record = VideoQueue.table().select({ 'id': this.id }).first();
    record.setFieldValue('status', status);
    record.commit();
  }

  static resetRows() {
    this.table().resetGrid();
  }
}
export default VideoQueue;
