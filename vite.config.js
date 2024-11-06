import { resolve } from 'path'

export default {
    build: {
        lib: {
            entry: [
                resolve(__dirname, 'src/errorTypes.js'),
                resolve(__dirname, 'src/logicAppError.js'),
                resolve(__dirname, 'src/axiosNetworkAppError.js'),
                resolve(__dirname, 'src/superagentNetworkAppError.js'),
            ],
            name: 'AppErrors',
            fileName: (format, name) => {
                if (format === 'es') {
                    return `${name}.js`
                }

                return `${name}.${format}`
            }
        }
    }
}
