/**
 * 观察者模式
 */
export default class EventEmitter {
    message: any;
    constructor();
    $on(type: string, fn: Function): void;
    $off(type: string, fn: Function): void;
    $emit(type: string): void;
}
