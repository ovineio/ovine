import * as React from 'react';
import CodeEditor from '../../component/codeEditor';

import { codeVal } from './demoVal';
export default class DemoCodeEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <CodeEditor name="test" defaultValue={codeVal} />
      </div>
    );
  }
}
