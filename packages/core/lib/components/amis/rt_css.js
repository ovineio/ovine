/**
 * rt-css 样式渲染器
 * 可为组件 传入自定义 css
 */
import { Renderer } from 'amis';
import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
const RtCss = (props) => {
    const { css: getCss, htmlClassName = '', tag, render, className = '', body } = props;
    useEffect(() => {
        if (!htmlClassName) {
            return;
        }
        $('html').addClass(htmlClassName);
        // eslint-disable-next-line
        return () => {
            $('html').removeClass(htmlClassName);
        };
    }, []);
    return (React.createElement(StyledCss, { as: tag, className: className, css: getCss }, render('body', body)));
};
Renderer({
    test: /(^|\/)rt-css$/,
    name: 'rt-css',
})(RtCss);
const StyledCss = styled.div `
  ${(p) => css `
    ${!p.css ? undefined : typeof p.css === 'string' ? p.css : p.css(p.theme)};
  `};
`;
