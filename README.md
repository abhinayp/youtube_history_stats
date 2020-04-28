# Follow these instructions
1. Open tokens.js and fill in the required fields by following tokens.png
2. Open history.js and fill in the `history_request` variable by following fetch.png
3. After step 2, remove values of ctoken, continuation and itct params in url and make it dynamic by doing `${ctoken}` (ctoken, continuation) and `${itct}` (itct)


# After Instructions - Get history stats using these commnads
*Print on terminal* \
`node app.js`

*Save it in a file* \
`node app.js > stats.txt`
