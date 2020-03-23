import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { ThemeConsumer } from 'styled-components';
import { app } from "../../../app";
import renderAmis from "./amis";
import Code, { containerSelector } from "./code";
import { resolveRtSchema, wrapCss } from "./func";
export const Amis = withRouter((props) => {
    const { schema, props: amisProps, option = {}, history } = props;
    const { preset, type } = schema;
    const showCode = !app.env.isRelease && (type === 'page' || type === 'rt-crud') && $(containerSelector).length;
    const envSchema = useMemo(() => {
        const origin = !showCode ? schema : cloneDeep(schema);
        const cssSchema = wrapCss(origin);
        if (isEmpty(preset)) {
            return cssSchema;
        }
        return resolveRtSchema(cssSchema);
    }, [schema]);
    return (React.createElement(ThemeConsumer, null, (theme) => (React.createElement(React.Fragment, null,
        renderAmis({
            history,
            theme,
            option,
            props: amisProps,
            schema: envSchema,
        }),
        showCode && React.createElement(Code, { theme: theme.name, schema: schema })))));
});
