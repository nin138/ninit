export interface Config {
  group: string
  project: string
  version: string
  root: string
  outDir: string
  dependency: Array<string> //["std"]
  indexPath: string
}