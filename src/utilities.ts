import fs from 'fs'

export const listFiles = (result: { name: string; path: string }[], dir: string) => {
    try {
        if (!result) result = []
        const files = fs.readdirSync(dir)
        for (let i = 0; i < files.length; i++) {
            if (fs.lstatSync(dir + '/' + files[i]).isDirectory()) {
                const recursive = listFiles(result, dir + '/' + files[i])
                if (recursive) result = recursive
            } else {
                result.push({ name: files[i], path: dir + '/' + files[i] })
            }
        }
        return result
    } catch (e) {
        if (e instanceof Error)
            console.log(e.stack)
    }
}