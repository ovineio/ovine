import * as React from 'react';
import { Spin } from 'antd';
import { loadFiles } from '../../util/misc';

interface VideoPlayerProps {
  name: string;
  disabled?: boolean;
  defaultValue?: string;
  onChange?: (value: any) => string;
  value?: string;
}
type VideoPlayerState = {
  isLoading: boolean;
};

export default class VideoPlayer extends React.PureComponent<VideoPlayerProps, VideoPlayerState> {

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
        'video-7.20.0/video-js.min.css',
        'video-7.20.0/video.min.js'
      ]);
      this.initTuiEditor();
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
