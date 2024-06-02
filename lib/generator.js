const { getRepoList } = require('./http');
const ora = require('ora');
const inquirer = require('inquirer');
const util = require('util');
const path = require('path');
const chalk = require('chalk')
const downloadGitRepo = require('download-git-repo'); // 不支持 Promise

async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
        const res = await fn(...args);
        spinner.succeed();
        return res;
    } catch (error) {
        spinner.fail('Request failed, refetch ...')
    }
}

class Generator {
    constructor (name, targetDir){
      // 目录名称
      this.name = name;
      // 创建位置
      this.targetDir = targetDir;
      this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async getRepo() {
        // 1）从远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
        if (!repoList) return;
    
        // 过滤我们需要的模板名称
        const repos = repoList.map(item => item.name);
    
        // 2）用户选择自己新下载的模板名称
        const { repo } = await inquirer.prompt({
          name: 'repo',
          type: 'list',
          choices: repos,
          message: 'Please choose a template to create project'
        })
    
        // 3）return 用户选择的名称
        return repo;
    }

    async download(repo){

        // 1）拼接下载地址
        const requestUrl = `zhangxilong-43/${repo}`;
    
        // 2）调用下载方法
        await wrapLoading(
          this.downloadGitRepo, // 远程下载方法
          'waiting download template', // 加载提示信息
          requestUrl, // 参数1: 下载地址
          path.resolve(process.cwd(), this.targetDir)
        )
    }

    // 核心创建逻辑
    async create(){
        const repo = await this.getRepo()
        console.log(`用户选择了模版：${repo}`);

        await this.download(repo)
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  yarn\r\n')
        console.log('  yarn start\r\n')
    }
  }
  
  module.exports = Generator;
  