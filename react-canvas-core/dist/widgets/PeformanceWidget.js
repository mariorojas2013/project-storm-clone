import * as React from 'react';
import _isEqual from 'lodash/isEqual';
export class PeformanceWidget extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!this.props.model.performanceTune()) {
            return true;
        }
        // deserialization event
        if (this.props.model !== nextProps.model) {
            return true;
        }
        // change event
        return !_isEqual(this.props.serialized, nextProps.serialized);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'nodos_1' }, this.props.children()),
            " ",
            React.createElement("div", { className: 'nodos_2' }, " ")));
    }
}
//# sourceMappingURL=PeformanceWidget.js.map