import BatchUpdate from './models/batch_update';
import BatchUpdateLogger from './services/batch_update_logger';
import YoutubeOauth2 from './services/youtube_oauth2';
import BatchVideoWorker from './workers/batch_video_worker';
import VideoQueue from './models/video_queues';

global.main = () => {
  try {
    BatchUpdate.perform();
  } catch (e) {
    BatchUpdateLogger.log(e);
  }
};

global.authCallback = (request) => { return YoutubeOauth2.authCallback(request); };

global.logout = () => {
  YoutubeOauth2.logout();
  SpreadsheetApp.getUi().ui.alert('リセットしました');
};

/* Spreadsheet UI */

global.onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('YouTube')
    .addItem('動画詳細欄を一括更新する', 'confirm')
    .addItem('認可情報をリセットする', 'logout')
    .addItem('「video_queues」をリセットする', 'resetVideoQueues')
    .addToUi();
};

global.confirm = () => {
  if (!YoutubeOauth2.service().hasAccess()) {
    YoutubeOauth2.showModalDialog();
    return;
  }

  if (VideoQueue.waitList().length > 0) {
    SpreadsheetApp.getUi().alert('実行中の処理があります。しばらくしてからお試しください。');
    return;
  }
  const ui = SpreadsheetApp.getUi();
  const playlistIds = BatchUpdate.playlistIdAndDescHeaders().map(item => item[0]);
  if (playlistIds.length == 0) {
    ui.alert('playlist_idを指定してください');
    return;
  }

  const columns = 'playlist_id:';
  playlistIds.unshift(columns);
  const content = playlistIds.join('\n');

  const result = ui.alert(
    'よくご確認ください', `動画詳細を一括更新します。よろしいですか？\n${content}`, ui.ButtonSet.YES_NO
  );
  if (result == ui.Button.YES) {
    global.main();
  } else {
    ui.alert('キャンセルしました');
  }
};

global.start = () => {
  SpreadsheetApp.getUi().alert(`
    処理を開始しました。
    処理状況は「video_queues」シートで確認できます
  `);
};

global.startWorker = () => {
  BatchVideoWorker.perform();
};

global.getWaitQueues = () => {
  Logger.log(VideoQueue.waitList());
};


global.getTriggers = () => {
  const triggers = ScriptApp.getProjectTriggers();
  Logger.log(triggers.map(item => item.getHandlerFunction()));
  return triggers;
};

global.resetTriggers = () => {
  BatchVideoWorker.resetTriggers();
};

global.resetVideoQueues = () => {
  VideoQueue.resetRows();
  SpreadsheetApp.getUi().alert('リセットしました');
};
