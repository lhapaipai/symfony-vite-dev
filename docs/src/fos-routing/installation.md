# Fos Routing

FosRoutingBundle allows you to expose your routing in your JavaScript code. That means you'll be able to generate URL
with given parameters like you can do with the Router component provided in the Symfony2 core. The bundle only supports
Webpack Encore out of the box, but you can use it with Vite by following the instructions below.

::: warning
🧪 If you are running your frontend on an enclosed dev environment (ex. your app has two separate docker containers for
frontend and backend.) from your symfony application, remember that you have to install composer on that container and
to allow access to your backend files.
:::

## Installation

Run the following commands to add the bundle to your project and the necessary dependencies to your package.json.

```bash
 composer require friendsofsymfony/jsrouting-bundle
 yarn add -D ./vendor/friendsofsymfony/jsrouting-bundle/Resources/ # optional
```

If you are not using Symfony Flex please
follow [this](https://github.com/FriendsOfSymfony/FOSJsRoutingBundle/blob/master/Resources/doc/installation.rst)
installation guide.
