import * as React from 'react';
import classNames from 'classnames';
import { Spin } from 'antd';
import { loadFile, unqid } from '../../util/misc';

import tinymceConfig from './config';

interface RichEditorProps {
  name: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: any) => string;
  value?: string;
  menubar?: string[];
  height?: number;
}

type RichEditorState = {
  isLoading: boolean;
  isFullScreen: boolean;
};

export default class RichEditor extends React.PureComponent<RichEditorProps, RichEditorState> {
  static defaultProps = {
    menubar: ['file', 'edit', 'insert', 'view', 'format', 'table'],
    height: 400,
  };

  state = {
    isLoading: true,
    isFullScreen: false,
  };

  private id: string = `rich-${unqid()}`;
  private tinymce: any;

  async componentDidMount() {
    if ((window as any).tinymce) {
      this.initTinymce();
    } else {
      await loadFile('tinymce-4.8.0/tinymce.min.js');
      this.initTinymce();
    }
  }

  componentWillUnmount() {
    this.tinymce.destroy();
    this.tinymce = null;
  }

  initInstanceCallback = (editor: any): void => {
    const { value, defaultValue } = this.props;
    const val = value || defaultValue;

    if (val) {
      editor.setContent(val);
    }
    this.setState({ isLoading: false });
    this.tinymce = (window as any).tinymce.get(this.id);
    editor.on('NodeChange Change KeyUp SetContent', () => {
      this.onChange(editor.getContent());
    });
    editor.on('FullscreenStateChanged', () => {
      this.setState(prevState => ({
        isFullScreen: !prevState.isFullScreen,
      }));
    });
  }

  initTinymce = () => {
    const { height, menubar } = this.props;

    (window as any).tinymce.init(Object.assign({}, tinymceConfig, {
      height,
      menubar,
      selector: `#${this.id}`,
      init_instance_callback: this.initInstanceCallback,
    }));
  }

  onChange = (value: any) => {
    const { onChange } = this.props;
    if (!onChange) {
      return;
    }

    onChange(value);
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Spin spinning={isLoading} >
          <textarea
            id={this.id}
            className={classNames({
              'transparent': isLoading,
            })}
          />
        </Spin>
      </div>
    );
  }
}
