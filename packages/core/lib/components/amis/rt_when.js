/**
 * rt-when 条件渲染器
 * 用于不同条件，渲染不同组件的情况
 */
import { Renderer } from 'amis';
import { evalExpression, evalJS } from 'amis/lib/utils/tpl';
const RtWhen = (props) => {
    const { condition, cases, render, data, ifTrue, ifFalse } = props;
    let schema = null;
    if (cases) {
        schema = cases.find(({ value }) => value === evalJS(condition, data));
        //
    }
    else if (ifTrue || ifFalse) {
        const result = evalExpression(condition, data);
        if (result && ifTrue) {
            schema = ifTrue;
        }
        if (!result && ifFalse) {
            schema = ifFalse;
        }
    }
    return !schema ? null : render('body', schema);
};
Renderer({
    test: /(^|\/)rt-when$/,
    name: 'rt-when',
})(RtWhen);
