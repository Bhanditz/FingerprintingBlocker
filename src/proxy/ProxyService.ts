import IProxyService, { ApplyHandler } from './IProxyService';
import WeakMap from '../shared/WeakMap';

export default class ProxyService implements IProxyService {
    private proxyToReal:IWeakMap<any, any> = new WeakMap();
    private realToProxy:IWeakMap<any, any> = new WeakMap();

    private copyProperty(orig, wrapped, prop:PropertyKey) {
        let desc = Object.getOwnPropertyDescriptor(orig, prop);
        if (desc && desc.configurable) {
            desc.value = orig[prop];
            Object.defineProperty(wrapped, prop, desc);
        }
    }

    private invokeWithUnproxiedThis:ApplyHandler<func, any> = (target, __this, _arguments) => {
        let unproxied = this.proxyToReal.get(__this);
        if (typeof unproxied == 'undefined') { unproxied = __this; }
        return target.apply(unproxied, _arguments);
    }

    private makeFunctionWrapper<T extends func>(orig:T, applyHandler:ApplyHandler<any, any>):T {
        let wrapped = <T>function() { return applyHandler(orig, this, arguments); };
        this.copyProperty(orig, wrapped, 'name');
        this.copyProperty(orig, wrapped, 'length');
        this.proxyToReal.set(wrapped, orig);
        this.realToProxy.set(orig, wrapped);
        return wrapped;
    }

    wrapMethod<T,R>(obj:T, prop:PropertyKey, applyHandler?:ApplyHandler<T,R>) {
        if (obj.hasOwnProperty(prop)) {
            obj[prop] = this.makeFunctionWrapper(obj[prop], applyHandler);
        }
    }

    wrapAccessor<T,R>(obj, prop:PropertyKey, getterApplyHandler?:ApplyHandler<T,R>, setterApplyHandler?:ApplyHandler<T,any>) {
        var desc = Object.getOwnPropertyDescriptor(obj, prop);
        if (desc && desc.get && desc.configurable) {
            var getter = this.makeFunctionWrapper(desc.get, getterApplyHandler);
            var setter;
            if (desc.set) { setter = this.makeFunctionWrapper(desc.set, setterApplyHandler); }
            Object.defineProperty(obj, prop, {
                get: getter,
                set: setter,
                configurable: true,
                enumerable: desc.enumerable
            });
        }
    }

    $apply(window:Window):void {
        const functionPType = window.Function.prototype;
        this.wrapMethod(functionPType, 'toString', this.invokeWithUnproxiedThis);
        this.wrapMethod(functionPType, 'toSource', this.invokeWithUnproxiedThis);
    }
}
