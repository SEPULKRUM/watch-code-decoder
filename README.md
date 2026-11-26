# watch-code-decoder
Sepulkrum Watch Code Decoder

Six-character legacy month update (26 November 2026): numeric-year inputs may
use the community-reported O/N/D month convention (October/November/December).
`6N033C` is accepted as a conditional November reading; the year ends in 6 but
the decade is unresolved. Its trailing `033C` remains undecoded. The O/N/D
aliases are not applied to the modern alphabetic-year format. Collector
references are linked in the page's research notes; this is not an official
universal Casio decoding key. Run `node tests/legacy-six.test.cjs` before
publishing changes to this parser.
