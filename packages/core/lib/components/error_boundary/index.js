/**
 * 页面渲染错误处理
 */
import { uuid } from 'amis/lib/utils/helper';
import React from 'react';
import logger from "../../utils/logger";
import { StyledErrorPage } from "./styled";
const refreshPage = () => {
    const hash = uuid();
    const url = window.location.href;
    const refreshUrl = url.indexOf('_refresh=') > -1
        ? `${url.split('_refresh=')[0]}_refresh=${hash}` // 存在 _refresh 直接替换
        : `${url}${url.indexOf('?') === -1 ? '?' : '&'}_refresh=${uuid()})}`; // 否则添加一个刷新值
    window.location.href = refreshUrl;
};
const log = logger.getLogger('lib:components:ErrorBoundary');
class ErrorBoundary extends React.Component {
    static getDerivedStateFromError(error) {
        log.error('getDerivedStateFromError:', error);
        return { hasError: true };
    }
    constructor(props) {
        super(props);
        this.state = { hasError: false, online: true };
    }
    componentDidMount() {
        window.addEventListener('online', () => {
            this.setState({
                online: true,
            });
        });
        window.addEventListener('offline', () => {
            this.setState({
                online: false,
            });
        });
    }
    componentDidCatch(error, errorInfo) {
        log.error('componentDidCatch:', error, errorInfo);
    }
    // 页面内组件加载错误
    renderCompError() {
        return React.createElement("div", null, "\u7EC4\u4EF6\u9519\u8BEF");
    }
    // 页面加载错误
    renderPageError() {
        return (React.createElement(StyledErrorPage, null,
            React.createElement("div", { className: "inner" },
                React.createElement("div", null),
                React.createElement("p", null,
                    React.createElement("span", null, "\u5F53\u524D\u9875\u9762\u53D1\u751F\u9519\u8BEF"),
                    this.state.online && React.createElement("span", { onClick: refreshPage }, "\u5237\u65B0\u9875\u9762")))));
    }
    render() {
        const { children, type = 'component' } = this.props;
        const { hasError } = this.state;
        if (hasError) {
            switch (type) {
                case 'page':
                    return this.renderPageError();
                default:
                    return this.renderCompError();
            }
        }
        return children;
    }
}
export default ErrorBoundary;
