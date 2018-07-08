const fixCSVField = (value) => {
  return `\t"${value.replace(/"/g, '""')}"`; // '\t"' + value.replace(/"/g, '""') + '"';
};

export default (table) => {
  let data = '\ufeff';
  for (let i = 0, row; row = table.rows[i]; i++) { // eslint-disable-line
    for (let j = 0, col; col = row.cells[j]; j++) { // eslint-disable-line
      data = data + (j ? ',' : '') + fixCSVField(col);
    }
    data = `${data}\r\n`;
  }
  return data;
};
