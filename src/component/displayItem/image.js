/**
 * Image component
 */

import React from 'react';
import { Popover } from 'antd';

import styles from './index.less';
/* eslint-disable react/jsx-no-target-blank */
const ImgFiled = ({
  value,
  ...restProps
}) => {
  return (
    <div {...restProps}>
      <Popover
        placement="rightTop"
        content={
          <img className={styles.imgNormal} src={value} alt="图片" />
        }
      >
        <a href={value} target="_blank" data-export={value}>
          <img className={styles.imgThumb} src={value} alt="图片" />
        </a>
      </Popover>
    </div>
  );
};

export default ImgFiled;
