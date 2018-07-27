import * as React from 'react';
import TuiEditor from 'tui-editor';

import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';

interface MdEditorProps {
  name: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: any) => string;
  value?: string;
}

export default class MdEditor extends React.PureComponent<MdEditorProps> {
  private $md: React.RefObject<HTMLDivElement> = React.createRef();
  private tuimd: any;

  componentDidMount() {
    this.tuimd = new TuiEditor({
      el: this.$md.current,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      height: window.innerHeight - 20,
      events: {
        change: this.onChange
      }
    });
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.tuimd.getValue());
    }
  }

  render() {
    return (
      <div>
        <div
          ref={this.$md}
        />
      </div>
    );
  }
}
