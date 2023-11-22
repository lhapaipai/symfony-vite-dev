```bash
# window 70x16
asciinema rec asciinema/install.cast

# replay faster
asciinema rec -c 'asciinema play -s 2 asciinema/install.cast' asciinema/install-2x.cast

# export
npx svg-term --in asciinema/install-2x.cast --out src/public/animations/install.svg --window
```

add this to your markdown template `![install](/animations/install.svg)`.
