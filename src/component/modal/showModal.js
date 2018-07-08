import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default function showModal(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  function onCancel(...args) {
    render({ ...config, onCancel, visible: false, afterClose: destroy.bind(this, ...args) });
  }

  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args && args.length &&
      args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }

  function render(props) {
    const Modal = props.component;
    ReactDOM.render(<Modal {...props} />, div);
  }

  render({ ...config, onCancel, visible: true });

  return {
    destroy: close,
  };
}
