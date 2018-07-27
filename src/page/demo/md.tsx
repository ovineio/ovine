import * as React from 'react';
import MdEditor from '../../component/mdEditor';
export default class DemoMdEditor extends React.PureComponent {
  render() {
    return (
      <div>
        <MdEditor name="test" />
      </div>
    );
  }
}
