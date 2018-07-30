import * as React from 'react';
import CodeEditor from '../../component/codeEditor';
export default class DemoCodeEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <CodeEditor name="test" />
      </div>
    );
  }
}
