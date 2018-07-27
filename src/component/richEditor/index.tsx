import * as React from 'react';
import { loadScript, unqid } from '../../util/misc';

import editorConfig from './config';

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
  isFullscreen: boolean;
};

export default class MdEditor extends React.PureComponent<RichEditorProps, RichEditorState> {
  static defaultProps = {
    menubar: ['file', 'edit', 'insert', 'view', 'format', 'table'],
    height: 400,
  };

  state = {
    isFullscreen: false,
  };

  private id: string = `rich-${unqid()}`;
  private tinymce: any;

  componentDidMount() {
    if ((window as any).tinymce) {
      this.initTinymce();
    } else {
      loadScript(`${window.location.origin}/public/tinymce4.8.0/tinymce.min.js`, () => {
        this.initTinymce();
      });
    }
  }

  componentWillUnmount() {
    this.getTinymce().destroy();
  }

  getTinymce = (): any => {
    return (window as any).tinymce.get(this.id);
  }

  initTinymce = () => {
    const { height, menubar, value, defaultValue } = this.props;
    const val = value || defaultValue;
    this.tinymce = (window as any).tinymce.init(Object.assign({}, editorConfig, {
      height,
      menubar,
      selector: `#${this.id}`,
      init_instance_callback: (editor: any) => {
        if (val) {
          editor.setContent(val);
        }
        editor.on('NodeChange Change KeyUp SetContent', () => {
          this.onChange(editor.getContent());
        });
      },
    }));
  }

  onChange = (value: any) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <div className="tinymce-container editor-container">
        <textarea
          className="tinymce-textarea"
          id={this.id}
        />
      </div>
    );
  }
}
