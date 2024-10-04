// Constants
const SAFE_ADDRESS = "" //Add your Gnosis Pay Safe Address here 
const EURE_CONTRACT = "0xcB444e90D8198415266c6a2724b7900fb12FC56E"
const RPC_ENDPOINT = "https://rpc.gnosischain.com"
const TEXT_COLOR = new Color("#F0EBDE")
const LOGO_URL = "https://i.ibb.co/9tbNNwF/IMG-2725.png"
const BACKGROUND_COLOR = new Color("#133629")

// Simula font as per brand kit
function getFont(size, weight = "regular") {
  return new Font("Simula", size)
}

// Fetch balance from RPC
async function getBalance() {
  const req = new Request(RPC_ENDPOINT)
  req.method = "POST"
  req.headers = { "Content-Type": "application/json" }
  req.body = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{
      to: EURE_CONTRACT,
      data: `0x70a08231000000000000000000000000${SAFE_ADDRESS.slice(2)}`
    }, "latest"],
    id: 1
  })

  try {
    const response = await req.loadJSON()
    if (response.error) {
      console.error("RPC Error:", response.error)
      return "Error"
    }
    const balance = parseInt(response.result, 16)
    return (balance / 1e18).toFixed(2)
  } catch (error) {
    console.error("Error fetching balance:", error)
    return "Error"
  }
}

// Slice and dice address
const getShortAddress = address => `${address.slice(0, 6)}...${address.slice(-4)}`

function getTimestamp() {
  const now = new Date()
  const lastUpdate = new Date(now - 2 * 60 * 1000)
  const diff = Math.floor((now - lastUpdate) / 1000 / 60)
  return diff < 1 ? "now" : `${diff}m ago`
}

// Create and configure widget
async function createWidget() {
  const widget = new ListWidget()
  widget.backgroundColor = BACKGROUND_COLOR
  
  addTopStack(widget)
  widget.addSpacer(30)
  await addBalanceStack(widget)
  widget.addSpacer(4)
  addBottomTexts(widget)
  
  return widget
}

function addTopStack(widget) {
  const topStack = widget.addStack()
  topStack.layoutHorizontally()
  
  const balanceText = topStack.addText("Balance")
  balanceText.textColor = TEXT_COLOR
  balanceText.font = getFont(16)
  
  topStack.addSpacer()
  addLogo(topStack)
}

function addLogo(stack) {
  stack.addImage(logoImage).imageSize = new Size(20, 20)
}

async function addBalanceStack(widget) {
  const balanceStack = widget.addStack()
  balanceStack.layoutHorizontally()
  balanceStack.spacing = 4
  
  const eurText = balanceStack.addText("EUR")
  eurText.textColor = TEXT_COLOR
  eurText.font = getFont(20, "bold")
  
  const balance = await getBalance()
  const balanceAmountText = balanceStack.addText(balance)
  balanceAmountText.textColor = TEXT_COLOR
  balanceAmountText.font = getFont(20, "bold")
}

function addBottomTexts(widget) {
  const addressText = widget.addText(getShortAddress(SAFE_ADDRESS))
  addressText.textColor = TEXT_COLOR
  addressText.font = getFont(10)
  
  const timestampText = widget.addText(getTimestamp())
  timestampText.textColor = TEXT_COLOR
  timestampText.font = getFont(10)
}

// Main execution
let logoImage
async function main() {
  try {
    logoImage = await new Request(LOGO_URL).loadImage()
  } catch (error) {
    console.error("Error loading logo:", error)
    logoImage = null
  }

  const widget = await createWidget()
  
  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else {
    widget.presentSmall()
  }
}

await main()
Script.complete()
