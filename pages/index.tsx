import { Web3Provider } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { Crowdfunding, Crowdfunding__factory } from '../typechain-types'

interface Window {
  ethereum: any;
}
declare let window: Window

interface CrowdfundingData {
  accomplished: boolean,
  target: number,
  title: string,
  description: string,
  toAddr: string,
}

const HomePage: NextPage = () => {
  const [reloadCounter, setReloadCounter] = useState<number>(0)
  const [contract, setContract] = useState<Crowdfunding>()
	const [provider, setProvider] = useState<Web3Provider>()
  const [signerAddress, setSignerAddress] = useState<string>("")
  const [contractAddress, setContractAddress] = useState<string>("")
  const [balance, setBalance] = useState<number>(0)
  const [crowdfundingData, setCrowdfundingData] = useState<CrowdfundingData>({
    accomplished: false,
    target: 0,
    title: "",
    description: "",
    toAddr: "",
  })

  const [amount, setAmount] = useState<number>(0)

  const [message, setMessage] = useState<string>("")

  const reload = () => {
    setReloadCounter(reloadCounter+1)
  }

  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', [])
    setProvider(provider)

    const address = await provider.getSigner().getAddress()
    setSignerAddress(address)
  }

  const addLocalNetwork = () => window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
        chainId: "0x7a69",
        rpcUrls: ["http://localhost:8545/"],
        chainName: "Localhost 8545",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: null
    }]
  });

  const sendETH = async () => {
    if (!provider) {
      console.error("ETHの送金に失敗しました; Metamask を接続してください。")
      setMessage("ETHの送金に失敗しました; Metamask を接続してください。")
      return
    }
  
    const signer = provider.getSigner()
    try {
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.utils.parseEther(amount.toString())
      })
      const res = await tx.wait()
      console.log("ETHの送金に成功しました!\n", res)
      setMessage(`ETHの送金に成功しました!`) 
    } catch(e) {
      console.error(e)
      setMessage(`ETHの送金に失敗しました; ${e}`)
    }
  }

  const withdraw = async () => {
    if (!provider) {
      console.error("ETHの引き出しに失敗しました; Metamask を接続してください。")
      setMessage("ETHの引き出しに失敗しました; Metamask を接続してください。")
      return
    }
    if (!contract) {
      console.error("ETHの引き出しに失敗しました; コントラクトが不正です。")
      setMessage("ETHの引き出しに失敗しました; コントラクトが不正です。")
      return
    }

    try {
      const tx = await contract.withdraw()
      const res = await tx.wait()
      console.log("ETHの引き出しに成功しました!\n", res)
      setMessage(`ETHの引き出しに成功しました!`) 
    } catch(e) {
      console.error(e)
      setMessage(`ETHの引き出しに失敗しました; ${e}`)
    }
  }
  
  const conectToContract = async () => {
    if (!provider || !contractAddress) {
      return
    }
    const contract = Crowdfunding__factory.connect(
      contractAddress,
      provider.getSigner(),
    )
    setContract(contract)
  }

  useEffect(() => {
    setMessage("リロード中")

    login().catch(e => {
      console.error(e)
      setMessage(`リロード失敗; ${e}`)
    })
    conectToContract().catch(e => {
      console.error(e)
      setMessage(`リロード失敗; ${e}`)
    })

    const fetch = async () => {
      if (!provider || !contract) {
        return
      }

      const balance = await provider.getBalance(contractAddress)
      setBalance(
        parseFloat(ethers.utils.formatEther(balance))
      )

      const {
        getTitle,
        getDescription,
        getToAddress,
        getTarget,
        isAccomplished
      } = contract;

      setCrowdfundingData({
        title: await getTitle(),
        description: await getDescription(),
        toAddr: await getToAddress(),
        target: parseFloat(ethers.utils.formatEther(
          await getTarget()
        )),
        accomplished: await isAccomplished()
      })
    }
    fetch().catch(e => {
      console.error(e)
      setMessage(`リロード失敗; ${e}`)
    })

    setMessage("リロード成功")
  }, [reloadCounter])

  if (!provider) {
    return(<p>ウォレットを接続してください。</p>)
  }

  return (
		<>
			<h1>Crowdfunding</h1>
      <div>
        <p>
          <button onClick={reload}>リロード（{reloadCounter}）</button>
          <button onClick={addLocalNetwork}>ネットワークを追加</button>
        </p>
      </div>
        <h2>ウォレット情報</h2>
        <p>ウォレットアドレス: {signerAddress}</p>
      <div>
      </div>
      <div>
        <h2>コントラクト情報 {contractAddress}</h2>
        <p>
          コントラクトアドレス:
          <input type="text"
          placeholder="コントラクトアドレスを入力"
          onChange={e => setContractAddress(e.currentTarget.value)}>
          </input>
        </p>
        <h3>{crowdfundingData.title}</h3>
        <p>詳細: {crowdfundingData.description}</p>
        <p>目標金額: {crowdfundingData.target} ETH</p>
        <p>残高: {balance} ETH</p>
        <p>引き出し先アドレス： {crowdfundingData.toAddr}</p>
        <p>完遂: {crowdfundingData.accomplished ? "YES" : "NO"}</p>
        <p>
          <input
            type="text"
            placeholder="送金額を入力"
            onChange={e => setAmount(Number(e.currentTarget.value))}
          ></input>
          <button onClick={sendETH}>ETH をコントラクトへ送金</button>
        </p>
        <p>
          <button onClick={withdraw}>集めた ETH をコントラクトから引き出し（withdraw 関数）</button>
        </p>
      </div>
      <div>
        <h2>実行結果</h2>
        <p>{message}</p>
      </div>
		</>
  )
}

export default HomePage
