import TableFactory from '../services/table_factory';

class BatchUpdateLogger {
  static log(e, video_id = null) {
    const batch_update_logs = new TableFactory('batch_update_logs');
    batch_update_logs.add({
      movie_code: video_id || '-',
      error: e,
      created_at: new Date()
    });
    batch_update_logs.commit();
  }
}

export default BatchUpdateLogger;
