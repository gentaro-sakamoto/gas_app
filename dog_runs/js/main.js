import TableFactory from './services/table_factory';

global.doGet = () => {
  const table = new TableFactory('dog_runs');
  const headers = table.getHeader();

  let dogRun;
  const dogRuns = table.items.map(row => {
    dogRun = {};
    headers.forEach(key => dogRun[key] = row.getFieldValue(key));
    return dogRun;
  });
  const dogRunsAsJson = JSON.stringify(dogRuns);
  return ContentService.createTextOutput(dogRunsAsJson).setMimeType(ContentService.MimeType.JAVASCRIPT);
};
