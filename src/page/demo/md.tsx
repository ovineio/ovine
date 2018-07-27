import * as React from 'react';
import MdEditor from '../../component/editor/md';
export default class DemoCodeEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <MdEditor name="test" />
      </div>
    );
  }
}
