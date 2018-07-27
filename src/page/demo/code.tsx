import * as React from 'react';
import CodeEditor from '../../component/editor/code';
export default class DemoCodeEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <CodeEditor mode="json" name="test" />
      </div>
    );
  }
}
