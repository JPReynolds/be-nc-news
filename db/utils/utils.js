exports.formatDates = list => {
  if (list.length === 0) return [];

  const formattedDates = list.map(object => {
    const date = new Date(object.created_at);

    const newObj = { ...object };
    newObj.created_at = date;
    return newObj;
  });
  return formattedDates;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];

  const formattedComments = comments.map(comment => {
    const newObj = { ...comment };
    newObj.author = comment.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(comment.created_at);
    return newObj;
  });
  return formattedComments;
};
