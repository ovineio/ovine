import * as React from 'react';
import classNames from 'classnames';
import { Spin } from 'antd';
import { loadFiles } from '../../util/misc';
import tuiConfig from './config';

interface MdEditorProps {
  name: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: any) => string;
  value?: string;
}

type MdEditorState = {
  isLoading: boolean;
  isFullScreen: boolean;
};

export default class MdEditor extends React.PureComponent<MdEditorProps, MdEditorState> {

  state = {
    isLoading: true,
    isFullScreen: false,
  };

  private $div: React.RefObject<HTMLDivElement> = React.createRef();
  private tuimd: any;

  async componentDidMount() {
    if ((window as any).tui) {
      this.initTuiEditor();
    } else {
      await loadFiles([
        'tui-editor-1.2.6/index.css',
        'tui-editor-1.2.6/highlight.pack.js',
        'tui-editor-1.2.6/index.js',
      ]);
      setTimeout(this.initTuiEditor, 100);
    }
  }

  initTuiEditor = () => {
    const { value, defaultValue } = this.props;
    const val = value || defaultValue;

    this.tuimd = new (window as any).tui.Editor(
      Object.assign({}, tuiConfig, {
        el: this.$div.current,
        initialValue: val,
        events: {
          change: this.onChange
        }
      }));
    this.setState({ isLoading: false });

    this.tuimd.eventManager.addEventType('full');
    this.tuimd.eventManager.listen('full', () => {
      this.setState((preState) => ({
        isFullScreen: !preState.isFullScreen
      }));
    });
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.tuimd.getValue());
    }
  }

  render() {
    const { isLoading, isFullScreen } = this.state;
    return (
      <Spin spinning={isLoading}>
        <div
          ref={this.$div}
          className={classNames({
            'transparent': isLoading,
            'editor-full-screen': isFullScreen,
          })}
        />
      </Spin>
    );
  }
}
