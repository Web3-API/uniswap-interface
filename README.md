# A Web3API Uniswap v2: Demo Interface

[![Unit Tests](https://github.com/Uniswap/uniswap-interface/actions/workflows/unit-tests.yaml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/unit-tests.yaml)
[![Integration Tests](https://github.com/Uniswap/uniswap-interface/actions/workflows/integration-tests.yaml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/integration-tests.yaml)
[![Lint](https://github.com/Uniswap/uniswap-interface/actions/workflows/lint.yml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/lint.yml)
[![Release](https://github.com/Uniswap/uniswap-interface/actions/workflows/release.yaml/badge.svg)](https://github.com/Uniswap/uniswap-interface/actions/workflows/release.yaml)

An open source interface for Demoing Uniswap v2's Web3API, co-sponsored by the Uniswap Grants Program and Web3API DAO.

- Websites: [web3api.dev](https://web3api.dev/) & [uniswap.org](https://uniswap.org/)
- Docs: [uniswap.org/docs/](https://docs.web3api.dev/) #TODO:  link to the right section of the docs
- Twitter:  [@Web3API](https://twitter.com/Web3API) & [@UniswapProtocol](https://twitter.com/UniswapProtocol)
- Discord: [Web3API](https://discord.gg/BWScMpuTB4) & [Uniswap](https://discord.gg/FCfyBSbCU5)
- Technical Specification: [Link](#TODO)

## Accessing the Uniswap Interface

To access the Uniswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest), 
or visit [app.uniswap.org](https://app.uniswap.org).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[Uniswap V2](https://uniswap.org/docs/v2/smart-contracts/factory/) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `main` branch.** 
CI checks will run against all PRs.

## Disclaimer

While the wrapper that was developed for v2 covers all of the functions from the official JS SDK, this version of the Uniswap v2 Interface only supports swapping for demonstration purposes. 
