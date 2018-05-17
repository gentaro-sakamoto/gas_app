const _ = LodashGS.load();
const DELIMITER = '\n=======\n';

class Video {
  constructor(id, title, desc, categoryId, newHeader) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.categoryId = categoryId;
    this.newHeader = newHeader;
  }

  hasDelimiter() {
    return this.desc.search(DELIMITER.trim()) != -1;
  }

  updatingDesc() {
    let body = '';
    if (this.hasDelimiter()) {
      let split_desc = this.desc.split(DELIMITER);
      body = split_desc[1];
    } else {
      body = this.desc;
    }

    return _.isEmpty(this.newHeader) ? body : `${this.newHeader}${DELIMITER}${body}`;
  }
}

export default Video;
