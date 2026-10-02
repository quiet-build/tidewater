// Source modules live under src/; production modules and public assets share dist/.
export const assetBase = new URL( import.meta.env?.DEV ? '../' : './', import.meta.url ).href;
