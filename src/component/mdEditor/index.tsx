import * as React from 'react';
import { Spin } from 'antd';
import { loadFiles } from '../../util/misc';

interface MdEditorProps {
  name: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: any) => string;
  value?: string;
}
type MdEditorState = {
  isLoading: boolean;
};

export default class MdEditor extends React.PureComponent<MdEditorProps, MdEditorState> {

  state = {
    isLoading: true,
  };

  private $div: React.RefObject<HTMLDivElement> = React.createRef();
  private tuimd: any;

  async componentDidMount() {
    if ((window as any).tui) {
      this.initTuiEditor();
    } else {
      await loadFiles([
        'tui-editor-1.2.6/index.css',
        'tui-editor-1.2.6/index.js'
      ]);
      setTimeout(this.initTuiEditor, 100);
    }
  }

  initTuiEditor = () => {
    const { value, defaultValue } = this.props;
    const val = value || defaultValue;

    this.tuimd = new (window as any).tui.Editor({
      el: this.$div.current,
      initialValue: val,
      language: 'zh',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      usageStatistics: false,
      hideModeSwitch: true,
      events: {
        change: this.onChange
      }
    });
    this.setState({ isLoading: false });
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.tuimd.getValue());
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <Spin spinning={isLoading}>
        <div
          ref={this.$div}
        />
      </Spin>
    );
  }
}
