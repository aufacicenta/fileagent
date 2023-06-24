// Use pixelmatch to compare the source image with the generated image from each Prompt
// https://github.com/htmlcsstoimage/image-compare-api/blob/master/api/index.js

// This URL should be called by a participating user, using the "reveal" button once a competition is over
// This endpoint query has ?account_id= and ?market_id= parameters, to fetch the prompt of the player.

// Error if there's no prompt associated to the account
// Error if it's still no time to reveal the prompt (resolution window is open)

// Return the percentage_diff between the source image and the generated image and store it in the market contract, linked to the player account_id
// The comparison closest to 0 wins
