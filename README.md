# Prompt Wars

Originally branded as Pulse Markets, Prompt Wars is a decentralized game build on top of NEAR Protocol Rust smart-contracts.

The reasoning behind the game is simple:

> Submit a prompt that will render the image on display, compare all the prompt results with the source image and pay the rewards to the resulting image that is closest to the reference image.

![Prompt Wars screenshot](https://blockchainassetregistry.infura-ipfs.io/ipfs/bafybeidycxac3jfzxd6c66luugcfks2ghuo423ukphdwnet753wy7n7tam/Screenshot%202023-07-07%20at%2012.42.32.png)

Follow [docs.pulsemarkets.org](https://docs.pulsemarkets.org/pulse-markets/) for a broader understanding of the smart-contract Prediction Markets protocol on top of which Prompt Wars is built.

- [Development](#development)
- [Launching-client](#launching-client)
- [Near-config](#near-config)
- [Rust](#rust)
- [API](#api)
- [Contributing](#contributing)

<a name="development"/>

## Development

To launch your own instance of Prompt Wars, you can:

1. connect to our Testnet or Mainnet contracts, OR
2. connect to your own contracts

<a name="launching-client"/>

### Launching the frontend client

The client is a NextJS application that connects to the NEAR Protocol Rust smart-contracts with `near-api-js`.

To launch on `localhost:3003`, first clone this repo and run:

```
git@github.com:aufacicenta/pulsemarkets.git
cd pulsemarkets
yarn
cd app
yarn
yarn dev:debug
```

You'll need these values in `app/.env`:

```
export NODE_ENV=test
export NEXT_PUBLIC_ORIGIN="http://localhost:3003"

export NEXT_PUBLIC_INFURA_ID="..." # get it from infura.io, works to upload prompt images to IPFS

# Uncomment when ready to prod
# export NEXT_PUBLIC_DEFAULT_NETWORK_ENV="mainnet"

export NEXT_PUBLIC_DEFAULT_NETWORK_ENV="testnet"

export NEAR_SIGNER_PRIVATE_KEY="..." # a private key of your NEAR wallet account. This wallet creates the games and determines the winner

export REPLICATE_API_TOKEN="..." # get it from replicate.ai, this connects to Stable Diffusion to compare the images

export NEXT_PUBLIC_WEBSOCKETS_PORT=8000
```
<a name="near-config"/>

#### NEAR config

All important configuration regarding Testnet and Mainnet smart-contracts is in: `getConfig.ts`.

Change these values according to your deployment, if needed.

<a name="rust"/>

### Rust smart-contracts development

The main contract is `contracts/prompt-wars/src/contract.rs` (it's Typescript abstraction is `app/src/providers/near/contracts/prompt-wars/contract.ts`).

You can tweak the contract to your needs and deploy it using the NEAR CLI. Update `getConfig.ts` to match your contracts' addresses.

Make sure that the tests pass!

```
# ./contracts/prompt-wars
cargo test -- --nocapture
```

<a name="api"/>

## Creating new games

This is done through the API endpoints:

- `/api/prompt-wars/create` — create new games using the market factory contract (once this is called, it automates the next steps)
- `/api/prompt-wars/reveal` — compare the prompt results with the source image, store the results in the prompt wars market contract
- `/api/prompt-wars/resolve` — set the winner
- `/api/prompt-wars/self-destruct` — get the storage NEAR native balance back

<a name="contributing"/>

## Contributing

Check the paid issues in the [Prompt Wars project board](https://github.com/orgs/aufacicenta/projects/2)!