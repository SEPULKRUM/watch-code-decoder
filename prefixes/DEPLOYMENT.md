# Public prefix decoder and watch library

This folder is a self-contained static copy of the Casio model-prefix decoder and watch library, built from `SEPULKRUM/casio-watch-specs` at the source commit recorded in `deployment-manifest.json`. The case-back decoder in the repository root is separate.

Public URL: https://sepulkrum.github.io/watch-code-decoder/prefixes/

Independent beta backup: https://sepulkrum-casio-specs-beta.miniatureagave.chatgpt.site/ (its sharing settings are managed separately). This is a retained snapshot, not an automatic backup service.

To update the public copy, run the source repository tests, `python catalog.py build --check`, and `python build_web.py --output <temporary-directory>`. Replace only this folder's built assets, update the manifest, and verify the root decoder is unchanged. Keep this deployment note. The Refresh data button loads a coherent dataset bundle from the research repository; application-code updates require a new static build.

The manifest records SHA-256 checksums for all copied assets and datasets. Pending identifiers and research claims retain their existing status; deployment does not verify their specifications.
