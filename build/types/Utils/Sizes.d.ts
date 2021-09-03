/**
 * 屏幕尺寸
 */
import EventEmitter from './EventEmitter';
export default class Sizes extends EventEmitter {
    width: number;
    height: number;
    viewport: {
        width: Number;
        height: Number;
    };
    $sizeViewport: HTMLElement;
    /**
     * Constructor
     */
    constructor(dom: HTMLElement);
    /**
     * Resize
     */
    resize(): void;
}
