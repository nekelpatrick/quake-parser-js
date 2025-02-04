import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { LogParser } from './logParser'

// Create a file input element
const fileInput = document.createElement('input')
fileInput.type = 'file'
fileInput.accept = '.txt,.log'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Quake Log Parser</h1>
    <div class="card">
      <div id="file-upload">
        <p>Select a log file to parse:</p>
      </div>
      <div id="results" style="white-space: pre-wrap; text-align: left;"></div>
    </div>
  </div>
`

// Add file input to the page
document.querySelector('#file-upload')?.appendChild(fileInput)

// Handle file selection
fileInput.addEventListener('change', async (event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const logContent = await file.text()
  const parser = new LogParser()
  
  // Parse each line
  logContent.split('\n').forEach(line => parser.parseLine(line))
  
  // Display results
  const results = document.querySelector('#results')
  if (results) {
    const games = parser.getGames()
    results.innerHTML = `
      <h2>Parsing Results:</h2>
      <pre>${JSON.stringify(games, null, 2)}</pre>
      <h2>Player Rankings:</h2>
      <pre>${parser.generateRanking()}</pre>
    `
  }
})
