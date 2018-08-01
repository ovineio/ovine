
function renderFlow(flowchart: any, wrapperId: string, code: any) {
  const chart = flowchart.parse(code);
  chart.drawSVG(wrapperId, {
    'line-width': 1,
    'maxWidth': 3, // ensures the flowcharts fits within a certian width
    'line-length': 50,
    'text-margin': 10,
    'font-size': 14,
    'font': 'normal',
    'font-family': 'Helvetica',
    'font-weight': 'normal',
    'font-color': '#000',
    'line-color': '#000',
    'element-color': '#000',
    'fill': '#fff',
    'yes-text': 'yes',
    'no-text': 'no',
    'arrow-end': 'block',
    'scale': 1,
  });
}

export const defineFlowExtension = (Editor: any, flowchart: any) => {
  Editor.defineExtension('flow', function() {
    Editor.codeBlockManager.setReplacer('flow', function(code: any) {
      const wrapperId = 'flow' + Math.random().toString(36).substr(2, 10);
      setTimeout(renderFlow.bind(null, flowchart, wrapperId, code), 0);
      return '<div id="' + wrapperId + '"></div>';
    });
  });
};
