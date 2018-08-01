import * as React from 'react';
import RichEditor from '../../component/richEditor';
import { richVal } from './demoVal';
export default class DemoRichEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <RichEditor name="test" defaultValue={richVal} />
      </div>
    );
  }
}
