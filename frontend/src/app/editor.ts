export interface LIF {
    name: string,
    m: number,
    V_reset: number,
    thr: number
}

interface LIFArray extends Array<LIF> { }

export interface Network {
    id: number,
    name: string,
    lifs: LIFArray
}

export interface NetworkArray extends Array<Network> { }
