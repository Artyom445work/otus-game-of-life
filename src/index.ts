import './styles/style.css'

let desk: boolean[][]
let deskSize: number = 10
let speedMs: number = 500
let gameIntervalId: NodeJS.Timeout | null = null

const countAliveNeighbors = (row: number, col: number): number => {
    let count = 0

    if (
        row - 1 >= 0
        && row - 1 < desk.length
        && col - 1 >= 0
        && col - 1 <  desk[row - 1].length
    ) {
        count += +desk[row - 1][col - 1]
    }

    if (
        row - 1 >= 0
        && row - 1 < desk.length
        && col >= 0
        && col <  desk[row - 1].length
    ) {
        count += +desk[row - 1][col]
    }

    if (
        row - 1 >= 0
        && row - 1 < desk.length
        && col + 1 >= 0
        && col + 1 <  desk[row - 1].length
    ) {
        count += +desk[row - 1][col + 1]
    }

    if (
        row  >= 0
        && row < desk.length
        && col - 1 >= 0
        && col - 1 <  desk[row].length
    ) {
        count += +desk[row][col - 1]
    }

    if (
        row  >= 0
        && row < desk.length
        && col + 1 >= 0
        && col + 1 <  desk[row].length
    ) {
        count += +desk[row][col + 1]
    }

    if (
        row + 1  >= 0
        && row + 1 < desk.length
        && col - 1 >= 0
        && col - 1 <  desk[row + 1].length
    ) {
        count += +desk[row + 1][col - 1]
    }

    if (
        row + 1  >= 0
        && row + 1 < desk.length
        && col >= 0
        && col <  desk[row + 1].length
    ) {
        count += +desk[row + 1][col]
    }

    if (
        row + 1  >= 0
        && row + 1 < desk.length
        && col + 1 >= 0
        && col + 1 <  desk[row + 1].length
    ) {
        count += +desk[row + 1][col + 1]
    }

    return count
}

const updateDesk = (): void => {
    const newDesk = desk.map((arr) => [...arr])

    for (let i = 0; i < desk.length; i++) {
        for (let j = 0; j < desk[i].length; j++) {
            const aliveNeighbors = countAliveNeighbors(i, j)
            if (desk[i][j]) {
                newDesk[i][j] = [2, 3].includes(aliveNeighbors)
            } else {
                newDesk[i][j] = aliveNeighbors === 3
            }
        }
    }

    desk = newDesk
    renderDesk(0, 0, true)
}

const renderDesk = (i: number, j: number, isFullRender: Boolean): void => {
    if (!isFullRender) {
        desk[i][j] = !desk[i][j]
    }

    const deskElement = document.getElementById('desk') as HTMLElement
    deskElement.innerHTML = ''

    for (const rowIndex in desk) {
        const rowDiv = document.createElement('div')
        rowDiv.className = 'desk-row'
        for (const colIndex in desk[rowIndex]) {
            const cellDiv = document.createElement('div')
            cellDiv.className = `cell-${desk[rowIndex][colIndex] ? 'alive' : 'dead'}`
            cellDiv.addEventListener('click', () => renderDesk(rowIndex, colIndex, false))
            rowDiv.appendChild(cellDiv)
        }
        deskElement.appendChild(rowDiv)
    }
}

const initDesk = (size: number): void => {
    desk = Array.from(Array(size), () => new Array(size).fill(0))
    renderDesk(0, 0, true)
}

const startGame = (): void => {
    if (gameIntervalId !== null) {
        clearInterval(gameIntervalId)
    }
    gameIntervalId = setInterval(updateDesk, speedMs)
}

const stopGame = (): void => {
    if (gameIntervalId !== null) {
        clearInterval(gameIntervalId)
        gameIntervalId = null
    }
}

document.getElementById('operations-start')?.addEventListener('click', startGame)
document.getElementById('operations-stop')?.addEventListener('click', stopGame)

document.getElementById('operations-speed')?.addEventListener('change', (event) => {
    speedMs = document.getElementById('operations-speed').value
    startGame()
})

initDesk(deskSize)