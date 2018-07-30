tui.Editor.defineExtension('flow', function() {
  tui.Editor.codeBlockManager.setReplacer('flow', function(code) {
      var wrapperId = 'flow' + Math.random().toString(36).substr(2, 10);
      setTimeout(renderFlow.bind(null, wrapperId, code), 0);
      return '<div id="' + wrapperId + '"></div>';
  });
});

function renderFlow(wrapperId, code) {
  var chart = flowchart.parse(code);
  chart.drawSVG(wrapperId, {
    // 'x': 30,
    // 'y': 50,
    'line-width': 3,
    'maxWidth': 3,//ensures the flowcharts fits within a certian width
    'line-length': 50,
    'text-margin': 10,
    'font-size': 14,
    'font': 'normal',
    'font-family': 'Helvetica',
    'font-weight': 'normal',
    'font-color': 'black',
    'line-color': 'black',
    'element-color': 'black',
    'fill': 'white',
    'yes-text': 'yes',
    'no-text': 'no',
    'arrow-end': 'block',
    'scale': 1,
    'symbols': {
      'start': {
        'font-color': 'red',
        'element-color': 'green',
        'fill': 'yellow'
      },
      'end':{
        'class': 'end-element'
      }
    },
    'flowstate' : {
      'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
      'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
      'future' : { 'fill' : '#FFFF99'},
      'request' : { 'fill' : 'blue'},
      'invalid': {'fill' : '#444444'},
      'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
      'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
    }
  });
}
