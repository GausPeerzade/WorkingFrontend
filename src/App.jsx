/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { AuroraBackground } from './components/aurora-background';
import { useChain } from '@cosmos-kit/react'
import { Wallet } from './components/wallet/Wallet';
import { coins, coin, GasPrice } from '@cosmjs/stargate';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

const contractAddress = 'mantra1p73558u0g52e96tzna8uhaea0v3mtda7whxqaxq6due44kgvu2aqzjk06h';
const rpc = 'https://rpc.hongbai.mantrachain.io';
const tokenContractAddress = 'mantra1q3ctduh25f5cauakh54xv70ckfug24nuk6wv4wn2f5fusee9tq0swap24j';
const spenderAddress = 'mantra1xms03jykg6e2g402dxj3cw4q6ygm0r5rctdt5d7j99xehwtevm3senz46v'; // Replace with the spender's address
const amount = '100000000';


function App() {
  const [counterValue, setCounterValue] = useState(null);
  const { isWalletConnected, address, getOfflineSigner } = useChain('mantrachaintestnet');
  const [incrementCounterValue, setIncrementCounterValue] = useState(null);

  useEffect(() => {
    if (isWalletConnected) {
      queryCounter();
    }
  }, [isWalletConnected]);

  const depositVault = async () => {

    const offlineSigner = getOfflineSigner();
    const client = await SigningCosmWasmClient.connectWithSigner(rpc, offlineSigner);

    const depositAmount = '100000000'; // Assuming '500000' is the desired deposit amount

    // Construct the increase allowance message
    const increaseAllowanceMsg = {
      withdraw: {
        share: depositAmount,
      }
    };



    // Prepare the fee
    const fee = {
      amount: coins("1000", 'uom'), // Adjust the fee according to your chain
      gas: '2000000',
    };

    // Execute the increase allowance transaction
    const result = await client.execute(address, spenderAddress, increaseAllowanceMsg, fee);

    // Log the transaction result
    console.log('Transaction result:', result);

  }

  async function increaseAllowance() {

    // Create a signing client
    const offlineSigner = getOfflineSigner();
    const client = await SigningCosmWasmClient.connectWithSigner(rpc, offlineSigner,
      {
        gasPrice: GasPrice.fromString('0.025uom'),
      }
    );

    console.log(client, 'SigningCosmWasm')

    // Construct the increase allowance message
    const increaseAllowanceMsg = {
      increase_allowance: {
        spender: spenderAddress,
        amount: amount,
      },
    };

    const depMsg = {
      deposit_collateral_and_mint: {
        token_amount: '3'
      }
    }

    const funds = [coin(100, 'uom')];

    // console.log(typeof(increaseAllowanceMsg.Cw20ExecuteMsg.IncreaseAllowance.spender))

    // Prepare the fee
    const fee = {
      amount: coins(2000, 'uom'), // Adjust the fee according to your chain
      gas: '200000',
    };

    // Execute the increase allowance transaction
    const result = await client.execute(address, "mantra1kh4hz9hd6m0jzvsdlvx94q44x57vvveppx0f4p7sudrq87499y3swv08mn", depMsg, "auto", "", funds);

    // Log the transaction result
    console.log('Transaction result:', result);
  }

  const queryCounter = async () => {
    try {
      const client = await CosmWasmClient.connect(rpc);
      const response = await client.queryContractSmart(spenderAddress, { get_total_supply: {} });
      setCounterValue(response);
    } catch (error) {
      console.error('Error querying contract:', error);
    }
  };

  console.log(counterValue)

  const executeIncrement = async () => {
    try {

      const offlineSigner = getOfflineSigner();
      const signer = await SigningCosmWasmClient.connectWithSigner(rpc, offlineSigner);

      const executeMsg = {
        increment_counter: {
          val: incrementCounterValue,
        },
      };

      // Prepare the fee
      // const fee = {
      //   amount: coins(2000, 'uom'), // Adjust fee according to your chain
      //   gas: '200000',
      // };

      // Execute the transaction
      const result = await client.execute(
        address,
        spenderAddress,
        executeMsg,

      );
      const hello = await signer.
        console.log('Transaction result:', result);

      // Query counter after executing increment
      queryCounter();
    } catch (error) {
      console.error('Error executing contract:', error);
    }
  };

  // console.log(chain.fees.fee_tokens[0].denom)


  return (
    <div className='h-screen w-screen flex'>
      <div className='h-20 w-full flex justify-between p-5'>
        <div className='flex flex-col'>
          <h1 className='text-white'>Counter: {counterValue}</h1>
          <div>
            <input
              type='number'
              className='text-white p-2 bg-gray-800'
              onChange={(e) => setIncrementCounterValue(parseInt(e.target.value))}
            />
            <button
              className='ml-2 p-2 bg-blue-600 text-white'
              onClick={increaseAllowance}
            >
              Allownce
            </button>
            <button
              className='ml-2 p-2 bg-blue-600 text-white'
              onClick={depositVault}
            >
              Deposit
            </button>
          </div>
        </div>
        <div>
          <Wallet />
        </div>
      </div>
    </div>
  )
}

export default App;
