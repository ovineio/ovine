import * as React from 'react';

export interface WrapperProps {
  beforeRender?: (args?: any) => any;
  render?: (args?: any) => React.ReactNode;
  afterRender?: (args?: any) => any;
  children?: any;
}

class Wrapper extends React.Component<WrapperProps> {
  componentDidMount() {
    const { afterRender } = this.props;
    if (typeof afterRender === 'function') {
      afterRender(this.props);
    }
  }

  render() {
    const { render, children } = this.props;

    if (typeof render === 'function') {
      return render(this.props);
    }

    return children;
  }
}

export default (props: WrapperProps) => {
  const { beforeRender, render, afterRender, children } = props;

  let renderProps = Object.assign({}, props);
  if (typeof beforeRender === 'function') {
    renderProps = beforeRender(props);
  }
  if (renderProps === false) {
    return null;
  }

  if (typeof render !== 'function' && typeof afterRender !== 'function') {
    return children;
  } else {
    return <Wrapper {...props} />;
  }
};
