export function camelCase(str) {
    return str.replace(/-([a-z])/g, ($0, $1) => $1.toUpperCase()).replace('-', '');
}

export function formatCss(props) {
    const prefixs = ['-webkit-', '-moz-', '-ms-'];

    const result = {};

    const regPrefix = /transform|transition/;


    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            const styleValue = props[key];

            if (regPrefix.test(key)) {
                for (let i = 0; i < prefixs.length; i++) {
                    const styleName = camelCase(prefixs[i] + key);
                    result[styleName] = styleValue.replace(regPrefix, `${prefixs[i]}$&`);
                }
            }

            result[key] = styleValue;
        }
    }

    return result;
}

export function addPrefixCss(element, props) {
    const formatedProps = formatCss(props);
    for (const key in formatedProps) {
        if (formatedProps.hasOwnProperty(key)) {
            element.style[key] = formatedProps[key];
        }
    }
}
