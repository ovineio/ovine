import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';

export default class CodeEditor extends React.PureComponent {
  render() {
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="yaml"
        theme="vs-dark"
        options={options}
      />
    );
  }
}
