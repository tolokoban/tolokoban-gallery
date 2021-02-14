import FS from 'fs'
import Path from 'path'
import ChildProcess from 'child_process'

const output = ChildProcess.execSync("find ./images -name '*.jpg'").toString().trim()
const images = output.split('\n')
    .map(line => {
        const [ year, month, day ] = line.substr('./images/'.length).split('/')
        return {
            year: parseInt(year, 10),
            month: parseInt(month, 10),
            day: parseInt(day, 10),
            path: Path.resolve(line)
        }
    })
    .sort((a, b) => {
        const A = `${a.year}-${pad(a.month)}-${pad(a.day)}`
        const B = `${b.year}-${pad(b.month)}-${pad(b.day)}`
        if (A < B) return +1
        if (A > B) return -1
        return 0
    })
createFolder('build')
createFolder('build/img')
let progress = 0
const links = []
for(const {year, month, day, path: srcPath} of images) {
    progress++
    const name = `${year}-${pad(month)}-${pad(day)}`
    const dstPath = Path.resolve('./build/img', name)
    const [txtWidth, txtHeight] = ChildProcess.execSync(`identify -format "%wx%h" "${srcPath}"`).toString().split('x')
    const width = parseInt(txtWidth, 10)
    const height = parseInt(txtHeight, 10)
    const scale = 300 / Math.max(width, height)
    const thumbnailW = Math.floor(scale * width)
    const thumbnailH = Math.floor(scale * height)
    console.log(`${progress} / ${images.length}`,':  ', srcPath, " > ", name, " > ", `${width}x${height}`, `  (${thumbnailW}x${thumbnailH})`)
    ChildProcess.execSync(`cwebp -quiet -q 85 "${srcPath}" -o "${dstPath}.thumbnail.webp"`)
    ChildProcess.execSync(`cwebp -quiet -q 70 "${srcPath}" -resize ${thumbnailH} ${thumbnailH} -o "${dstPath}.webp"`)
    links.push(`<a href="img/${name}.thumbnail.webp"><img width="${thumbnailW}" height="${thumbnailH}" src="img/${name}.webp"/><div>${name}</div></a>`)
}
const indexContent = ChildProcess.execSync('cat ./public/index.html').toString()
const finalPage = indexContent.replace('{{BODY}}', links.join('\n'))
FS.writeFileSync('./build/index.html', finalPage)


function createFolder(folder) {
    const path = Path.resolve(folder)
    if (FS.existsSync(path)) return

    FS.mkdirSync(path)
}

function pad(value) {
    let txt = `${value}`
    while (txt.length < 2) txt = `0${txt}`

    return txt
}