export function print(o, out) {
    const s = JSON.stringify(o, null, 4)
    console.log(s)
    if (out) {
        fs.writeFileSync(`out/${out}.json`, s, 'utf-8')
    }
}
