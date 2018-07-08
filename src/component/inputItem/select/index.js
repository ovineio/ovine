import * as React from 'react';
import { map, isObject, get } from 'lodash';
import { Select } from 'antd';


export default class Text extends React.PureComponent {
  state = {
    options: this.props.options,
  };

  componentWillMount() {
    const { getOptions } = this.props;
    if (getOptions) {
      this.setState({
        options: getOptions(),
      });
    }
  }

  getProps = () => {
    const {
      options,
      toggleItems,
      getOptions,
      ...restProps
    } = this.props;

    let isToggle = false;
    map(options, item => {
      if (!isToggle && isObject(item) && item.hiddenKeys) {
        isToggle = true;
      }
    });

    if (isToggle) {
      restProps.onChange = (value) => {
        const hiddenKeys = get(options, `${value}.hiddenKeys`) || [];
        toggleItems(hiddenKeys);
        this.props.onChange(value);
      };
    }

    return restProps;
  }

  render() {
    const {
      label,
      placeholder,
      allowClear = true,
    } = this.props;

    const { options } = this.state;

    const props = this.getProps();

    return (
      <Select
        placeholder={placeholder || `请选择${label}`}
        allowClear={allowClear}
        {...props}
      >
        {
          map(options, (val, key) => {
            const text = isObject(val) ? val.text : val;
            return (
              <Select.Option key={key}>{text}</Select.Option>
            );
          })
        }
      </Select>
    );
  }
}
