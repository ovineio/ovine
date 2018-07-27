import * as React from 'react';
import RichEditor from '../../component/richEditor';
export default class DemoRichEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <RichEditor name="test" />
      </div>
    );
  }
}
