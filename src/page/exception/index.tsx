import * as React from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Exception, { ExceptionType } from '../../component/exception';
import styles from './index.less';

export default (props?: any): JSX.Element => {
  const type = typeof props === 'string' ? props : location.pathname.split('/').pop();
  const goback = typeof props === 'string' ? undefined :
    <Button onClick={props.history.goBack} type="primary">返回上一页</Button>;

  return (
    <Exception
      type={type as ExceptionType}
      className={classNames(styles.pageException)}
      linkElement={Link}
      actions={goback}
    />
  );
};
