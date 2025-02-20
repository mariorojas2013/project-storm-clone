import * as React from 'react';
import _keys from 'lodash/keys';
import { Toolkit } from '@projectstorm/react-canvas-core';
export class PortWidget extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    report() {
        this.props.port.updateCoords(this.props.engine.getPortCoords(this.props.port, this.ref.current));
    }
    componentWillUnmount() {
        this.engineListenerHandle && this.engineListenerHandle.deregister();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.port.reportedPosition) {
            this.report();
        }
    }
    componentDidMount() {
        this.engineListenerHandle = this.props.engine.registerListener({
            canvasReady: () => {
                this.report();
            }
        });
        if (this.props.engine.getCanvas()) {
            this.report();
        }
    }
    getExtraProps() {
        if (Toolkit.TESTING) {
            const links = _keys(this.props.port.getNode().getPort(this.props.port.getName()).links).join(',');
            return {
                'data-links': links
            };
        }
        return {};
    }
    render() {
        return (React.createElement("div", Object.assign({ style: this.props.style, ref: this.ref, className: `port ${this.props.className || ''}`, "data-name": this.props.port.getName(), "data-nodeid": this.props.port.getNode().getID() }, this.getExtraProps()), this.props.children));
    }
}
//# sourceMappingURL=PortWidget.js.map