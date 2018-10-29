
// 表格导出csv
export function getTableCsvData($headerRow, $bodyRow) {
  if (!$headerRow || !$bodyRow) {
    return '';
  }

  const headerRows = $headerRow.querySelectorAll('tr');
  const bodyRows = $bodyRow.querySelectorAll('tr');

  let data = '\ufeff';
  const getCellData = ($tableRows) => {
    for (let i = 0, row; row = $tableRows[i]; i++) { // eslint-disable-line
      for (let j = 0, col; col = row.children[j]; j++) { // eslint-disable-line

        if (col && col.querySelector('.no-export-cell')) {
          data += '';
          break;
        }

        let colText = '--';
        if (col) {
          const $exportStr = col.querySelector('[data-export]');
          colText = ($exportStr && $exportStr.dataset.export) || col.innerText.replace(/\n/g, '');
        }
        data += `"${colText}",`;
      }
      data = `${data.substring(0, data.length - 1)}\r\n`;
    }
  };

  getCellData(headerRows);
  getCellData(bodyRows);

  return `data:text/csv;charset=utf-8,${data}`;
}

export function exportTableToCsv(name, dataStr) {
  const a = document.createElement('a');
  a.download = name;
  a.href = dataStr;
  a.click();
}
