import * as React from 'react';
import classNames from 'classnames';
import { Spin } from 'antd';
import { loadFiles } from '../../util/misc';
import tuiConfig from './config';
import { defineFlowExtension } from './flowExt';

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
  previewStyle: string;
};

export default class MdEditor extends React.PureComponent<MdEditorProps, MdEditorState> {

  state = {
    isLoading: true,
    isFullScreen: false,
    previewStyle: 'vertical',
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
        'tui-editor-1.2.6/flowchart.min.js',
      ]);
      setTimeout(this.initTuiEditor, 100);
    }
  }

  initTuiEditor = () => {
    const { value, defaultValue } = this.props;
    const val = value || defaultValue;

    // 定义 flowchart 扩展
    defineFlowExtension((window as any).tui.Editor, (window as any).flowchart);

    this.tuimd = new (window as any).tui.Editor(
      Object.assign({}, tuiConfig, {
        el: this.$div.current,
        initialValue: val,
        events: {
          change: this.onChange,
          stateChange: () => {
            console.info(123);
          },
          load: () => {
            this.setState({ isLoading: false });
          }
        },
      }));

    // 切换 全屏
    this.tuimd.eventManager.addEventType('full');
    this.tuimd.eventManager.listen('full', () => {
      this.setState((preState) => ({
        isFullScreen: !preState.isFullScreen
      }));
    });

    // 切换 编辑器模式
    this.tuimd.eventManager.addEventType('chmode');
    this.tuimd.eventManager.listen('chmode', () => {
      const previewStyle =  this.state.previewStyle === 'tab' ? 'vertical' : 'tab';
      this.tuimd.layout.changePreviewStyle(previewStyle);
      this.setState({ previewStyle });
    });
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.tuimd.getValue());
    }
  }

  render() {
    const { isLoading, isFullScreen, previewStyle } = this.state;
    return (
      <Spin spinning={isLoading}>
        <div
          ref={this.$div}
          className={classNames(
            `editor-preview-${previewStyle}-style`, {
            'transparent': isLoading,
            'editor-full-screen': isFullScreen,
          })}
        />
      </Spin>
    );
  }
}
