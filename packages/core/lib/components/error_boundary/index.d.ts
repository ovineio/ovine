/**
 * 页面渲染错误处理
 */
import React from 'react';
declare type Props = {
    type?: 'page' | 'component' | 'entry';
    children: any;
};
declare type State = {
    hasError: boolean;
    online: boolean;
};
declare class ErrorBoundary extends React.Component<Props, State> {
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
    };
    constructor(props: any);
    componentDidMount(): void;
    componentDidCatch(error: any, errorInfo: any): void;
    private renderCompError;
    private renderPageError;
    render(): any;
}
export default ErrorBoundary;
