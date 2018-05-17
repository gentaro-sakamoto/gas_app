import BatchUpdateLogger from '../services/batch_update_logger';
import * as YouTube from '../services/you_tube';
import VideoQueue from '../models/video_queues';

class BatchVideoWorker {
  static before() {
    this.resetTriggers();
  }

  static perform() {
    this.before();

    const startTime = new Date();
    VideoQueue.waitList().some(videoQueue => {
      if ((new Date() - startTime) / (1000 * 60) > 5) {
        this.setTrigger();
        return true;
      }
      const item = videoQueue.video();
      let resource = {
        id: item.id,
        snippet: {
          title: item.title,
          description: item.updatingDesc(),
          categoryId: item.categoryId,
        }
      };
      try {
        YouTube.Videos.update(resource, 'id,snippet');
        videoQueue.updateStatus('updated');
      } catch (e) {
        BatchUpdateLogger.log(e, item.id);
        videoQueue.updateStatus('failed');
      }
    });
  }

  static setTrigger() {
    ScriptApp.newTrigger('startWorker').timeBased().after(60 * 1000).create();
  }

  static performLater() {
    this.setTrigger();
  }

  static resetTriggers() {
    ScriptApp.getProjectTriggers().forEach((trigger) => {
      ScriptApp.deleteTrigger(trigger);
    });
  }
}

export default BatchVideoWorker;
