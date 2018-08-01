import * as React from 'react';
import MdEditor from '../../component/mdEditor';
import { mdVal } from './demoVal';
export default class DemoMdEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <MdEditor name="test" defaultValue={mdVal} />
      </div>
    );
  }
}
