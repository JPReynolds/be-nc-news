exports.formatDates = list => {
  if (list.length === 0) return [];

  const formattedDates = list.map(object => {
    const date = new Date(object.created_at);

    const year = date.getFullYear();

    const month = date.getMonth();

    const day = date.getDate();

    const hours = date.getHours();

    const minutes = date.getMinutes();

    const seconds = date.getSeconds();

    const newDate =
      month +
      '-' +
      day +
      '-' +
      year +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds;

    const newObj = { ...object };
    newObj.created_at = newDate;
    return newObj;
  });
  return formattedDates;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
