import { ParamKey, ParamValue } from "./params.types";

export class ParamsService {
    private params: URLSearchParams;

    constructor() {
        this.params = new URLSearchParams(window.location.search);
    }

    /** Get a specific parameter as a string */
    getParam<K extends keyof ParamValue>(key: K): ParamValue[K] | null {
        const value = this.params.get(key);
        return value as ParamValue[K] | null;
    }

    /** Get a specific parameter as a boolean */
    getBooleanParam<K extends keyof ParamValue>(key: K): boolean {
        return this.params.get(key) === "true";
    }

    /** Get a specific parameter as a number */
    getNumberParam<K extends keyof ParamValue>(key: K, defaultValue = 0): number {
        const value = this.params.get(key);
        return value ? parseFloat(value) : defaultValue;
    }

    /** Get all params as a typed object */
    getAllParams(): Partial<ParamValue> {
        const entries = Object.entries(ParamKey).reduce((acc, [key, paramKey]) => {
            const value = this.params.get(paramKey as string);
            if (value !== null) {
                acc[key as keyof ParamValue] = value as ParamValue[keyof ParamValue];
            }
            return acc;
        }, {} as Partial<ParamValue>);

        return entries;
    }
}

const paramsService = new ParamsService();
export default paramsService;
