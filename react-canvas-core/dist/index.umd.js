(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["projectstorm/react-canvas-core"] = factory();
	else
		root["projectstorm/react-canvas-core"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/CanvasEngine.js":
/*!******************************!*\
  !*** ./dist/CanvasEngine.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanvasEngine: () => (/* binding */ CanvasEngine)
/* harmony export */ });
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ "lodash/debounce");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_FactoryBank__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/FactoryBank */ "./dist/core/FactoryBank.js");
/* harmony import */ var _core_BaseObserver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/BaseObserver */ "./dist/core/BaseObserver.js");
/* harmony import */ var _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
/* harmony import */ var _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_projectstorm_geometry__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_actions_ActionEventBus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core-actions/ActionEventBus */ "./dist/core-actions/ActionEventBus.js");
/* harmony import */ var _actions_PanAndZoomCanvasAction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions/PanAndZoomCanvasAction */ "./dist/actions/PanAndZoomCanvasAction.js");
/* harmony import */ var _actions_ZoomCanvasAction__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions/ZoomCanvasAction */ "./dist/actions/ZoomCanvasAction.js");
/* harmony import */ var _actions_DeleteItemsAction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./actions/DeleteItemsAction */ "./dist/actions/DeleteItemsAction.js");
/* harmony import */ var _core_state_StateMachine__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core-state/StateMachine */ "./dist/core-state/StateMachine.js");









class CanvasEngine extends _core_BaseObserver__WEBPACK_IMPORTED_MODULE_2__.BaseObserver {
    constructor(options = {}) {
        super();
        this.model = null;
        this.eventBus = new _core_actions_ActionEventBus__WEBPACK_IMPORTED_MODULE_4__.ActionEventBus(this);
        this.stateMachine = new _core_state_StateMachine__WEBPACK_IMPORTED_MODULE_8__.StateMachine(this);
        this.layerFactories = new _core_FactoryBank__WEBPACK_IMPORTED_MODULE_1__.FactoryBank();
        this.registerFactoryBank(this.layerFactories);
        /**
         * Overrides the standard options with the possible given options
         */
        this.options = Object.assign({ registerDefaultDeleteItemsAction: true, registerDefaultZoomCanvasAction: true, repaintDebounceMs: 0 }, options);
        if (this.options.registerDefaultZoomCanvasAction === true) {
            this.eventBus.registerAction(new _actions_ZoomCanvasAction__WEBPACK_IMPORTED_MODULE_6__.ZoomCanvasAction());
        }
        else if (this.options.registerDefaultPanAndZoomCanvasAction === true) {
            this.eventBus.registerAction(new _actions_PanAndZoomCanvasAction__WEBPACK_IMPORTED_MODULE_5__.PanAndZoomCanvasAction());
        }
        if (this.options.registerDefaultDeleteItemsAction === true) {
            this.eventBus.registerAction(new _actions_DeleteItemsAction__WEBPACK_IMPORTED_MODULE_7__.DeleteItemsAction());
        }
    }
    getStateMachine() {
        return this.stateMachine;
    }
    getRelativeMousePoint(event) {
        const point = this.getRelativePoint(event.clientX, event.clientY);
        return new _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_3__.Point((point.x - this.model.getOffsetX()) / (this.model.getZoomLevel() / 100.0), (point.y - this.model.getOffsetY()) / (this.model.getZoomLevel() / 100.0));
    }
    getRelativePoint(x, y) {
        const canvasRect = this.canvas.getBoundingClientRect();
        return new _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_3__.Point(x - canvasRect.left, y - canvasRect.top);
    }
    registerFactoryBank(factory) {
        factory.registerListener({
            factoryAdded: (event) => {
                event.factory.setDiagramEngine(this);
            },
            factoryRemoved: (event) => {
                event.factory.setDiagramEngine(null);
            }
        });
    }
    getActionEventBus() {
        return this.eventBus;
    }
    getLayerFactories() {
        return this.layerFactories;
    }
    getFactoryForLayer(layer) {
        if (typeof layer === 'string') {
            return this.layerFactories.getFactory(layer);
        }
        return this.layerFactories.getFactory(layer.getType());
    }
    setModel(model) {
        this.model = model;
        if (this.canvas) {
            requestAnimationFrame(() => {
                this.repaintCanvas();
            });
        }
    }
    getModel() {
        return this.model;
    }
    repaintCanvas(promise) {
        const { repaintDebounceMs } = this.options;
        /**
         * The actual repaint function
         */
        const repaint = () => {
            this.iterateListeners((listener) => {
                if (listener.repaintCanvas) {
                    listener.repaintCanvas();
                }
            });
        };
        // if the `repaintDebounceMs` option is > 0, then apply the debounce
        let repaintFn = repaint;
        if (repaintDebounceMs > 0) {
            repaintFn = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(repaint, repaintDebounceMs);
        }
        if (promise) {
            return new Promise((resolve) => {
                const l = this.registerListener({
                    rendered: () => {
                        resolve();
                        l.deregister();
                    }
                });
                repaintFn();
            });
        }
        repaintFn();
    }
    setCanvas(canvas) {
        if (this.canvas !== canvas) {
            this.canvas = canvas;
            if (canvas) {
                this.fireEvent({}, 'canvasReady');
            }
        }
    }
    getCanvas() {
        return this.canvas;
    }
    getMouseElement(event) {
        return null;
    }
    zoomToFit() {
        const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
        const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
        const zoomFactor = xFactor < yFactor ? xFactor : yFactor;
        this.model.setZoomLevel(this.model.getZoomLevel() * zoomFactor);
        this.model.setOffset(0, 0);
        this.repaintCanvas();
    }
}


/***/ }),

/***/ "./dist/Toolkit.js":
/*!*************************!*\
  !*** ./dist/Toolkit.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Toolkit: () => (/* binding */ Toolkit)
/* harmony export */ });
class Toolkit {
    /**
     * Generats a unique ID (thanks Stack overflow :3)
     * @returns {String}
     */
    static UID() {
        if (Toolkit.TESTING) {
            Toolkit.TESTING_UID++;
            return `${Toolkit.TESTING_UID}`;
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    static closest(element, selector) {
        if (!Element.prototype.closest) {
            Element.prototype.closest = function (s) {
                var el = this;
                do {
                    if (Element.prototype.matches.call(el, s))
                        return el;
                    el = el.parentElement || el.parentNode;
                } while (el !== null && el.nodeType === 1);
                return null;
            };
        }
        return element.closest(selector);
    }
}
Toolkit.TESTING = false;
Toolkit.TESTING_UID = 0;


/***/ }),

/***/ "./dist/actions/DeleteItemsAction.js":
/*!*******************************************!*\
  !*** ./dist/actions/DeleteItemsAction.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeleteItemsAction: () => (/* binding */ DeleteItemsAction)
/* harmony export */ });
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
/* harmony import */ var lodash_forEach__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/forEach */ "lodash/forEach");
/* harmony import */ var lodash_forEach__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_forEach__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/isEqual */ "lodash/isEqual");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_2__);



/**
 * Deletes all selected items
 */
class DeleteItemsAction extends _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.Action {
    constructor(options = {}) {
        const keyCodes = options.keyCodes || [46, 8];
        const modifiers = Object.assign({ ctrlKey: false, shiftKey: false, altKey: false, metaKey: false }, options.modifiers);
        super({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.KEY_DOWN,
            fire: (event) => {
                const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = event.event;
                if (keyCodes.indexOf(keyCode) !== -1 && lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default()({ ctrlKey, shiftKey, altKey, metaKey }, modifiers)) {
                    lodash_forEach__WEBPACK_IMPORTED_MODULE_1___default()(this.engine.getModel().getSelectedEntities(), (model) => {
                        // only delete items which are not locked
                        if (!model.isLocked()) {
                            model.remove();
                        }
                    });
                    this.engine.repaintCanvas();
                }
            }
        });
    }
}


/***/ }),

/***/ "./dist/actions/PanAndZoomCanvasAction.js":
/*!************************************************!*\
  !*** ./dist/actions/PanAndZoomCanvasAction.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanAndZoomCanvasAction: () => (/* binding */ PanAndZoomCanvasAction)
/* harmony export */ });
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");

class PanAndZoomCanvasAction extends _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.Action {
    constructor(options = {}) {
        super({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.MOUSE_WHEEL,
            fire: (actionEvent) => {
                const { event } = actionEvent;
                // we can block layer rendering because we are only targeting the transforms
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(false);
                }
                const model = this.engine.getModel();
                event.stopPropagation();
                if (event.ctrlKey) {
                    // Pinch and zoom gesture
                    const oldZoomFactor = this.engine.getModel().getZoomLevel() / 100;
                    let scrollDelta = options.inverseZoom ? event.deltaY : -event.deltaY;
                    scrollDelta /= 3;
                    if (model.getZoomLevel() + scrollDelta > 10) {
                        model.setZoomLevel(model.getZoomLevel() + scrollDelta);
                    }
                    const zoomFactor = model.getZoomLevel() / 100;
                    const boundingRect = event.currentTarget.getBoundingClientRect();
                    const clientWidth = boundingRect.width;
                    const clientHeight = boundingRect.height;
                    // compute difference between rect before and after scroll
                    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                    // compute mouse coords relative to canvas
                    const clientX = event.clientX - boundingRect.left;
                    const clientY = event.clientY - boundingRect.top;
                    // compute width and height increment factor
                    const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
                    const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;
                    model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);
                }
                else {
                    // Pan gesture
                    let yDelta = options.inverseZoom ? -event.deltaY : event.deltaY;
                    let xDelta = options.inverseZoom ? -event.deltaX : event.deltaX;
                    model.setOffset(model.getOffsetX() - xDelta, model.getOffsetY() - yDelta);
                }
                this.engine.repaintCanvas();
                // re-enable rendering
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(true);
                }
            }
        });
    }
}


/***/ }),

/***/ "./dist/actions/ZoomCanvasAction.js":
/*!******************************************!*\
  !*** ./dist/actions/ZoomCanvasAction.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZoomCanvasAction: () => (/* binding */ ZoomCanvasAction)
/* harmony export */ });
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");

class ZoomCanvasAction extends _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.Action {
    constructor(options = {}) {
        super({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.MOUSE_WHEEL,
            fire: (actionEvent) => {
                const { event } = actionEvent;
                // we can block layer rendering because we are only targeting the transforms
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(false);
                }
                const model = this.engine.getModel();
                event.stopPropagation();
                const oldZoomFactor = this.engine.getModel().getZoomLevel() / 100;
                let scrollDelta = options.inverseZoom ? -event.deltaY : event.deltaY;
                //check if it is pinch gesture
                if (event.ctrlKey && scrollDelta % 1 !== 0) {
                    /*
                        Chrome and Firefox sends wheel event with deltaY that
                        have fractional part, also `ctrlKey` prop of the event is true
                        though ctrl isn't pressed
                    */
                    scrollDelta /= 3;
                }
                else {
                    scrollDelta /= 60;
                }
                if (model.getZoomLevel() + scrollDelta > 10) {
                    model.setZoomLevel(model.getZoomLevel() + scrollDelta);
                }
                const zoomFactor = model.getZoomLevel() / 100;
                const boundingRect = event.currentTarget.getBoundingClientRect();
                const clientWidth = boundingRect.width;
                const clientHeight = boundingRect.height;
                // compute difference between rect before and after scroll
                const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                // compute mouse coords relative to canvas
                const clientX = event.clientX - boundingRect.left;
                const clientY = event.clientY - boundingRect.top;
                // compute width and height increment factor
                const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
                const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;
                model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);
                this.engine.repaintCanvas();
                // re-enable rendering
                for (let layer of this.engine.getModel().getLayers()) {
                    layer.allowRepaint(true);
                }
            }
        });
    }
}


/***/ }),

/***/ "./dist/core-actions/Action.js":
/*!*************************************!*\
  !*** ./dist/core-actions/Action.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Action: () => (/* binding */ Action),
/* harmony export */   InputType: () => (/* binding */ InputType)
/* harmony export */ });
/* harmony import */ var _Toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Toolkit */ "./dist/Toolkit.js");

var InputType;
(function (InputType) {
    InputType["MOUSE_DOWN"] = "mouse-down";
    InputType["MOUSE_UP"] = "mouse-up";
    InputType["MOUSE_MOVE"] = "mouse-move";
    InputType["MOUSE_WHEEL"] = "mouse-wheel";
    InputType["KEY_DOWN"] = "key-down";
    InputType["KEY_UP"] = "key-up";
    InputType["TOUCH_START"] = "touch-start";
    InputType["TOUCH_END"] = "touch-end";
    InputType["TOUCH_MOVE"] = "touch-move";
})(InputType || (InputType = {}));
class Action {
    constructor(options) {
        this.options = options;
        this.id = _Toolkit__WEBPACK_IMPORTED_MODULE_0__.Toolkit.UID();
    }
    setEngine(engine) {
        this.engine = engine;
    }
}


/***/ }),

/***/ "./dist/core-actions/ActionEventBus.js":
/*!*********************************************!*\
  !*** ./dist/core-actions/ActionEventBus.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionEventBus: () => (/* binding */ ActionEventBus)
/* harmony export */ });
/* harmony import */ var _Action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Action */ "./dist/core-actions/Action.js");
/* harmony import */ var lodash_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/filter */ "lodash/filter");
/* harmony import */ var lodash_filter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_filter__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/keys */ "lodash/keys");
/* harmony import */ var lodash_keys__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_keys__WEBPACK_IMPORTED_MODULE_2__);



class ActionEventBus {
    constructor(engine) {
        this.actions = {};
        this.engine = engine;
        this.keys = {};
    }
    getKeys() {
        return lodash_keys__WEBPACK_IMPORTED_MODULE_2___default()(this.keys);
    }
    registerAction(action) {
        action.setEngine(this.engine);
        this.actions[action.id] = action;
        return () => {
            this.deregisterAction(action);
        };
    }
    deregisterAction(action) {
        action.setEngine(null);
        delete this.actions[action.id];
    }
    getActionsForType(type) {
        return lodash_filter__WEBPACK_IMPORTED_MODULE_1___default()(this.actions, (action) => {
            return action.options.type === type;
        });
    }
    getModelForEvent(actionEvent) {
        if (actionEvent.model) {
            return actionEvent.model;
        }
        return this.engine.getMouseElement(actionEvent.event);
    }
    getActionsForEvent(actionEvent) {
        const { event } = actionEvent;
        if (event.type === 'mousedown') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.MOUSE_DOWN);
        }
        else if (event.type === 'mouseup') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.MOUSE_UP);
        }
        else if (event.type === 'keydown') {
            // store the recorded key
            this.keys[event.key.toLowerCase()] = true;
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.KEY_DOWN);
        }
        else if (event.type === 'keyup') {
            // delete the recorded key
            delete this.keys[event.key.toLowerCase()];
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.KEY_UP);
        }
        else if (event.type === 'mousemove') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.MOUSE_MOVE);
        }
        else if (event.type === 'wheel') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.MOUSE_WHEEL);
        }
        else if (event.type === 'touchstart') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.TOUCH_START);
        }
        else if (event.type === 'touchend') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.TOUCH_END);
        }
        else if (event.type === 'touchmove') {
            return this.getActionsForType(_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.TOUCH_MOVE);
        }
        return [];
    }
    fireAction(actionEvent) {
        const actions = this.getActionsForEvent(actionEvent);
        for (let action of actions) {
            action.options.fire(actionEvent);
        }
    }
}


/***/ }),

/***/ "./dist/core-models/BaseEntity.js":
/*!****************************************!*\
  !*** ./dist/core-models/BaseEntity.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseEntity: () => (/* binding */ BaseEntity)
/* harmony export */ });
/* harmony import */ var _Toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Toolkit */ "./dist/Toolkit.js");
/* harmony import */ var lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/cloneDeep */ "lodash/cloneDeep");
/* harmony import */ var lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_BaseObserver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/BaseObserver */ "./dist/core/BaseObserver.js");



class BaseEntity extends _core_BaseObserver__WEBPACK_IMPORTED_MODULE_2__.BaseObserver {
    constructor(options = {}) {
        super();
        this.options = Object.assign({ id: _Toolkit__WEBPACK_IMPORTED_MODULE_0__.Toolkit.UID() }, options);
    }
    getOptions() {
        return this.options;
    }
    getID() {
        return this.options.id;
    }
    doClone(lookupTable = {}, clone) {
        /*noop*/
    }
    clone(lookupTable = {}) {
        // try and use an existing clone first
        if (lookupTable[this.options.id]) {
            return lookupTable[this.options.id];
        }
        let clone = lodash_cloneDeep__WEBPACK_IMPORTED_MODULE_1___default()(this);
        clone.options = Object.assign(Object.assign({}, this.options), { id: _Toolkit__WEBPACK_IMPORTED_MODULE_0__.Toolkit.UID() });
        clone.clearListeners();
        lookupTable[this.options.id] = clone;
        this.doClone(lookupTable, clone);
        return clone;
    }
    clearListeners() {
        this.listeners = {};
    }
    deserialize(event) {
        this.options.id = event.data.id;
        this.options.locked = event.data.locked;
    }
    serialize() {
        return {
            id: this.options.id,
            locked: this.options.locked,
            isWorktable: this.options.isWorktable
        };
    }
    fireEvent(event, k) {
        super.fireEvent(Object.assign({ entity: this }, event), k);
    }
    isLocked() {
        return this.options.locked;
    }
    setLocked(locked = true) {
        this.options.locked = locked;
        this.fireEvent({
            locked: locked
        }, 'lockChanged');
    }
}


/***/ }),

/***/ "./dist/core-models/BaseModel.js":
/*!***************************************!*\
  !*** ./dist/core-models/BaseModel.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseModel: () => (/* binding */ BaseModel)
/* harmony export */ });
/* harmony import */ var _BaseEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseEntity */ "./dist/core-models/BaseEntity.js");
/* harmony import */ var _entities_canvas_CanvasModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../entities/canvas/CanvasModel */ "./dist/entities/canvas/CanvasModel.js");


class BaseModel extends _BaseEntity__WEBPACK_IMPORTED_MODULE_0__.BaseEntity {
    constructor(options) {
        super(options);
    }
    performanceTune() {
        return true;
    }
    getParentCanvasModel() {
        if (!this.parent) {
            return null;
        }
        if (this.parent instanceof _entities_canvas_CanvasModel__WEBPACK_IMPORTED_MODULE_1__.CanvasModel) {
            return this.parent;
        }
        else if (this.parent instanceof BaseModel) {
            return this.parent.getParentCanvasModel();
        }
        return null;
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getSelectionEntities() {
        return [this];
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { type: this.options.type, selected: this.options.selected, extras: this.options.extras });
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.extras = event.data.extras;
        this.options.selected = event.data.selected;
    }
    getType() {
        return this.options.type;
    }
    isSelected() {
        return this.options.selected;
    }
    isLocked() {
        const locked = super.isLocked();
        if (locked) {
            return true;
        }
        // delegate this call up to the parent
        if (this.parent) {
            return this.parent.isLocked();
        }
        return false;
    }
    setSelected(selected = true) {
        if (this.options.selected !== selected) {
            this.options.selected = selected;
            this.fireEvent({
                isSelected: selected
            }, 'selectionChanged');
        }
    }
    remove() {
        this.fireEvent({}, 'entityRemoved');
    }
}


/***/ }),

/***/ "./dist/core-models/BasePositionModel.js":
/*!***********************************************!*\
  !*** ./dist/core-models/BasePositionModel.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BasePositionModel: () => (/* binding */ BasePositionModel)
/* harmony export */ });
/* harmony import */ var _BaseModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseModel */ "./dist/core-models/BaseModel.js");
/* harmony import */ var _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
/* harmony import */ var _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__);


class BasePositionModel extends _BaseModel__WEBPACK_IMPORTED_MODULE_0__.BaseModel {
    constructor(options) {
        super(options);
        this.position = options.position || new _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__.Point(0, 0);
    }
    setPosition(x, y) {
        if (x instanceof _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__.Point) {
            this.position = x;
        }
        else {
            this.position = new _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__.Point(x, y);
        }
        this.fireEvent({}, 'positionChanged');
    }
    getBoundingBox() {
        return _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__.Rectangle.fromPointAndSize(this.position, 0, 0);
    }
    deserialize(event) {
        super.deserialize(event);
        this.position = new _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_1__.Point(event.data.x, event.data.y);
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { x: this.position.x, y: this.position.y });
    }
    getPosition() {
        return this.position;
    }
    getX() {
        return this.position.x;
    }
    getY() {
        return this.position.y;
    }
}


/***/ }),

/***/ "./dist/core-state/AbstractDisplacementState.js":
/*!******************************************************!*\
  !*** ./dist/core-state/AbstractDisplacementState.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractDisplacementState: () => (/* binding */ AbstractDisplacementState)
/* harmony export */ });
/* harmony import */ var _State__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./State */ "./dist/core-state/State.js");
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");


class AbstractDisplacementState extends _State__WEBPACK_IMPORTED_MODULE_0__.State {
    constructor(options) {
        super(options);
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.MOUSE_DOWN,
            fire: (actionEvent) => {
                const { clientX, clientY } = actionEvent.event;
                this.handleMoveStart(clientX, clientY);
            }
        }));
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.MOUSE_MOVE,
            fire: (actionEvent) => {
                const { event } = actionEvent;
                if (event.buttons === 0) {
                    // If buttons is 0, it means the mouse is not down, the user may have released it
                    // outside of the canvas, then we eject the state
                    this.eject();
                    return;
                }
                const { clientX, clientY } = event;
                this.handleMove(clientX, clientY, event);
            }
        }));
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.MOUSE_UP,
            fire: () => this.handleMoveEnd()
        }));
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.TOUCH_START,
            fire: (actionEvent) => {
                const { clientX, clientY } = actionEvent.event.touches[0];
                this.handleMoveStart(clientX, clientY);
            }
        }));
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.TOUCH_MOVE,
            fire: (actionEvent) => {
                const { event } = actionEvent;
                const { clientX, clientY } = event.touches[0];
                this.handleMove(clientX, clientY, event);
            }
        }));
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.TOUCH_END,
            fire: () => this.handleMoveEnd()
        }));
    }
    handleMoveStart(x, y) {
        this.initialX = x;
        this.initialY = y;
        const rel = this.engine.getRelativePoint(x, y);
        this.initialXRelative = rel.x;
        this.initialYRelative = rel.y;
    }
    handleMove(x, y, event) {
        this.fireMouseMoved({
            displacementX: x - this.initialX,
            displacementY: y - this.initialY,
            virtualDisplacementX: (x - this.initialX) / (this.engine.getModel().getZoomLevel() / 100.0),
            virtualDisplacementY: (y - this.initialY) / (this.engine.getModel().getZoomLevel() / 100.0),
            event
        });
    }
    handleMoveEnd() {
        this.eject();
    }
}


/***/ }),

/***/ "./dist/core-state/State.js":
/*!**********************************!*\
  !*** ./dist/core-state/State.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   State: () => (/* binding */ State)
/* harmony export */ });
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
/* harmony import */ var lodash_intersection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/intersection */ "lodash/intersection");
/* harmony import */ var lodash_intersection__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_intersection__WEBPACK_IMPORTED_MODULE_1__);


class State {
    constructor(options) {
        this.actions = [];
        this.keys = [];
        this.childStates = [];
        this.options = options;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    getOptions() {
        return this.options;
    }
    eject() {
        this.engine.getStateMachine().popState();
    }
    transitionWithEvent(state, event) {
        this.engine.getStateMachine().pushState(state);
        this.engine.getActionEventBus().fireAction(event);
    }
    registerAction(action) {
        this.actions.push(action);
    }
    tryActivateParentState(keys) {
        if (this.keys.length > 0 && !this.isKeysFullfilled(keys)) {
            this.eject();
            return true;
        }
        return false;
    }
    tryActivateChildState(keys) {
        const state = this.findStateToActivate(keys);
        if (state) {
            this.engine.getStateMachine().pushState(state);
            return true;
        }
        return false;
    }
    findStateToActivate(keys) {
        for (let child of this.childStates) {
            if (child.isKeysFullfilled(keys)) {
                return child;
            }
        }
        return null;
    }
    isKeysFullfilled(keys) {
        return lodash_intersection__WEBPACK_IMPORTED_MODULE_1___default()(this.keys, keys).length === this.keys.length;
    }
    activated(previous) {
        const keys = this.engine.getActionEventBus().getKeys();
        if (this.tryActivateParentState(keys) || this.tryActivateChildState(keys)) {
            return;
        }
        // perhaps we need to pop again?
        this.handler1 = this.engine.getActionEventBus().registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.KEY_DOWN,
            fire: () => {
                this.tryActivateChildState(this.engine.getActionEventBus().getKeys());
            }
        }));
        this.handler2 = this.engine.getActionEventBus().registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_0__.InputType.KEY_UP,
            fire: () => {
                this.tryActivateParentState(this.engine.getActionEventBus().getKeys());
            }
        }));
        for (let action of this.actions) {
            this.engine.getActionEventBus().registerAction(action);
        }
    }
    deactivated(next) {
        if (this.handler1) {
            this.handler1();
        }
        if (this.handler2) {
            this.handler2();
        }
        // if this happens, we are going into heirachial state machine mode
        for (let action of this.actions) {
            this.engine.getActionEventBus().deregisterAction(action);
        }
    }
}


/***/ }),

/***/ "./dist/core-state/StateMachine.js":
/*!*****************************************!*\
  !*** ./dist/core-state/StateMachine.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateMachine: () => (/* binding */ StateMachine)
/* harmony export */ });
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/last */ "lodash/last");
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_last__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_BaseObserver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/BaseObserver */ "./dist/core/BaseObserver.js");


class StateMachine extends _core_BaseObserver__WEBPACK_IMPORTED_MODULE_1__.BaseObserver {
    constructor(engine) {
        super();
        this.engine = engine;
        this.stateStack = [];
    }
    getCurrentState() {
        return this.currentState;
    }
    pushState(state) {
        this.stateStack.push(state);
        this.setState(state);
    }
    popState() {
        this.stateStack.pop();
        this.setState(lodash_last__WEBPACK_IMPORTED_MODULE_0___default()(this.stateStack));
    }
    setState(state) {
        state.setEngine(this.engine);
        // if no state object, get the initial state
        if (this.currentState) {
            this.currentState.deactivated(state);
        }
        const old = this.currentState;
        this.currentState = state;
        if (this.currentState) {
            this.currentState.activated(old);
            this.fireEvent({
                newState: state
            }, 'stateChanged');
        }
    }
}


/***/ }),

/***/ "./dist/core/AbstractFactory.js":
/*!**************************************!*\
  !*** ./dist/core/AbstractFactory.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractFactory: () => (/* binding */ AbstractFactory)
/* harmony export */ });
/**
 * Base factory for all the different types of entities.
 * Gets registered with the engine, and is used to generate models
 */
class AbstractFactory {
    constructor(type) {
        this.type = type;
    }
    setDiagramEngine(engine) {
        this.engine = engine;
    }
    setFactoryBank(bank) {
        this.bank = bank;
    }
    getType() {
        return this.type;
    }
}


/***/ }),

/***/ "./dist/core/AbstractModelFactory.js":
/*!*******************************************!*\
  !*** ./dist/core/AbstractModelFactory.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractModelFactory: () => (/* binding */ AbstractModelFactory)
/* harmony export */ });
/* harmony import */ var _AbstractFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractFactory */ "./dist/core/AbstractFactory.js");

class AbstractModelFactory extends _AbstractFactory__WEBPACK_IMPORTED_MODULE_0__.AbstractFactory {
}


/***/ }),

/***/ "./dist/core/AbstractReactFactory.js":
/*!*******************************************!*\
  !*** ./dist/core/AbstractReactFactory.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractReactFactory: () => (/* binding */ AbstractReactFactory)
/* harmony export */ });
/* harmony import */ var _AbstractModelFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractModelFactory */ "./dist/core/AbstractModelFactory.js");

/**
 * Further extends the AbstractFactory to add widget generation capability.
 */
class AbstractReactFactory extends _AbstractModelFactory__WEBPACK_IMPORTED_MODULE_0__.AbstractModelFactory {
}


/***/ }),

/***/ "./dist/core/BaseObserver.js":
/*!***********************************!*\
  !*** ./dist/core/BaseObserver.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseObserver: () => (/* binding */ BaseObserver)
/* harmony export */ });
/* harmony import */ var _Toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Toolkit */ "./dist/Toolkit.js");

/**
 * Base observer pattern class for working with listeners
 */
class BaseObserver {
    constructor() {
        this.listeners = {};
    }
    fireEventInternal(fire, k, event) {
        this.iterateListeners((listener) => {
            // returning false here will instruct itteration to stop
            if (!fire && !event.firing) {
                return false;
            }
            // fire selected listener
            if (listener[k]) {
                listener[k](event);
            }
        });
    }
    fireEvent(event, k) {
        event = Object.assign({ firing: true, stopPropagation: () => {
                event.firing = false;
            } }, event);
        // fire pre
        this.fireEventInternal(true, 'eventWillFire', Object.assign(Object.assign({}, event), { function: k }));
        // fire main event
        this.fireEventInternal(false, k, event);
        // fire post
        this.fireEventInternal(true, 'eventDidFire', Object.assign(Object.assign({}, event), { function: k }));
    }
    iterateListeners(cb) {
        for (let id in this.listeners) {
            const res = cb(this.listeners[id]);
            // cancel itteration on false
            if (res === false) {
                return;
            }
        }
    }
    getListenerHandle(listener) {
        for (let id in this.listeners) {
            if (this.listeners[id] === listener) {
                return {
                    id: id,
                    listener: listener,
                    deregister: () => {
                        delete this.listeners[id];
                    }
                };
            }
        }
    }
    registerListener(listener) {
        const id = _Toolkit__WEBPACK_IMPORTED_MODULE_0__.Toolkit.UID();
        this.listeners[id] = listener;
        return {
            id: id,
            listener: listener,
            deregister: () => {
                delete this.listeners[id];
            }
        };
    }
    deregisterListener(listener) {
        if (typeof listener === 'object') {
            listener.deregister();
            return true;
        }
        const handle = this.getListenerHandle(listener);
        if (handle) {
            handle.deregister();
            return true;
        }
        return false;
    }
}


/***/ }),

/***/ "./dist/core/FactoryBank.js":
/*!**********************************!*\
  !*** ./dist/core/FactoryBank.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FactoryBank: () => (/* binding */ FactoryBank)
/* harmony export */ });
/* harmony import */ var _BaseObserver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseObserver */ "./dist/core/BaseObserver.js");
/* harmony import */ var lodash_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/values */ "lodash/values");
/* harmony import */ var lodash_values__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_values__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Store and managed Factories that extend from Abstractfactory
 */
class FactoryBank extends _BaseObserver__WEBPACK_IMPORTED_MODULE_0__.BaseObserver {
    constructor() {
        super();
        this.factories = {};
    }
    getFactories() {
        return lodash_values__WEBPACK_IMPORTED_MODULE_1___default()(this.factories);
    }
    clearFactories() {
        for (let factory in this.factories) {
            this.deregisterFactory(factory);
        }
    }
    getFactory(type) {
        if (!this.factories[type]) {
            throw new Error(`Cannot find factory with type [${type}]`);
        }
        return this.factories[type];
    }
    registerFactory(factory) {
        factory.setFactoryBank(this);
        this.factories[factory.getType()] = factory;
        // todo fixme
        this.fireEvent({ factory }, 'factoryAdded');
    }
    deregisterFactory(type) {
        const factory = this.factories[type];
        factory.setFactoryBank(null);
        delete this.factories[type];
        // todo fixme
        this.fireEvent({ factory }, 'factoryRemoved');
    }
}


/***/ }),

/***/ "./dist/core/ModelGeometryInterface.js":
/*!*********************************************!*\
  !*** ./dist/core/ModelGeometryInterface.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./dist/entities/canvas/CanvasModel.js":
/*!*********************************************!*\
  !*** ./dist/entities/canvas/CanvasModel.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanvasModel: () => (/* binding */ CanvasModel)
/* harmony export */ });
/* harmony import */ var lodash_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/filter */ "lodash/filter");
/* harmony import */ var lodash_filter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_filter__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_flatMap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/flatMap */ "lodash/flatMap");
/* harmony import */ var lodash_flatMap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_flatMap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_forEach__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/forEach */ "lodash/forEach");
/* harmony import */ var lodash_forEach__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_forEach__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/map */ "lodash/map");
/* harmony import */ var lodash_map__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_map__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/values */ "lodash/values");
/* harmony import */ var lodash_values__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_values__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_models_BaseEntity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core-models/BaseEntity */ "./dist/core-models/BaseEntity.js");






class CanvasModel extends _core_models_BaseEntity__WEBPACK_IMPORTED_MODULE_5__.BaseEntity {
    constructor(options = {}) {
        super(Object.assign({ zoom: 100, gridSize: 0, offsetX: 0, offsetY: 0 }, options));
        this.layers = [];
    }
    getSelectionEntities() {
        return lodash_flatMap__WEBPACK_IMPORTED_MODULE_1___default()(this.layers, (layer) => {
            return layer.getSelectionEntities();
        });
    }
    getSelectedEntities() {
        return lodash_filter__WEBPACK_IMPORTED_MODULE_0___default()(this.getSelectionEntities(), (ob) => {
            return ob.isSelected();
        });
    }
    clearSelection() {
        lodash_forEach__WEBPACK_IMPORTED_MODULE_2___default()(this.getSelectedEntities(), (element) => {
            element.setSelected(false);
        });
    }
    getModels() {
        return lodash_flatMap__WEBPACK_IMPORTED_MODULE_1___default()(this.layers, (layer) => {
            return lodash_values__WEBPACK_IMPORTED_MODULE_4___default()(layer.getModels());
        });
    }
    addLayer(layer) {
        layer.setParent(this);
        layer.registerListener({
            entityRemoved: (event) => { }
        });
        this.layers.push(layer);
    }
    removeLayer(layer) {
        const index = this.layers.indexOf(layer);
        if (index !== -1) {
            this.layers.splice(index, 1);
            return true;
        }
        return false;
    }
    getLayers() {
        return this.layers;
    }
    setGridSize(size = 0) {
        this.options.gridSize = size;
        this.fireEvent({ size: size }, 'gridUpdated');
    }
    getGridPosition(pos) {
        if (this.options.gridSize === 0) {
            return pos;
        }
        return this.options.gridSize * Math.floor((pos + this.options.gridSize / 2) / this.options.gridSize);
    }
    deserializeModel(data, engine) {
        const models = {};
        const promises = {};
        const resolvers = {};
        const event = {
            data: data,
            engine: engine,
            registerModel: (model) => {
                models[model.getID()] = model;
                if (resolvers[model.getID()]) {
                    resolvers[model.getID()](model);
                }
            },
            getModel(id) {
                if (models[id]) {
                    return Promise.resolve(models[id]);
                }
                if (!promises[id]) {
                    promises[id] = new Promise((resolve) => {
                        resolvers[id] = resolve;
                    });
                }
                return promises[id];
            }
        };
        this.deserialize(event);
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.offsetX = event.data.offsetX;
        this.options.offsetY = event.data.offsetY;
        this.options.zoom = event.data.zoom;
        this.options.gridSize = event.data.gridSize;
        lodash_forEach__WEBPACK_IMPORTED_MODULE_2___default()(event.data.layers, (layer) => {
            const layerOb = event.engine.getFactoryForLayer(layer.type).generateModel({
                initialConfig: layer
            });
            layerOb.deserialize(Object.assign(Object.assign({}, event), { data: layer }));
            this.addLayer(layerOb);
        });
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { offsetX: this.options.offsetX, offsetY: this.options.offsetY, zoom: this.options.zoom, gridSize: this.options.gridSize, layers: lodash_map__WEBPACK_IMPORTED_MODULE_3___default()(this.layers, (layer) => {
                return layer.serialize();
            }) });
    }
    setZoomLevel(zoom) {
        this.options.zoom = zoom;
        this.fireEvent({ zoom }, 'zoomUpdated');
    }
    setOffset(offsetX, offsetY) {
        this.options.offsetX = offsetX;
        this.options.offsetY = offsetY;
        this.fireEvent({ offsetX, offsetY }, 'offsetUpdated');
    }
    setOffsetX(offsetX) {
        this.setOffset(offsetX, this.options.offsetY);
    }
    setOffsetY(offsetY) {
        this.setOffset(this.options.offsetX, offsetY);
    }
    getOffsetY() {
        return this.options.offsetY;
    }
    getOffsetX() {
        return this.options.offsetX;
    }
    getZoomLevel() {
        return this.options.zoom;
    }
}


/***/ }),

/***/ "./dist/entities/canvas/CanvasWidget.js":
/*!**********************************************!*\
  !*** ./dist/entities/canvas/CanvasWidget.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanvasWidget: () => (/* binding */ CanvasWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _layer_TransformLayerWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layer/TransformLayerWidget */ "./dist/entities/layer/TransformLayerWidget.js");
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_emotion_styled__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _layer_SmartLayerWidget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layer/SmartLayerWidget */ "./dist/entities/layer/SmartLayerWidget.js");




var S;
(function (S) {
    S.Canvas = (_emotion_styled__WEBPACK_IMPORTED_MODULE_2___default().div) `
		position: relative;
		cursor: move;
		overflow: hidden;
	`;
})(S || (S = {}));
class CanvasWidget extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(props) {
        super(props);
        this.ref = react__WEBPACK_IMPORTED_MODULE_0__.createRef();
        this.state = {
            action: null,
            diagramEngineListener: null
        };
    }
    componentWillUnmount() {
        this.props.engine.deregisterListener(this.canvasListener);
        this.props.engine.setCanvas(null);
        document.removeEventListener('keyup', this.keyUp);
        document.removeEventListener('keydown', this.keyDown);
    }
    registerCanvas() {
        this.props.engine.setCanvas(this.ref.current);
        this.props.engine.iterateListeners((list) => {
            list.rendered && list.rendered();
        });
    }
    componentDidUpdate() {
        this.registerCanvas();
    }
    componentDidMount() {
        this.canvasListener = this.props.engine.registerListener({
            repaintCanvas: () => {
                this.forceUpdate();
            }
        });
        this.keyDown = (event) => {
            this.props.engine.getActionEventBus().fireAction({ event });
        };
        this.keyUp = (event) => {
            this.props.engine.getActionEventBus().fireAction({ event });
        };
        document.addEventListener('keyup', this.keyUp);
        document.addEventListener('keydown', this.keyDown);
        this.registerCanvas();
    }
    render() {
        const engine = this.props.engine;
        const model = engine.getModel();
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(S.Canvas, { className: this.props.className, ref: this.ref, onWheel: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onMouseDown: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onMouseUp: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onMouseMove: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onTouchStart: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onTouchEnd: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            }, onTouchMove: (event) => {
                this.props.engine.getActionEventBus().fireAction({ event });
            } },
            model.getLayers()[2] &&
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_layer_TransformLayerWidget__WEBPACK_IMPORTED_MODULE_1__.TransformLayerWidget, { layer: model.getLayers()[2], key: model.getLayers()[2].getID() },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_layer_SmartLayerWidget__WEBPACK_IMPORTED_MODULE_3__.SmartLayerWidget, { layer: model.getLayers()[2], engine: this.props.engine, key: model.getLayers()[2].getID() })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_layer_TransformLayerWidget__WEBPACK_IMPORTED_MODULE_1__.TransformLayerWidget, { layer: model.getLayers()[0], key: model.getLayers()[0].getID() },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_layer_SmartLayerWidget__WEBPACK_IMPORTED_MODULE_3__.SmartLayerWidget, { layer: model.getLayers()[0], engine: this.props.engine, key: model.getLayers()[0].getID() })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_layer_TransformLayerWidget__WEBPACK_IMPORTED_MODULE_1__.TransformLayerWidget, { layer: model.getLayers()[1], key: model.getLayers()[1].getID() },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_layer_SmartLayerWidget__WEBPACK_IMPORTED_MODULE_3__.SmartLayerWidget, { layer: model.getLayers()[1], engine: this.props.engine, key: model.getLayers()[1].getID() }))));
    }
}


/***/ }),

/***/ "./dist/entities/layer/LayerModel.js":
/*!*******************************************!*\
  !*** ./dist/entities/layer/LayerModel.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayerModel: () => (/* binding */ LayerModel)
/* harmony export */ });
/* harmony import */ var _core_models_BaseModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-models/BaseModel */ "./dist/core-models/BaseModel.js");
/* harmony import */ var lodash_flatMap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/flatMap */ "lodash/flatMap");
/* harmony import */ var lodash_flatMap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_flatMap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_forEach__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/forEach */ "lodash/forEach");
/* harmony import */ var lodash_forEach__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_forEach__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_mapValues__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/mapValues */ "lodash/mapValues");
/* harmony import */ var lodash_mapValues__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_mapValues__WEBPACK_IMPORTED_MODULE_3__);




class LayerModel extends _core_models_BaseModel__WEBPACK_IMPORTED_MODULE_0__.BaseModel {
    constructor(options = {}) {
        super(options);
        this.models = {};
        this.repaintEnabled = true;
    }
    deserialize(event) {
        super.deserialize(event);
        this.options.isSvg = !!event.data.isSvg;
        this.options.isWorktable = !!event.data.isWorktable;
        this.options.transformed = !!event.data.transformed;
        lodash_forEach__WEBPACK_IMPORTED_MODULE_2___default()(event.data.models, (model) => {
            const modelOb = this.getChildModelFactoryBank(event.engine).getFactory(model.type).generateModel({
                initialConfig: model
            });
            modelOb.deserialize(Object.assign(Object.assign({}, event), { data: model }));
            this.addModel(modelOb);
        });
    }
    serialize() {
        return Object.assign(Object.assign({}, super.serialize()), { isSvg: this.options.isSvg, isWorktable: this.options.isWorktable, transformed: this.options.transformed, models: lodash_mapValues__WEBPACK_IMPORTED_MODULE_3___default()(this.models, (model) => {
                return model.serialize();
            }) });
    }
    isRepaintEnabled() {
        return this.repaintEnabled;
    }
    allowRepaint(allow = true) {
        this.repaintEnabled = allow;
    }
    remove() {
        if (this.parent) {
            this.parent.removeLayer(this);
        }
        super.remove();
    }
    addModel(model) {
        model.setParent(this);
        this.models[model.getID()] = model;
    }
    getSelectionEntities() {
        return lodash_flatMap__WEBPACK_IMPORTED_MODULE_1___default()(this.models, (model) => {
            return model.getSelectionEntities();
        });
    }
    getModels() {
        return this.models;
    }
    getModel(id) {
        return this.models[id];
    }
    removeModel(id) {
        const _id = typeof id === 'string' ? id : id.getID();
        if (this.models[_id]) {
            delete this.models[_id];
            return true;
        }
        return false;
    }
}


/***/ }),

/***/ "./dist/entities/layer/SmartLayerWidget.js":
/*!*************************************************!*\
  !*** ./dist/entities/layer/SmartLayerWidget.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SmartLayerWidget: () => (/* binding */ SmartLayerWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class SmartLayerWidget extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    shouldComponentUpdate() {
        return this.props.layer.isRepaintEnabled();
    }
    render() {
        return this.props.engine.getFactoryForLayer(this.props.layer).generateReactWidget({ model: this.props.layer });
    }
}


/***/ }),

/***/ "./dist/entities/layer/TransformLayerWidget.js":
/*!*****************************************************!*\
  !*** ./dist/entities/layer/TransformLayerWidget.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TransformLayerWidget: () => (/* binding */ TransformLayerWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_emotion_styled__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/react */ "@emotion/react");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_2__);



var S;
(function (S) {
    const shared = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.css) `
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
		transform-origin: 0 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	`;
    S.DivLayer = (_emotion_styled__WEBPACK_IMPORTED_MODULE_1___default().div) `
		${shared}
	`;
    S.SvgLayer = (_emotion_styled__WEBPACK_IMPORTED_MODULE_1___default().svg) `
		${shared}
	`;
})(S || (S = {}));
class TransformLayerWidget extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getTransform() {
        const model = this.props.layer.getParent();
        return `
			translate(
				${model.getOffsetX()}px,
				${model.getOffsetY()}px)
			scale(
				${model.getZoomLevel() / 100.0}
			)
  	`;
    }
    getTransformStyle() {
        if (this.props.layer.getOptions().transformed) {
            return {
                transform: this.getTransform()
            };
        }
        return {};
    }
    render() {
        if (this.props.layer.getOptions().isSvg) {
            return react__WEBPACK_IMPORTED_MODULE_0__.createElement(S.SvgLayer, { className: 'svg_layer', style: this.getTransformStyle() }, this.props.children);
        }
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement(S.DivLayer, { className: 'node_layer', style: this.getTransformStyle() }, this.props.children);
    }
}


/***/ }),

/***/ "./dist/entities/selection/SelectionBoxLayerFactory.js":
/*!*************************************************************!*\
  !*** ./dist/entities/selection/SelectionBoxLayerFactory.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectionBoxLayerFactory: () => (/* binding */ SelectionBoxLayerFactory)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_AbstractReactFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/AbstractReactFactory */ "./dist/core/AbstractReactFactory.js");
/* harmony import */ var _SelectionLayerModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionLayerModel */ "./dist/entities/selection/SelectionLayerModel.js");
/* harmony import */ var _SelectionBoxWidget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectionBoxWidget */ "./dist/entities/selection/SelectionBoxWidget.js");




class SelectionBoxLayerFactory extends _core_AbstractReactFactory__WEBPACK_IMPORTED_MODULE_1__.AbstractReactFactory {
    constructor() {
        super('selection');
    }
    generateModel(event) {
        return new _SelectionLayerModel__WEBPACK_IMPORTED_MODULE_2__.SelectionLayerModel();
    }
    generateReactWidget(event) {
        return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SelectionBoxWidget__WEBPACK_IMPORTED_MODULE_3__.SelectionBoxWidget, { rect: event.model.box });
    }
}


/***/ }),

/***/ "./dist/entities/selection/SelectionBoxWidget.js":
/*!*******************************************************!*\
  !*** ./dist/entities/selection/SelectionBoxWidget.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectionBoxWidget: () => (/* binding */ SelectionBoxWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/styled */ "@emotion/styled");
/* harmony import */ var _emotion_styled__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_emotion_styled__WEBPACK_IMPORTED_MODULE_1__);


var S;
(function (S) {
    S.Container = (_emotion_styled__WEBPACK_IMPORTED_MODULE_1___default().div) `
		position: absolute;
		background-color: rgba(0, 192, 255, 0.2);
		border: solid 2px rgb(0, 192, 255);
	`;
})(S || (S = {}));
class SelectionBoxWidget extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    render() {
        const { rect } = this.props;
        if (!rect)
            return null;
        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(S.Container, { style: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            } }));
    }
}


/***/ }),

/***/ "./dist/entities/selection/SelectionLayerModel.js":
/*!********************************************************!*\
  !*** ./dist/entities/selection/SelectionLayerModel.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectionLayerModel: () => (/* binding */ SelectionLayerModel)
/* harmony export */ });
/* harmony import */ var _layer_LayerModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layer/LayerModel */ "./dist/entities/layer/LayerModel.js");

class SelectionLayerModel extends _layer_LayerModel__WEBPACK_IMPORTED_MODULE_0__.LayerModel {
    constructor() {
        super({
            transformed: false,
            isSvg: false,
            type: 'selection'
        });
    }
    setBox(rect) {
        this.box = rect;
    }
    getChildModelFactoryBank() {
        // is not used as it doesnt serialize
        return null;
    }
}


/***/ }),

/***/ "./dist/states/DefaultState.js":
/*!*************************************!*\
  !*** ./dist/states/DefaultState.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultState: () => (/* binding */ DefaultState)
/* harmony export */ });
/* harmony import */ var _core_state_State__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-state/State */ "./dist/core-state/State.js");
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
/* harmony import */ var _DragCanvasState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DragCanvasState */ "./dist/states/DragCanvasState.js");
/* harmony import */ var _SelectingState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectingState */ "./dist/states/SelectingState.js");
/* harmony import */ var _MoveItemsState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MoveItemsState */ "./dist/states/MoveItemsState.js");





class DefaultState extends _core_state_State__WEBPACK_IMPORTED_MODULE_0__.State {
    constructor() {
        super({
            name: 'default'
        });
        this.childStates = [new _SelectingState__WEBPACK_IMPORTED_MODULE_3__.SelectingState()];
        // determine what was clicked on
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                // the canvas was clicked on, transition to the dragging canvas state
                if (!element) {
                    this.transitionWithEvent(new _DragCanvasState__WEBPACK_IMPORTED_MODULE_2__.DragCanvasState(), event);
                }
                else {
                    this.transitionWithEvent(new _MoveItemsState__WEBPACK_IMPORTED_MODULE_4__.MoveItemsState(), event);
                }
            }
        }));
        // touch drags the canvas
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.TOUCH_START,
            fire: (event) => {
                this.transitionWithEvent(new _DragCanvasState__WEBPACK_IMPORTED_MODULE_2__.DragCanvasState(), event);
            }
        }));
    }
}


/***/ }),

/***/ "./dist/states/DragCanvasState.js":
/*!****************************************!*\
  !*** ./dist/states/DragCanvasState.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragCanvasState: () => (/* binding */ DragCanvasState)
/* harmony export */ });
/* harmony import */ var _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class DragCanvasState extends _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_0__.AbstractDisplacementState {
    constructor(options = {}) {
        super({
            name: 'drag-canvas'
        });
        this.config = Object.assign({ allowDrag: true }, options);
    }
    activated(prev) {
        const _super = Object.create(null, {
            activated: { get: () => super.activated }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.activated.call(this, prev);
            this.engine.getModel().clearSelection();
            yield this.engine.repaintCanvas(true);
            // we can block layer rendering because we are only targeting the transforms
            for (let layer of this.engine.getModel().getLayers()) {
                layer.allowRepaint(false);
            }
            this.initialCanvasX = this.engine.getModel().getOffsetX();
            this.initialCanvasY = this.engine.getModel().getOffsetY();
        });
    }
    deactivated(next) {
        super.deactivated(next);
        for (let layer of this.engine.getModel().getLayers()) {
            layer.allowRepaint(true);
        }
    }
    fireMouseMoved(event) {
        if (this.config.allowDrag) {
            this.engine
                .getModel()
                .setOffset(this.initialCanvasX + event.displacementX, this.initialCanvasY + event.displacementY);
            this.engine.repaintCanvas();
        }
    }
}


/***/ }),

/***/ "./dist/states/MoveItemsState.js":
/*!***************************************!*\
  !*** ./dist/states/MoveItemsState.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MoveItemsState: () => (/* binding */ MoveItemsState)
/* harmony export */ });
/* harmony import */ var _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
/* harmony import */ var _core_models_BasePositionModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core-models/BasePositionModel */ "./dist/core-models/BasePositionModel.js");



class MoveItemsState extends _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_0__.AbstractDisplacementState {
    constructor() {
        super({
            name: 'move-items'
        });
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                if (!element) {
                    return;
                }
                if (!element.isSelected()) {
                    this.engine.getModel().clearSelection();
                }
                element.setSelected(true);
                this.engine.repaintCanvas();
            }
        }));
    }
    activated(previous) {
        super.activated(previous);
        this.initialPositions = {};
    }
    fireMouseMoved(event) {
        const items = this.engine.getModel().getSelectedEntities();
        const model = this.engine.getModel();
        for (let item of items) {
            if (item instanceof _core_models_BasePositionModel__WEBPACK_IMPORTED_MODULE_2__.BasePositionModel) {
                if (item.isLocked()) {
                    continue;
                }
                if (!this.initialPositions[item.getID()]) {
                    this.initialPositions[item.getID()] = {
                        point: item.getPosition(),
                        item: item
                    };
                }
                const pos = this.initialPositions[item.getID()].point;
                item.setPosition(model.getGridPosition(pos.x + event.virtualDisplacementX), model.getGridPosition(pos.y + event.virtualDisplacementY));
            }
        }
        this.engine.repaintCanvas();
    }
}


/***/ }),

/***/ "./dist/states/SelectingState.js":
/*!***************************************!*\
  !*** ./dist/states/SelectingState.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectingState: () => (/* binding */ SelectingState)
/* harmony export */ });
/* harmony import */ var _core_state_State__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-state/State */ "./dist/core-state/State.js");
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core-actions/Action */ "./dist/core-actions/Action.js");
/* harmony import */ var _SelectionBoxState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionBoxState */ "./dist/states/SelectionBoxState.js");



class SelectingState extends _core_state_State__WEBPACK_IMPORTED_MODULE_0__.State {
    constructor() {
        super({
            name: 'selecting'
        });
        this.keys = ['shift'];
        this.registerAction(new _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.Action({
            type: _core_actions_Action__WEBPACK_IMPORTED_MODULE_1__.InputType.MOUSE_DOWN,
            fire: (event) => {
                const element = this.engine.getActionEventBus().getModelForEvent(event);
                // go into a selection box on the canvas state
                if (!element) {
                    this.transitionWithEvent(new _SelectionBoxState__WEBPACK_IMPORTED_MODULE_2__.SelectionBoxState(), event);
                }
                else {
                    element.setSelected(true);
                    this.engine.repaintCanvas();
                }
            }
        }));
    }
}


/***/ }),

/***/ "./dist/states/SelectionBoxState.js":
/*!******************************************!*\
  !*** ./dist/states/SelectionBoxState.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SelectionBoxState: () => (/* binding */ SelectionBoxState)
/* harmony export */ });
/* harmony import */ var _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
/* harmony import */ var _entities_selection_SelectionLayerModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../entities/selection/SelectionLayerModel */ "./dist/entities/selection/SelectionLayerModel.js");
/* harmony import */ var _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @projectstorm/geometry */ "@projectstorm/geometry");
/* harmony import */ var _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_projectstorm_geometry__WEBPACK_IMPORTED_MODULE_2__);



class SelectionBoxState extends _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_0__.AbstractDisplacementState {
    constructor() {
        super({
            name: 'selection-box'
        });
    }
    activated(previous) {
        super.activated(previous);
        this.layer = new _entities_selection_SelectionLayerModel__WEBPACK_IMPORTED_MODULE_1__.SelectionLayerModel();
        this.engine.getModel().addLayer(this.layer);
    }
    deactivated(next) {
        super.deactivated(next);
        this.layer.remove();
        this.engine.repaintCanvas();
    }
    getBoxDimensions(event) {
        let rel;
        if ('touches' in event.event) {
            const touch = event.event.touches[0];
            rel = this.engine.getRelativePoint(touch.clientX, touch.clientY);
        }
        else {
            rel = this.engine.getRelativePoint(event.event.clientX, event.event.clientY);
        }
        return {
            left: rel.x > this.initialXRelative ? this.initialXRelative : rel.x,
            top: rel.y > this.initialYRelative ? this.initialYRelative : rel.y,
            width: Math.abs(rel.x - this.initialXRelative),
            height: Math.abs(rel.y - this.initialYRelative),
            right: rel.x < this.initialXRelative ? this.initialXRelative : rel.x,
            bottom: rel.y < this.initialYRelative ? this.initialYRelative : rel.y
        };
    }
    fireMouseMoved(event) {
        this.layer.setBox(this.getBoxDimensions(event));
        const relative = this.engine.getRelativeMousePoint({
            clientX: this.initialX,
            clientY: this.initialY
        });
        if (event.virtualDisplacementX < 0) {
            relative.x -= Math.abs(event.virtualDisplacementX);
        }
        if (event.virtualDisplacementY < 0) {
            relative.y -= Math.abs(event.virtualDisplacementY);
        }
        const rect = _projectstorm_geometry__WEBPACK_IMPORTED_MODULE_2__.Rectangle.fromPointAndSize(relative, Math.abs(event.virtualDisplacementX), Math.abs(event.virtualDisplacementY));
        for (let model of this.engine.getModel().getSelectionEntities()) {
            if (model.getBoundingBox) {
                const bounds = model.getBoundingBox();
                if (rect.containsPoint(bounds.getTopLeft()) && rect.containsPoint(bounds.getBottomRight())) {
                    model.setSelected(true);
                }
                else {
                    model.setSelected(false);
                }
            }
        }
        this.engine.repaintCanvas();
    }
}


/***/ }),

/***/ "./dist/widgets/PeformanceWidget.js":
/*!******************************************!*\
  !*** ./dist/widgets/PeformanceWidget.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PeformanceWidget: () => (/* binding */ PeformanceWidget)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isEqual */ "lodash/isEqual");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_1__);


class PeformanceWidget extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!this.props.model.performanceTune()) {
            return true;
        }
        // deserialization event
        if (this.props.model !== nextProps.model) {
            return true;
        }
        // change event
        return !lodash_isEqual__WEBPACK_IMPORTED_MODULE_1___default()(this.props.serialized, nextProps.serialized);
    }
    render() {
        return this.props.children();
    }
}


/***/ }),

/***/ "@emotion/react":
/*!*********************************!*\
  !*** external "@emotion/react" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@emotion/react");

/***/ }),

/***/ "@emotion/styled":
/*!**********************************!*\
  !*** external "@emotion/styled" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@emotion/styled");

/***/ }),

/***/ "@projectstorm/geometry":
/*!*****************************************!*\
  !*** external "@projectstorm/geometry" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("@projectstorm/geometry");

/***/ }),

/***/ "lodash/cloneDeep":
/*!***********************************!*\
  !*** external "lodash/cloneDeep" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("lodash/cloneDeep");

/***/ }),

/***/ "lodash/debounce":
/*!**********************************!*\
  !*** external "lodash/debounce" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("lodash/debounce");

/***/ }),

/***/ "lodash/filter":
/*!********************************!*\
  !*** external "lodash/filter" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("lodash/filter");

/***/ }),

/***/ "lodash/flatMap":
/*!*********************************!*\
  !*** external "lodash/flatMap" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("lodash/flatMap");

/***/ }),

/***/ "lodash/forEach":
/*!*********************************!*\
  !*** external "lodash/forEach" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("lodash/forEach");

/***/ }),

/***/ "lodash/intersection":
/*!**************************************!*\
  !*** external "lodash/intersection" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("lodash/intersection");

/***/ }),

/***/ "lodash/isEqual":
/*!*********************************!*\
  !*** external "lodash/isEqual" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("lodash/isEqual");

/***/ }),

/***/ "lodash/keys":
/*!******************************!*\
  !*** external "lodash/keys" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("lodash/keys");

/***/ }),

/***/ "lodash/last":
/*!******************************!*\
  !*** external "lodash/last" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("lodash/last");

/***/ }),

/***/ "lodash/map":
/*!*****************************!*\
  !*** external "lodash/map" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("lodash/map");

/***/ }),

/***/ "lodash/mapValues":
/*!***********************************!*\
  !*** external "lodash/mapValues" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("lodash/mapValues");

/***/ }),

/***/ "lodash/values":
/*!********************************!*\
  !*** external "lodash/values" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("lodash/values");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractDisplacementState: () => (/* reexport safe */ _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_22__.AbstractDisplacementState),
/* harmony export */   AbstractFactory: () => (/* reexport safe */ _core_AbstractFactory__WEBPACK_IMPORTED_MODULE_3__.AbstractFactory),
/* harmony export */   AbstractModelFactory: () => (/* reexport safe */ _core_AbstractModelFactory__WEBPACK_IMPORTED_MODULE_4__.AbstractModelFactory),
/* harmony export */   AbstractReactFactory: () => (/* reexport safe */ _core_AbstractReactFactory__WEBPACK_IMPORTED_MODULE_5__.AbstractReactFactory),
/* harmony export */   Action: () => (/* reexport safe */ _core_actions_Action__WEBPACK_IMPORTED_MODULE_9__.Action),
/* harmony export */   ActionEventBus: () => (/* reexport safe */ _core_actions_ActionEventBus__WEBPACK_IMPORTED_MODULE_10__.ActionEventBus),
/* harmony export */   BaseEntity: () => (/* reexport safe */ _core_models_BaseEntity__WEBPACK_IMPORTED_MODULE_11__.BaseEntity),
/* harmony export */   BaseModel: () => (/* reexport safe */ _core_models_BaseModel__WEBPACK_IMPORTED_MODULE_12__.BaseModel),
/* harmony export */   BaseObserver: () => (/* reexport safe */ _core_BaseObserver__WEBPACK_IMPORTED_MODULE_6__.BaseObserver),
/* harmony export */   BasePositionModel: () => (/* reexport safe */ _core_models_BasePositionModel__WEBPACK_IMPORTED_MODULE_13__.BasePositionModel),
/* harmony export */   CanvasEngine: () => (/* reexport safe */ _CanvasEngine__WEBPACK_IMPORTED_MODULE_0__.CanvasEngine),
/* harmony export */   CanvasModel: () => (/* reexport safe */ _entities_canvas_CanvasModel__WEBPACK_IMPORTED_MODULE_2__.CanvasModel),
/* harmony export */   CanvasWidget: () => (/* reexport safe */ _entities_canvas_CanvasWidget__WEBPACK_IMPORTED_MODULE_14__.CanvasWidget),
/* harmony export */   DefaultState: () => (/* reexport safe */ _states_DefaultState__WEBPACK_IMPORTED_MODULE_25__.DefaultState),
/* harmony export */   DeleteItemsAction: () => (/* reexport safe */ _actions_DeleteItemsAction__WEBPACK_IMPORTED_MODULE_30__.DeleteItemsAction),
/* harmony export */   DragCanvasState: () => (/* reexport safe */ _states_DragCanvasState__WEBPACK_IMPORTED_MODULE_26__.DragCanvasState),
/* harmony export */   FactoryBank: () => (/* reexport safe */ _core_FactoryBank__WEBPACK_IMPORTED_MODULE_7__.FactoryBank),
/* harmony export */   InputType: () => (/* reexport safe */ _core_actions_Action__WEBPACK_IMPORTED_MODULE_9__.InputType),
/* harmony export */   LayerModel: () => (/* reexport safe */ _entities_layer_LayerModel__WEBPACK_IMPORTED_MODULE_15__.LayerModel),
/* harmony export */   MoveItemsState: () => (/* reexport safe */ _states_MoveItemsState__WEBPACK_IMPORTED_MODULE_29__.MoveItemsState),
/* harmony export */   PanAndZoomCanvasAction: () => (/* reexport safe */ _actions_PanAndZoomCanvasAction__WEBPACK_IMPORTED_MODULE_32__.PanAndZoomCanvasAction),
/* harmony export */   PeformanceWidget: () => (/* reexport safe */ _widgets_PeformanceWidget__WEBPACK_IMPORTED_MODULE_21__.PeformanceWidget),
/* harmony export */   SelectingState: () => (/* reexport safe */ _states_SelectingState__WEBPACK_IMPORTED_MODULE_27__.SelectingState),
/* harmony export */   SelectionBoxLayerFactory: () => (/* reexport safe */ _entities_selection_SelectionBoxLayerFactory__WEBPACK_IMPORTED_MODULE_18__.SelectionBoxLayerFactory),
/* harmony export */   SelectionBoxState: () => (/* reexport safe */ _states_SelectionBoxState__WEBPACK_IMPORTED_MODULE_28__.SelectionBoxState),
/* harmony export */   SelectionBoxWidget: () => (/* reexport safe */ _entities_selection_SelectionBoxWidget__WEBPACK_IMPORTED_MODULE_19__.SelectionBoxWidget),
/* harmony export */   SelectionLayerModel: () => (/* reexport safe */ _entities_selection_SelectionLayerModel__WEBPACK_IMPORTED_MODULE_20__.SelectionLayerModel),
/* harmony export */   SmartLayerWidget: () => (/* reexport safe */ _entities_layer_SmartLayerWidget__WEBPACK_IMPORTED_MODULE_17__.SmartLayerWidget),
/* harmony export */   State: () => (/* reexport safe */ _core_state_State__WEBPACK_IMPORTED_MODULE_23__.State),
/* harmony export */   StateMachine: () => (/* reexport safe */ _core_state_StateMachine__WEBPACK_IMPORTED_MODULE_24__.StateMachine),
/* harmony export */   Toolkit: () => (/* reexport safe */ _Toolkit__WEBPACK_IMPORTED_MODULE_1__.Toolkit),
/* harmony export */   TransformLayerWidget: () => (/* reexport safe */ _entities_layer_TransformLayerWidget__WEBPACK_IMPORTED_MODULE_16__.TransformLayerWidget),
/* harmony export */   ZoomCanvasAction: () => (/* reexport safe */ _actions_ZoomCanvasAction__WEBPACK_IMPORTED_MODULE_31__.ZoomCanvasAction)
/* harmony export */ });
/* harmony import */ var _CanvasEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanvasEngine */ "./dist/CanvasEngine.js");
/* harmony import */ var _Toolkit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Toolkit */ "./dist/Toolkit.js");
/* harmony import */ var _entities_canvas_CanvasModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entities/canvas/CanvasModel */ "./dist/entities/canvas/CanvasModel.js");
/* harmony import */ var _core_AbstractFactory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/AbstractFactory */ "./dist/core/AbstractFactory.js");
/* harmony import */ var _core_AbstractModelFactory__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/AbstractModelFactory */ "./dist/core/AbstractModelFactory.js");
/* harmony import */ var _core_AbstractReactFactory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/AbstractReactFactory */ "./dist/core/AbstractReactFactory.js");
/* harmony import */ var _core_BaseObserver__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/BaseObserver */ "./dist/core/BaseObserver.js");
/* harmony import */ var _core_FactoryBank__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/FactoryBank */ "./dist/core/FactoryBank.js");
/* harmony import */ var _core_ModelGeometryInterface__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/ModelGeometryInterface */ "./dist/core/ModelGeometryInterface.js");
/* harmony import */ var _core_actions_Action__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core-actions/Action */ "./dist/core-actions/Action.js");
/* harmony import */ var _core_actions_ActionEventBus__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core-actions/ActionEventBus */ "./dist/core-actions/ActionEventBus.js");
/* harmony import */ var _core_models_BaseEntity__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core-models/BaseEntity */ "./dist/core-models/BaseEntity.js");
/* harmony import */ var _core_models_BaseModel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core-models/BaseModel */ "./dist/core-models/BaseModel.js");
/* harmony import */ var _core_models_BasePositionModel__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core-models/BasePositionModel */ "./dist/core-models/BasePositionModel.js");
/* harmony import */ var _entities_canvas_CanvasWidget__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./entities/canvas/CanvasWidget */ "./dist/entities/canvas/CanvasWidget.js");
/* harmony import */ var _entities_layer_LayerModel__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./entities/layer/LayerModel */ "./dist/entities/layer/LayerModel.js");
/* harmony import */ var _entities_layer_TransformLayerWidget__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./entities/layer/TransformLayerWidget */ "./dist/entities/layer/TransformLayerWidget.js");
/* harmony import */ var _entities_layer_SmartLayerWidget__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./entities/layer/SmartLayerWidget */ "./dist/entities/layer/SmartLayerWidget.js");
/* harmony import */ var _entities_selection_SelectionBoxLayerFactory__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./entities/selection/SelectionBoxLayerFactory */ "./dist/entities/selection/SelectionBoxLayerFactory.js");
/* harmony import */ var _entities_selection_SelectionBoxWidget__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./entities/selection/SelectionBoxWidget */ "./dist/entities/selection/SelectionBoxWidget.js");
/* harmony import */ var _entities_selection_SelectionLayerModel__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./entities/selection/SelectionLayerModel */ "./dist/entities/selection/SelectionLayerModel.js");
/* harmony import */ var _widgets_PeformanceWidget__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./widgets/PeformanceWidget */ "./dist/widgets/PeformanceWidget.js");
/* harmony import */ var _core_state_AbstractDisplacementState__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./core-state/AbstractDisplacementState */ "./dist/core-state/AbstractDisplacementState.js");
/* harmony import */ var _core_state_State__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./core-state/State */ "./dist/core-state/State.js");
/* harmony import */ var _core_state_StateMachine__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./core-state/StateMachine */ "./dist/core-state/StateMachine.js");
/* harmony import */ var _states_DefaultState__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./states/DefaultState */ "./dist/states/DefaultState.js");
/* harmony import */ var _states_DragCanvasState__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./states/DragCanvasState */ "./dist/states/DragCanvasState.js");
/* harmony import */ var _states_SelectingState__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./states/SelectingState */ "./dist/states/SelectingState.js");
/* harmony import */ var _states_SelectionBoxState__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./states/SelectionBoxState */ "./dist/states/SelectionBoxState.js");
/* harmony import */ var _states_MoveItemsState__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./states/MoveItemsState */ "./dist/states/MoveItemsState.js");
/* harmony import */ var _actions_DeleteItemsAction__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./actions/DeleteItemsAction */ "./dist/actions/DeleteItemsAction.js");
/* harmony import */ var _actions_ZoomCanvasAction__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./actions/ZoomCanvasAction */ "./dist/actions/ZoomCanvasAction.js");
/* harmony import */ var _actions_PanAndZoomCanvasAction__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./actions/PanAndZoomCanvasAction */ "./dist/actions/PanAndZoomCanvasAction.js");



































})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.umd.js.map