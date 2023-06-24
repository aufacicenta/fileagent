// https://replicate.com/stability-ai/stable-diffusion - to render prompts, we'll use this API, it only renders 512x512 or 768x768 images
// https://source.unsplash.com/random/512x512?sport - this is unsplash random photo generator, we can also feed the Stable Diffusion API with random prompts created by ChatGPT

// Once an image is created, store its IPFS hash in a database with an is_used flag set to false, set to true when we've used this image
