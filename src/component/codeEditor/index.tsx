import * as React from 'react';
import CodeMirror from 'codemirror';
import jsyaml from 'js-yaml';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint';

import 'script-loader!jsonlint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/json-lint';

import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/lint/yaml-lint';

interface CodeEditorProps {
  name: string;
  mode: 'json' | 'yaml';
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: any, changeObj: any) => string;
  value?: string;
}

type CodeEditorState = {
  isFocused: boolean;
};

const defaultOptions = {
  tabSize: 2,
  indentWithTabs: true,
  smartIndent: true,
  lineNumbers: true,
  gutters: ['CodeMirror-lint-markers'],
  theme: 'material',
  lint: true
};

const modes = {
  json: 'application/json',
  yaml: 'text/yaml',
};

// 校验 yml 格式文件
(window as any).jsyaml = jsyaml;

export default class CodeEditor extends React.PureComponent<CodeEditorProps, CodeEditorState> {
  static defaultProps = {
    mode: 'json',
    disabled: false,
  };

  state = {
    isFocused: false,
  };

  private codemirror: any;
  private $textArea: React.RefObject<HTMLTextAreaElement> = React.createRef();

  componentDidMount() {
    this.codemirror = CodeMirror.fromTextArea(this.$textArea.current, this.getOptions());
    this.codemirror.on('change', this.onChange);
  }

  componentWillUnmount() {
    this.codemirror.toTextArea();
  }

  onChange = (doc: any, change: any) => {
    if (this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(doc.getValue(), change);
    }
  }

  getOptions = () => {
    const { mode, disabled } = this.props;
    const options: any = Object.assign({}, defaultOptions, {
      mode: modes[mode],
      readOnly: disabled
    });

    return options;
  }

  render() {
    const { name, defaultValue } = this.props;
    return (
      <div>
        <textarea
          ref={this.$textArea}
          name={name}
          defaultValue={defaultValue}
          autoComplete="off"
        />
      </div>
    );
  }
}
