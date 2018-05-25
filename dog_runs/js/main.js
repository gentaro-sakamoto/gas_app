import TableFactory from './services/table_factory';

global.doGet = (e) => {
  const id = e.parameter.id || null;
  const limit = e.parameter.limit || 10;
  const table = new TableFactory('dog_runs');
  const headers = table.getHeader();
  let dogRun = {};
  let data = null;

  if (id) {
    let row = table.select({ 'id': parseInt(id) }).first();
    headers.forEach(key => dogRun[key] = row.getFieldValue(key));
    data = dogRun;
  } else {
    const dogRuns = table.items.slice(0, limit).map(row => {
      dogRun = {};
      headers.forEach(key => dogRun[key] = row.getFieldValue(key));
      return dogRun;
    });
    data = dogRuns;
  }

  const dogRunsAsJson = JSON.stringify(data);
  return ContentService.createTextOutput(dogRunsAsJson).setMimeType(ContentService.MimeType.JAVASCRIPT);
};
