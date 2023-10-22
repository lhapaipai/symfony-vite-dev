
```bash

docker volume create caddy_data

docker compose build

docker compose up -d --wait

# if you want to share your caddy certificates between your different docker caddy instances. only for development
# add Caddy Docker local root ca certificate into ca-certificates and trust-stores.
./ca-trust.sh add

make npm-install
make vite-dev
```