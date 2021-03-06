const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

let newCpt = {};

function camel2Dash(text, separator = '-') {
  const str = text[0].toLowerCase() + text.substr(1);
  return str.replace(/([A-Z])/g, $1 => `${separator}${$1.toLowerCase()}`);
}

function main() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: '组件英文名(每个单词的首字母都大写，如TextBox)：',
        validate: function(value) {
          var pass = value && value.match(/^[A-Z]/);
          if (pass) {
            return true;
          }
          return '不能为空，且每个单词的首字母都要大写，如TextBox';
        },
      },
      {
        type: 'input',
        name: 'chnName',
        message: '组件中文名(十个字以内)：',
      },
      {
        type: 'input',
        name: 'desc',
        message: '组件描述(五十个字以内)：',
      },
      {
        type: 'input',
        name: 'category',
        message: '组件分类：',
      },
    ])
    .then(answers => {
      newCpt = answers;
      createNew();
    });
}

function createIndexJs() {
  return new Promise((resolve, reject) => {
    const nameLc = camel2Dash(newCpt.name);
    let content = `import * as React  from 'react';
  export interface ${newCpt.name}Props {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
  }

export default class ${newCpt.name} extends React.PureComponent<${newCpt.name}Props,any>{
  
  static defaultProps = {
    prefixCls: 'Yep-${nameLc}',
    style: {},
  }
  
  constructor(props:${newCpt.name}Props){
    super(props)
  }
  
  render(){
    
    return (
      <div>
      
      </div>
    )
  }
}`;

    const dirPath = path.join(__dirname, `../src/${nameLc}/`);
    const filePath = path.join(dirPath, `index.tsx`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFile(filePath, content, err => {
      if (err) throw err;
      resolve(`生成index.jsx文件成功`);
    });
  });
}

function createStyle() {
  return new Promise((resolve, reject) => {
    const nameLc = camel2Dash(newCpt.name);
    let scssContent = `
@import '../../style/mixin';

.Yep-${nameLc} {
  
} 
`;
    let jsContent = `
import '../../style';
import './index.scss'; 
`;

    const dirPath = path.join(__dirname, `../src/${nameLc}/style/`);
    const filePath = path.join(dirPath, `index.scss`);
    const jsFilePath = path.join(dirPath, `index.tsx`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFile(filePath, scssContent, err => {
      if (err) throw err;
      console.log('生成scss文件成功');
      fs.writeFile(jsFilePath, jsContent, err => {
        if (err) throw err;
        resolve(`生成style/index.tsx文件成功`);
      });
    });
  });
}

function createDoc() {
  return new Promise((resolve, reject) => {
    const nameLc = camel2Dash(newCpt.name);

    const docContent = `---
category: ${newCpt.category}
title: ${newCpt.chnName}
---

${newCpt.desc}

<DEMO>

| 参数 | 说明 | 类型 | 默认值
| --------- | -------- | --------- | --------
| prefixCls | 组件class前缀 | string | Yep-${nameLc}
| style | 组件样式 | object | {}
| className | 组件额外样式 | string | -

`;

    const dirPath = path.join(__dirname, `../src/${nameLc}/`);
    const filePath = path.join(dirPath, `index.md`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFile(filePath, docContent, err => {
      if (err) throw err;
      console.log('生成文档模板文件成功');
      resolve(`生成文档模板文件成功`);
    });
  });
}

function createDemo() {
  return new Promise((resolve, reject) => {
    const nameLc = camel2Dash(newCpt.name);
    const demoContent = `---
order: 0
title: 基础用法
description: 
---

\`\`\`js
import React from 'react';
import {${newCpt.name}} from "@jdcfe/yep-react";

class Demo extends React.PureComponent {

  render() {
    return (
      <div>
      <${newCpt.name} />
    </div>
    );
  }
}

ReactDOM.render(<Demo/>,  mountNode);

\`\`\`
    
`;

    const dirPath = path.join(__dirname, `../src/${nameLc}/demo/`);
    const filePath = path.join(dirPath, `basic.md`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFile(filePath, demoContent, err => {
      if (err) throw err;
      console.log('生成示例模板文件成功');
      resolve(`生成示例模板文件成功`);
    });
  });
}

/**
 * 向入口添加组件
 * @returns {Promise<any>}
 */
function addInToIndex() {
  return new Promise((resolve, reject) => {
    const nameLc = camel2Dash(newCpt.name);
    const exportContent = `export {default as ${newCpt.name}} from './${nameLc}';`;
    fs.appendFile('./src/index.tsx', exportContent, err => {
      if (err) throw err;
      console.log('生成组件添加入口文件成功');
      resolve(`生成组件添加入口文件成功`);
    });
  });
}

function createNew() {
  createIndexJs()
    .then(() => {
      return createDoc();
    })
    .then(() => {
      return createStyle();
    })
    .then(() => {
      return createDemo();
    })
    .then(() => {
      return addInToIndex();
    })
    .then(() => {
      console.log('组件模板生成完毕，陈独秀请开始你的表演吧~');
      process.exit();
    });
}

main();
