import { State, StateOptions } from './State';
import { CanvasEngine } from '../CanvasEngine';
export interface AbstractDisplacementStateEvent {
    displacementX: number;
    displacementY: number;
    virtualDisplacementX: number;
    virtualDisplacementY: number;
    event: React.MouseEvent | React.TouchEvent;
}
export declare abstract class AbstractDisplacementState<E extends CanvasEngine = CanvasEngine> extends State<E> {
    initialX: number;
    initialY: number;
    initialXRelative: number;
    initialYRelative: number;
    constructor(options: StateOptions);
    protected handleMoveStart(x: number, y: number): void;
    protected handleMove(x: number, y: number, event: React.MouseEvent | React.TouchEvent): void;
    protected handleMoveEnd(): void;
    abstract fireMouseMoved(event: AbstractDisplacementStateEvent): any;
}
