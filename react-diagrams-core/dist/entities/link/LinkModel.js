import { PointModel } from './PointModel';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _slice from 'lodash/slice';
import { boundingBoxFromPoints, Point, Rectangle } from '@projectstorm/geometry';
import { BaseModel } from '@projectstorm/react-canvas-core';
export class LinkModel extends BaseModel {
    constructor(options) {
        super(options);
        this.points = [
            new PointModel({
                link: this
            }),
            new PointModel({
                link: this
            })
        ];
        this.sourcePort = null;
        this.targetPort = null;
        this.renderedPaths = [];
        this.labels = [];
    }
    getBoundingBox() {
        return new Rectangle(boundingBoxFromPoints(_map(this.points, (point) => {
            return point.getPosition();
        })));
    }
    getSelectionEntities() {
        if (this.getTargetPort() && this.getSourcePort()) {
            return super.getSelectionEntities().concat(_slice(this.points, 1, this.points.length - 1));
        }
        // allow selection of the first point
        if (!this.getSourcePort()) {
            return super.getSelectionEntities().concat(_slice(this.points, 0, this.points.length - 1));
        }
        // allow selection of the last point
        if (!this.getTargetPort()) {
            return super.getSelectionEntities().concat(_slice(this.points, 1, this.points.length));
        }
        return super.getSelectionEntities().concat(this.points);
    }
    deserialize(event) {
        super.deserialize(event);
        this.points = _map(event.data.points || [], (point) => {
            var p = new PointModel({
                link: this,
                position: new Point(point.x, point.y)
            });
            p.deserialize(Object.assign(Object.assign({}, event), { data: point }));
            return p;
        });
        //deserialize labels
        _forEach(event.data.labels || [], (label) => {
            let labelOb = event.engine.getFactoryForLabel(label.type).generateModel({});
            labelOb.deserialize(Object.assign(Object.assign({}, event), { data: label }));
            this.addLabel(labelOb);
        });
        // these happen async, so we use the promises for these (they need to be done like this without the async keyword
        // because we need the deserailize method to finish for other methods while this happen
        if (event.data.target) {
            event.getModel(event.data.targetPort).then((model) => {
                this.setTargetPort(model);
            });
        }
        if (event.data.source) {
            event.getModel(event.data.sourcePort).then((model) => {
                this.setSourcePort(model);
            });
        }
    }
    getRenderedPath() {
        return this.renderedPaths;
    }
    setRenderedPaths(paths) {
        this.renderedPaths = paths;
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { source: this.sourcePort ? this.sourcePort.getParent().getID() : null, sourcePort: this.sourcePort ? this.sourcePort.getID() : null, target: this.targetPort ? this.targetPort.getParent().getID() : null, targetPort: this.targetPort ? this.targetPort.getID() : null, points: _map(this.points, (point) => {
                return point.serialize();
            }), labels: _map(this.labels, (label) => {
                return label.serialize();
            }) });
    }
    doClone(lookupTable = {}, clone) {
        clone.setPoints(_map(this.getPoints(), (point) => {
            return point.clone(lookupTable);
        }));
        if (this.sourcePort) {
            clone.setSourcePort(this.sourcePort.clone(lookupTable));
        }
        if (this.targetPort) {
            clone.setTargetPort(this.targetPort.clone(lookupTable));
        }
    }
    clearPort(port) {
        if (this.sourcePort === port) {
            this.setSourcePort(null);
        }
        else if (this.targetPort === port) {
            this.setTargetPort(null);
        }
    }
    remove() {
        if (this.sourcePort) {
            this.sourcePort.removeLink(this);
            delete this.sourcePort;
        }
        if (this.targetPort) {
            this.targetPort.removeLink(this);
            delete this.targetPort;
        }
        super.remove();
    }
    isLastPoint(point) {
        var index = this.getPointIndex(point);
        return index === this.points.length - 1;
    }
    getPointIndex(point) {
        return this.points.indexOf(point);
    }
    getPointModel(id) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].getID() === id) {
                return this.points[i];
            }
        }
        return null;
    }
    getPortForPoint(point) {
        if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
            return this.sourcePort;
        }
        if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
            return this.targetPort;
        }
        return null;
    }
    getPointForPort(port) {
        if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
            return this.getFirstPoint();
        }
        if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
            return this.getLastPoint();
        }
        return null;
    }
    getFirstPoint() {
        return this.points[0];
    }
    getLastPoint() {
        return this.points[this.points.length - 1];
    }
    setSourcePort(port) {
        if (port !== null) {
            port.addLink(this);
        }
        if (this.sourcePort !== null) {
            this.sourcePort.removeLink(this);
        }
        this.sourcePort = port;
        this.fireEvent({ port }, 'sourcePortChanged');
        if (port === null || port === void 0 ? void 0 : port.reportedPosition) {
            this.getPointForPort(port).setPosition(port.getCenter());
        }
    }
    getSourcePort() {
        return this.sourcePort;
    }
    getTargetPort() {
        return this.targetPort;
    }
    setTargetPort(port) {
        if (port !== null) {
            port.addLink(this);
        }
        if (this.targetPort !== null) {
            this.targetPort.removeLink(this);
        }
        this.targetPort = port;
        this.fireEvent({ port }, 'targetPortChanged');
        if (port === null || port === void 0 ? void 0 : port.reportedPosition) {
            this.getPointForPort(port).setPosition(port.getCenter());
        }
    }
    point(x, y, index = 1) {
        return this.addPoint(this.generatePoint(x, y), index);
    }
    addLabel(label) {
        label.setParent(this);
        this.labels.push(label);
    }
    getPoints() {
        return this.points;
    }
    getLabels() {
        return this.labels;
    }
    setPoints(points) {
        _forEach(points, (point) => {
            point.setParent(this);
        });
        this.points = points;
    }
    removePoint(pointModel) {
        if (this.isLastPoint(pointModel))
            this.remove();
        this.points.splice(this.getPointIndex(pointModel), 1);
    }
    removePointsBefore(pointModel) {
        this.points.splice(0, this.getPointIndex(pointModel));
    }
    removePointsAfter(pointModel) {
        this.points.splice(this.getPointIndex(pointModel) + 1);
    }
    removeMiddlePoints() {
        if (this.points.length > 2) {
            this.points.splice(1, this.points.length - 2);
        }
    }
    addPoint(pointModel, index = 1) {
        pointModel.setParent(this);
        this.points.splice(index, 0, pointModel);
        return pointModel;
    }
    generatePoint(x = 0, y = 0) {
        return new PointModel({
            link: this,
            position: new Point(x, y)
        });
    }
}
//# sourceMappingURL=LinkModel.js.map