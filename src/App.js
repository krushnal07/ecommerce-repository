import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)

  const [account, setAccount] = useState(null)

  const [equipment, setEquipment] = useState(null)
  const [fertilizer, setFertilizer] = useState(null)
  const [machinery, setMachinery] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()

    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address, Dappazon, provider)
    setDappazon(dappazon)

    const items = []

    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1)
      items.push(item)
    }

    const equipment = items.filter((item) => item.category === 'equipment')
    const fertilizer = items.filter((item) => item.category === 'fertilizer')
    const machinery = items.filter((item) => item.category === 'machinery')

    setEquipment(equipment)
    setFertilizer(fertilizer)
    setMachinery(machinery)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>Tellus Best Sellers</h2>

      {equipment && fertilizer && machinery && (
        <>
          <Section title={"Fertilizer"} items={fertilizer} togglePop={togglePop} />
          <Section title={"Equipment"} items={equipment} togglePop={togglePop} />
          <Section title={"Machinery"} items={machinery} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
