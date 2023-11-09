declare module "virtual:symfony/controllers" {
  const modules: {
    identifier: string;
    controllerLoader: () => any;
  }[];
  export default modules;
}
