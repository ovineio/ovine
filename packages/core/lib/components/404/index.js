/**
 * 404页面
 */
import React from 'react';
import styled from 'styled-components';
import { coreStatic } from "../../constants";
export default () => {
    return (React.createElement(NotFound, null,
        React.createElement("div", { className: "inner" },
            React.createElement("div", null),
            React.createElement("p", null, "\u5F53\u524D\u9875\u9762\u672A\u627E\u5230"))));
};
const NotFound = styled.div `
  .inner {
    text-align: center;
    & > div {
      margin: 100px auto 20px;
      width: 120px;
      height: 120px;
      background-image: url(${`${coreStatic}/404.png`});
      background-size: contain;
      background-repeat: no-repeat;
    }
    p {
      font-size: 16px;
    }
  }
`;
