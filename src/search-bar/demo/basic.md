---
order: 0
title: 基础用法
description: 输入内容进行搜索，可一键清空搜索内容。
---

```js
import React from 'react';
import {SearchBar} from '@jdcfe/yep-react';

class Demo extends React.PureComponent {
  state = {
    value: '',
  };
  render() {
    return (
      <SearchBar
        onSearch={() => console.log('跳搜索结果页面')}
        clearable={true}
        placeholder={'请输入您要搜索的商品'}
        value={this.state.value}
        onChange={value => this.setState({value})}
      />
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
